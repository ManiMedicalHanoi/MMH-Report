# Hàng đợi ghi bền vững (OUTBOX)

## Mục lục
1. Vì sao cần
2. Cách hoạt động
3. Tích hợp vào app có sẵn
4. Chính sách theo loại lệnh
5. Giao diện trạng thái
6. Kiểm thử bắt buộc
7. Giới hạn cần nói rõ với người dùng

## 1. Vì sao cần
Triệu chứng điển hình: "thêm Key task rồi thêm Sub-task ngay, chuyển tab, chip 'Đang lưu' vẫn chạy rồi báo không ghi được".
Nguyên nhân thường gặp cùng lúc:
- Lệnh con chờ lệnh cha xong mới gọi `apiPost` ⇒ lúc đó biến URL backend (`GAS_URL`) đã đổi theo tab ⇒ ghi nhầm backend.
- Lệnh cha nhận phản hồi "không chắc" (JSONP lỗi / timeout) ⇒ không có số thật ⇒ lệnh con bị huỷ.
- Apps Script bận (LockService) trả `Lock timeout` ⇒ không ai thử lại.
- Đóng tab giữa chừng ⇒ mất lệnh.

## 2. Cách hoạt động (`assets/outbox.js`)
1. `APP_OUTBOX.add(body)` lưu lệnh vào `localStorage` (kèm URL backend + nguồn lúc bấm, `rid` riêng, người dùng, tab) và trả
   Promise. Giao diện đã được app cập nhật trước đó.
2. Mỗi backend chạy **1 lệnh một lúc, đúng thứ tự bấm** ⇒ cha luôn trước con, không tranh khoá.
3. Trước khi gửi: thay mọi giá trị `tmp-…` bằng số thật (bảng `tmp → no`, lưu 2 ngày); nếu lệnh tạo ra số đó còn chờ thì đợi;
   nếu nó đã lỗi thật thì lệnh này dừng theo với lý do "Đang chờ lưu …". Hook `prepare(op, body)` để đặt `expect` (tên hiện tại).
4. Gửi bằng JSONP (GET); URL > 7.500 ký tự ⇒ POST (đọc được phản hồi nếu backend cho CORS, không thì coi là "không chắc").
5. Xử lý phản hồi:
   - `ok` ⇒ xong; nếu là lệnh tạo (`__tmp`) và có `no` ⇒ ghi bảng số thật, gọi `onCreated` để đổi số trên giao diện.
   - lỗi tạm thời (khoá, bận, mạng, timeout) ⇒ thử lại giãn dần 1,5 s → 3 → 6 → … tối đa 60 s, **cùng `rid`**.
   - "không chắc" ⇒ lệnh tạo: `verify(op)` đọc lại dữ liệu tìm bản ghi vừa tạo (theo tên + người, loại các số đã có trước đó /
     đã thuộc số tạm khác); thấy ⇒ xong, không thấy ⇒ gửi lại cùng `rid`. Lệnh sửa/xoá: gửi lại 1 lần rồi coi là xong.
   - máy chủ báo trùng (`dedup`) mà không trả `no` ⇒ chuyển sang `verify`.
   - "không khớp / không tìm thấy" + có `resync` ⇒ đọc lại danh sách, tìm dòng theo tên, sửa `body.no`, gửi lại (tối đa 2 lần).
   - lỗi thật khác ⇒ trạng thái `fail`: giữ lệnh, chip đỏ, bảng Thử lại / Bỏ. Lệnh có `ui:true` (hộp thoại đang chờ, ví dụ gửi
     email) thì trả lỗi cho hộp thoại thay vì giữ.
6. Vòng đời trang: lease 15 s theo tab (gia hạn mỗi 5 s); `pagehide` nhả lease và đặt cờ `GONE` (vì `visibilitychange` chạy
   sau `pagehide`); trang mở lại nhận lệnh dở ngay (lệnh đang "run" được coi là "không chắc" ⇒ verify trước). Nhiều tab: tab
   khác chỉ nhận lệnh khi lease hết hạn; nếu lỡ gửi trùng thì `rid` chặn.
7. `beforeunload` hỏi xác nhận khi còn lệnh chờ (dữ liệu vẫn an toàn, chỉ là sẽ gửi ở lần mở sau).

## 3. Tích hợp vào app có sẵn
- Đặt điểm chặn ở **hàm ghi gốc** (ví dụ đầu `apiPost`): `if (APP_OUTBOX.handles(body.action)) return APP_OUTBOX.add(body);`
  — để mọi lớp bọc phía ngoài (đóng dấu ngày, báo hoàn thành…) chạy đúng 1 lần lúc bấm, không chạy lại mỗi lần thử.
- Lệnh bị hoãn (debounce 400 ms của ô nhập) phải chụp ngữ cảnh lúc gõ: `APP_OUTBOX.ctx = {url, src}` quanh lời gọi; xả hết
  khi `visibilitychange(hidden)` / `pagehide`.
