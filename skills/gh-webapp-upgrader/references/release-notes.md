# Phát hành: phiên bản, thông báo trong app, ảnh thật, PDF hướng dẫn

## Mục lục
1. Checklist mỗi bản phát hành
2. Thông báo trong app (`updates/notes.js` + module UPD)
3. Viết nội dung thông báo
4. Ảnh minh hoạ thật
5. PDF hướng dẫn 16:9
6. Email / tin nhắn thông báo cho mọi người

## 1. Checklist (cùng PR với code)
- [ ] Badge phiên bản tăng (`id="ver-badge"`: v1.2 → v1.3) và tham số cache `updates/notes.js?v=1.3` (không tăng ⇒ trình duyệt
      giữ notes cũ, thông báo mới không hiện).
- [ ] Mục mới ở **đầu** `window.APP_UPDATES`, `id` = `YYYY-MM-DD-vX.Y` (không bao giờ đổi sau khi phát hành), `date` = ngày phát hành.
- [ ] Ảnh `updates/vX.Y/*.jpg` (JPEG ~82, rộng ≤ 1.300 px, < 200 KB mỗi ảnh), chụp từ chính app với dữ liệu giả lập.
- [ ] Tính năng nhiều bước ⇒ `docs/HDSD_<Tên>_vX.Y.pdf` + `guide:"docs/…pdf"` (+ `folder:` link thư mục HDSD nếu có).
- [ ] `node --check updates/notes.js`; mở thông báo bằng Playwright, chụp xem có vỡ bố cục không.
- [ ] Sửa nhỏ không ảnh hưởng người dùng (refactor, comment, công cụ) ⇒ không cần thông báo.

## 2. Thông báo trong app
`assets/update-notice.html` (dán trước `</body>`, gọi `UPD.start({user, ready, days:7})`):
- Tự hiện khi đăng nhập nếu có mục trong 7 ngày gần nhất mà người dùng chưa tick "Không hiển thị lại" (lưu theo từng người).
- Nhiều mục còn hạn ⇒ tab theo phiên bản. Bấm ảnh ⇒ phóng to. Nút "📘 Hướng dẫn chi tiết (PDF)" nếu có `guide`.
- Bấm badge phiên bản ⇒ xem toàn bộ lịch sử (chế độ thủ công, không có ô tick, ghi "tự hiện thêm n ngày").
- Popup khác dùng `UPD.queue(fn)` để không chồng lên thông báo. Thứ tự gợi ý khi đăng nhập: Cập nhật → Nhắc hạn → Việc mới
  được giao → Thư nhắc việc hằng ngày.
- Lưu trữ nằm trong git (repo): thông báo, ảnh, PDF đều được GitHub Pages phục vụ ⇒ không cần Drive. Drive chỉ để người dùng
  lưu thêm bản PDF cho đồng nghiệp.

## 3. Viết nội dung
- `title` (chữ thuần): kết quả người dùng nhận được, không phải tên kỹ thuật. Tốt: "Thêm việc hiện ngay, không phải chờ".
  Tránh: "Refactor optimistic outbox".
- `summary`: 1–2 câu tổng quát.
- Mỗi `item`: `type` new/imp/fix, `icon` 1 emoji, `title` ngắn, `text` 2–3 câu theo mẫu **bấm vào đâu → làm gì → kết quả**,
  in đậm tên nút đúng như trên giao diện. Ví dụ: "Bấm nút nhỏ <b>✏️ Sửa</b> ở góc trên → biểu mẫu mở ngay trong khung. Bấm
  <b>Lưu</b>: lịch đổi ngay, góc trên báo “Đang lưu…” → “✓ Đã lưu”."
- Nêu giới hạn thật thà khi cần ("cần quản lý cập nhật backend", "chỉ áp dụng cho bài của nhóm Marketing").
- Nhãn hiển thị phải theo đúng chữ người dùng yêu cầu (ví dụ họ muốn "Email từ Thương", không phải "Thương giao").

## 4. Ảnh minh hoạ thật
Công cụ trong `tools/guide/` (cài bằng `scripts/init_kit.sh`):
- `cap.js`: mỗi "cảnh" = mở app với backend giả lập (`mock_gas.js`) → thao tác → `shot(p, 'ten', {clip:'#vùng', marks:[[selector, số, 'tl'|'tr', khung?]]})`.
  Ảnh `shots/<ten>.png` (scale 2×) + `<ten>.json` (toạ độ số chú thích tương đối).
  Chạy: `NODE_PATH=$(npm root -g) node tools/guide/cap.js ten1 ten2`.
- Ảnh cho thông báo: `node tools/guide/shot2jpg.js <ten> updates/vX.Y/<file>.jpg [x y w h] [rộng]` (cắt theo tỉ lệ 0–1).
- Ghép nhiều ảnh (ví dụ 4 tông màu): `node tools/guide/collage.js updates/vX.Y/cac-tong.jpg sage lavender sand rose`.
- Ảnh có số chú thích màu cam: dựng khung trong deck rồi xuất bằng `noteimg.js <thư mục ra> '[[slide, khung, "tên"]]'`.
- Luôn **xem lại ảnh** (đọc file ảnh) trước khi đưa vào thông báo: hay gặp popup khác che, nút bị cắt, dữ liệu giả trông vô lý.
- Ảnh không được chứa dữ liệu thật của công ty (tên khách hàng, số tiền thật) — dùng `data.json` giả lập.

## 5. PDF hướng dẫn 16:9
Khi nào: tính năng có ≥ 3 bước thao tác, nhiều vai trò (người giao / người nhận), hoặc người dùng yêu cầu.
1. Chụp mọi cảnh cần (`cap.js`) → `node tools/guide/tojpg.js` (PNG → JPG cho nhẹ).
2. Copy `build_example.js` thành `build_vX.Y.js`: bìa (tag "THÔNG BÁO CẬP NHẬT · vX.Y", tiêu đề, lợi ích, chips, link app, ảnh
   nghiêng), mỗi bước 1 slide (chữ trái = `steps([[1,'…'],…])` khớp số trên ảnh phải `fig({img, w, crop, map, boxes, frame})`),
   slide "Kết nối dữ liệu" với **hyperlink tới từng file sheet / web app nguồn**, slide quyền hạn (ai làm được gì), Hỏi đáp.
3. `node tools/guide/build_vX.Y.js && node tools/guide/render.js` → xem ảnh từng slide ở `tools/guide/prev/` và số "đáy nội dung"
   in ra (> 686 px là tràn xuống footer ⇒ giảm `w`/`maxH`, bớt chữ).
4. `PDF=1 node tools/guide/render.js` → copy `tools/guide/out.pdf` thành `docs/HDSD_<Tên>_vX.Y.pdf`.
5. Gửi file PDF cho người dùng (để họ lưu vào thư mục HDSD chung) và đặt `guide` trong thông báo.
Font: deck dùng font nhúng sẵn trong `tools/guide/fonts/` (Be Vietnam Pro — hỗ trợ tiếng Việt), không phụ thuộc máy.

## 6. Email / tin nhắn thông báo
Nếu người dùng muốn gửi email cho "mọi người": 5–8 dòng — chào, 3–4 gạch đầu dòng lợi ích chính (mỗi dòng 1 câu), link app,
link PDF/thư mục HDSD, người liên hệ khi có lỗi. Không dùng thuật ngữ kỹ thuật.
