# MMH Report Hub — quy tắc làm việc cho Claude

Ứng dụng một file: `index.html` (GitHub Pages từ nhánh `main` → https://manimedicalhanoi.github.io/MMH-Report/).
Người dùng là nhân sự MANI Medical Hanoi — **trả lời và viết nội dung bằng tiếng Việt**.

## Quyền đã được chủ repo cho phép
- Khi người dùng bảo sửa / gộp: **chủ động** commit → tạo PR → **squash merge vào `main`**, không cần hỏi lại.
- Repo để public là chấp nhận được (chủ repo đã xác nhận).

## BẮT BUỘC sau MỖI lần thay đổi tính năng / sửa lỗi (người dùng nhìn thấy được)
Làm trong cùng PR với thay đổi code:

1. **Tăng số phiên bản** trên badge cạnh chữ "MMH Report" trong `index.html`
   (tìm `id="ver-badge"`, ví dụ `v15.2` → `v15.3`) và tham số cache `updates/notes.js?v=15.3`.
2. **Thêm thông báo** vào ĐẦU mảng `window.MMH_UPDATES` trong `updates/notes.js`:
   - `id` duy nhất dạng `YYYY-MM-DD-vX.Y` (không đổi sau khi phát hành), `version`, `date` = ngày phát hành,
   - `title`, `summary` ngắn gọn, dễ hiểu cho người không rành kỹ thuật,
   - `items`: mỗi thay đổi 1 mục `{type:"new"|"imp"|"fix", icon, title, text, img}` — viết theo kiểu
     *bấm vào đâu → làm gì → kết quả*, tối đa 2–3 câu.
   - App tự hiện thông báo khi đăng nhập trong **7 ngày** kể từ `date`; người dùng tick "Không hiển thị lại" để ẩn;
     bấm badge phiên bản để xem lại toàn bộ lịch sử.
3. **Ảnh minh hoạ thật** (chụp từ chính app, dữ liệu giả lập) lưu ở `updates/vX.Y/*.jpg`:
   - Thêm cảnh mới vào `tools/guide/cap.js` (đối tượng `S`), mock backend trong `tools/guide/mock.js`.
   - Chạy: `NODE_PATH=$(npm root -g) node tools/guide/cap.js <tên cảnh>` → ảnh ở `tools/guide/shots/`.
   - Đánh số chú thích màu cam: khai báo `marks:[[selector, số, 'tl'|'tr', khung?]]` trong `shot()`.
   - Xuất ảnh cho thông báo: dựng slide/khung trong `tools/guide/build.js` rồi
     `node tools/guide/noteimg.js updates/vX.Y` (sửa danh sách `PICK`), hoặc cắt thẳng từ ảnh chụp:
     `node tools/guide/shot2jpg.js <tên cảnh> updates/vX.Y/<tên>.jpg [x y w h] [rộng]`.
   - JPEG chất lượng ~82, rộng ≤ 1300px; mỗi ảnh nên < 200 KB.
4. **Tính năng lớn** (nhiều bước thao tác): làm thêm file PDF hướng dẫn ngang 16:9 ở `docs/HDSD_<tên>_vX.Y.pdf`
   (theo mẫu `tools/guide/build.js` + `deck.css`: ảnh thật, số chú thích, hyperlink tới các file nguồn) và đặt
   `guide:"docs/…pdf"` trong thông báo. Quy trình: `cap.js` (mọi cảnh) → `tojpg.js` → `build.js` → `PDF=1 node render.js`
   → copy `tools/guide/out.pdf` vào `docs/`. Gửi file PDF cho người dùng để họ lưu thêm vào thư mục HDSD trên Drive:
   https://drive.google.com/drive/folders/1qrY9IGdSRSOUZnIkJSvjLaEXYJceBfY6
5. Kiểm thử bằng Playwright (Chromium có sẵn, `page.route(/script\.google\.com/)` để giả lập backend) trước khi push;
   kiểm tra cú pháp các khối `<script>` bằng `node --check`.

Sửa nhỏ không ảnh hưởng người dùng (refactor, comment) thì không cần thông báo.

## Phong cách giao diện (người dùng yêu cầu: đơn giản, nhã nhặn)
- Font **Aptos** cho mọi chữ, kể cả thông báo / hộp thoại.
- Bảng màu brand MMH dịu: navy `#003047` (tiêu đề), blue `#3A5CAA` (nút chính), xanh nhạt `#CFE2F3` / `#F0F7FF`,
  xám viền `#E6EAEF`. Màu theo loại lịch chỉ dùng làm **vạch / chấm nhỏ** (`KIND` trong MMH Calendar).
- Tránh nền đậm, gradient, viền sọc, bóng đổ nặng, emoji màu dày đặc. Thông báo = thẻ trắng, viền mảnh.
- Lớp CSS chung ở `<style id="calm-css">` cuối `index.html` — giao diện mới nên tuân theo các token ở đó.

## Ghi chú kỹ thuật
- Các bản vá xếp lớp bằng `window.fn = …` trong các khối `<script>` thêm ở cuối file — giữ phong cách này.
- Backend: Google Apps Script (JSONP cho đọc, POST `URLSearchParams{action,payload}` cho ghi).
  Training Hub (`TRAINING_HUB_API`), Business Trip (backend Report Hub `GAS_URLS`), MMH Calendar Feed trong 2 file MKT.
  Code `.gs` không nằm trong repo — khi sửa backend, gửi file `.gs` cho người dùng tự dán & Deploy → New version.
- `script.google.com` bị chặn trong môi trường Claude: không gọi thật được, luôn dùng mock để test.