- Thao tác tạo: truyền `__tmp: "<số tạm>"`; thao tác con dùng thẳng số tạm của cha — **không** chờ Promise của cha.
- Cấu hình tối thiểu:
```js
APP_OUTBOX.init({
  key: "myapp_outbox_v1", mapKey: "myapp_tmpmap_v1",
  policy: { addItem:{verify:true,label:"Thêm việc"}, addSub:{verify:true,label:"Thêm việc con"},
            updateItem:{resend:true,label:"Cập nhật"}, deleteItem:{resend:true,label:"Xoá"}, sendMail:{ui:true,label:"Gửi email"} },
  user: () => S.user && S.user.pic,
  endpoint: () => ({ url: GAS_URL, src: S.source }),
  current: () => S.source,
  verify: op => jsonpTo(op.url, {action:"list"}).then(r => findCreated(r, op)),   // trả {ok:true,no,verified:true} | null
  onCreated: (tmp, no) => { const o = findByNo(tmp); if (o) { o.no = no; o.__tmp = o.__pending = false; render(); } },
  onDone: (op, r) => { if (op.src === S.source) lightRefreshSoon(900); },
  overlay: ops => applyPendingToFreshData(ops)        // gọi sau mỗi lần dữ liệu máy chủ về (bọc setItems)
});
APP_OUTBOX.prepare = (op, b) => { const o = findByNo(b.no); if (o && o.__srvName) b.expect = o.__srvName; };
```
- Biến đếm "đang ghi" của app (để hoãn làm mới nền) = `APP_OUTBOX.pending(S.source)`.
- Gỡ mọi chỗ cũ "chờ số thật rồi mới gửi" (`_noWait[...].then(send)`) — gửi ngay với số tạm.

## 4. Chính sách theo loại lệnh
| Loại | verify | resend | ui | Ghi chú |
|---|---|---|---|---|
| Thêm bản ghi | ✓ | – | – | Sai lầm lớn nhất là gửi lại mù ⇒ dòng trùng |
| Sửa / đổi trạng thái / xoá | – | ✓ | – | Cần backend chống trùng `rid` + `expect` |
| Gửi email / thao tác tạo file | – | ✗ | ✓ | Không gửi lại khi không chắc (tránh 2 email) |
| Đề xuất / phiếu có `rid` riêng | – | ✓ | – | Đóng form ngay, hiện bản tạm "Chờ duyệt" |
Lệnh không có trong `policy` đi đường cũ (đọc, thao tác đặc biệt).

## 5. Giao diện trạng thái
Chip góc phải dưới (không để nút ＋ che): "Đang lưu… (n)" → "✓ Đã lưu"; "Mạng chậm — đang tự thử lại · n chờ lưu" (vàng
đất); "📴 Mất mạng — n thay đổi sẽ tự lưu khi có mạng"; "⚠️ n thay đổi chưa lưu được — bấm để xem" (đỏ). Bảng chi tiết liệt kê
từng thay đổi (tên, giờ, nguồn, lý do) với Thử lại / Bỏ / Thử lại tất cả. "Bỏ" ⇒ Promise reject "Đã bỏ thay đổi" ⇒ app gỡ bản tạm.

## 6. Kiểm thử bắt buộc (mock: `scripts/mock_gas.js`)
| Kịch bản | Cấu hình mock | Kỳ vọng |
|---|---|---|
| Thêm cha + con ngay + đổi nguồn | `lag:1500, flaky:{addKey:['drop']}` | hiện < 100 ms; 1 cha, 1 con, đúng backend |
| Máy chủ bận | `flaky:{update:['busy','busy']}` | chip "Mạng chậm", lần 3 ghi được |
| Lệnh mất hẳn | `flaky:{add:['lost']}` | verify không thấy ⇒ gửi lại ⇒ đúng 1 dòng |
| Tải lại khi đang ghi | `lag:4000` + `page.reload()` | bản tạm hiện lại ngay, gửi tiếp, log có `dup`, đúng 1 dòng |
| Sheet từ chối | handler trả `{ok:false,error:'Không tìm thấy…'}` | chip đỏ, bảng; Bỏ ⇒ gỡ khỏi giao diện |
`assets/demo/` có trang mẫu + `scripts/selftest_outbox.js` chạy đủ các kịch bản trên.

## 7. Giới hạn cần nói rõ
- Chống trùng phụ thuộc backend có kiểm `rid` (mẫu ở `assets/gas/Code_template.gs`). Nếu không có code backend để kiểm chứng,
  nói rõ với người dùng và đề nghị họ để ý dòng trùng.
- Dữ liệu chờ nằm trong trình duyệt của máy đó: đổi máy / xoá dữ liệu trình duyệt trước khi gửi xong thì mất.
- Tải file lên (base64 lớn) không nên đi qua hàng đợi `localStorage` (giới hạn ~5 MB) — dùng cơ chế riêng có `rid` + hỏi lại
  trạng thái theo `rid`.
