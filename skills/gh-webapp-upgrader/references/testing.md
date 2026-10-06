# Kiểm thử với backend giả lập

## Mục lục
1. Vì sao mock
2. Dựng trang test
3. Kịch bản chuẩn
4. Đo "hiện ngay"
5. Cạm bẫy Playwright
6. Trước khi push

## 1. Vì sao mock
Môi trường build thường không gọi được `script.google.com` (và không nên ghi vào sheet thật). `scripts/mock_gas.js` chặn mọi
request tới Apps Script bằng `page.route`, trả JSONP/JSON từ handler tự viết, có trạng thái (thêm/xoá được ghi nhớ), và giả
lập các sự cố thật: chậm (`lag`), dữ liệu cũ (`staleMs`), phản hồi hỏng sau khi đã ghi (`drop`), mất lệnh (`lost`), máy chủ bận
(`busy`), chống trùng `rid`, khoá ghi tuần tự, nhiều backend theo URL (`source`).

## 2. Dựng trang test
```js
const { chromium } = require('playwright'); const M = require('./mock_gas');
const b = await chromium.launch(); const p = await (await b.newContext({viewport:{width:1440,height:860}, locale:'vi-VN'})).newPage();
p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); p.on('dialog', d => d.accept());
await p.addInitScript(() => localStorage.setItem('app_user', 'Giang'));       // vào thẳng trạng thái đã đăng nhập
await M.install(p, { db, handlers, lag: 1500, flaky: { addItem: ['drop'] } });
await p.goto('file://' + path.resolve('index.html'));
```
- Chromium có sẵn trong môi trường: `NODE_PATH=$(npm root -g) node test.js`; không chạy `playwright install`.
- Dữ liệu giả lập để ở `tools/guide/data.json` — lấy cấu trúc từ phản hồi thật (cột, định dạng ngày) nhưng nội dung giả.
- Muốn giả lập người khác / ngày khác: đổi `localStorage` người dùng; `p.clock.setFixedTime(new Date('2026-10-15T09:00:00+07:00'))`.

## 3. Kịch bản chuẩn cho tính năng ghi dữ liệu
1. Bình thường: thao tác → giao diện đổi < 150 ms → sau khi máy chủ trả lời vẫn đúng → log mock đúng 1 lệnh ghi.
2. Chậm + dữ liệu cũ (`lag:4000, staleMs:15000`): bản vừa thêm không biến mất, bản vừa xoá không hiện lại, không trùng.
3. Phản hồi hỏng (`drop`), mất lệnh (`lost`), bận (`busy`): tự xử lý, đúng 1 dòng trên "máy chủ".
4. Đổi nguồn/tab ngay sau thao tác: lệnh vẫn tới đúng backend (kiểm cột `source` trong log mock).
5. Tải lại trang giữa chừng: thao tác dở hiện lại, được gửi tiếp, không trùng (log có `dup`).
6. Lỗi thật: chip đỏ, bảng Thử lại / Bỏ; Bỏ ⇒ giao diện trả lại như cũ; form giữ chữ đã gõ.
7. Hồi quy: các bài test cũ của repo (popup xếp hàng, thông báo, …) vẫn qua; `p.errs` rỗng.
Lưu các bài test vào repo (`tools/tests/`) để lần sau chạy lại — đừng chỉ để ở thư mục tạm.

## 4. Đo "hiện ngay"
`page.evaluate` **chờ Promise** mà hàm trả về ⇒ `await p.evaluate(() => doAdd(o))` sẽ đo cả thời gian ghi máy chủ. Bọc lại:
`await p.evaluate(() => { doAdd(o); })` rồi kiểm DOM ngay. Đo thời gian mở form: `Date.now()` trước `evaluate` → `waitForSelector`.

## 5. Cạm bẫy Playwright
- Hộp `beforeunload` mặc định bị dismiss ⇒ `reload()` bị huỷ ⇒ luôn `p.on('dialog', d => d.accept())`.
- `clock.setFixedTime` đóng băng `Date.now()` ⇒ vòng lặp chờ theo thời gian không bao giờ dừng ⇒ dùng bộ đếm số vòng.
- Popup khác (thư nhắc, thông báo) chặn `click` ("intercepts pointer events") ⇒ đóng popup trước hoặc gọi hàm trực tiếp.
- Phần tử có `pointer-events:none` (chip trạng thái ở trạng thái thường) không click được — chỉ bật khi cần bấm.
- Ảnh `file://` trong `setContent` có thể trắng ⇒ ghi HTML tạm ra file rồi `goto`.
- Route vẫn còn sau `reload()` (cùng page) — tốt cho test tải lại; handler đang `await lag` vẫn chạy tiếp dù trang cũ đã đi.

## 6. Trước khi push
- `python3 tools/check_scripts.py index.html` (cú pháp mọi khối script) + `node --check updates/notes.js`.
- Chạy toàn bộ bài test liên quan, đọc kết quả (không chỉ mã thoát).
- Xem lại ảnh chụp các màn hình đã đổi (đọc file ảnh) — lỗi bố cục không test nào bắt được.
- Đọc lại diff một lượt với câu hỏi "người dùng sẽ thấy gì nếu mạng chậm / bấm 2 lần / đổi tab giữa chừng?".
