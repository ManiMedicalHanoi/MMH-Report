# Mẫu CLAUDE.md cho repo webapp (dán vào gốc repo, sửa phần <…>)

```markdown
# <Tên App> — quy tắc làm việc cho Claude

Ứng dụng: `index.html` (GitHub Pages từ nhánh `main` → <https://org.github.io/app/>).
Người dùng là <nhân sự công ty X> — **trả lời và viết nội dung bằng <tiếng Việt>**.

## Quyền đã được chủ repo cho phép
- Khi người dùng bảo sửa / gộp: <chủ động commit → tạo PR → squash merge vào `main`, không cần hỏi lại>.

## BẮT BUỘC sau MỖI thay đổi người dùng nhìn thấy (cùng PR)
1. Tăng phiên bản ở `id="ver-badge"` và `updates/notes.js?v=X.Y`.
2. Thêm mục lên ĐẦU `window.APP_UPDATES` (`updates/notes.js`): id `YYYY-MM-DD-vX.Y`, title chữ thuần, items
   `{type:"new"|"imp"|"fix", icon, title, text, img}` viết kiểu *bấm vào đâu → làm gì → kết quả*.
3. Ảnh thật (dữ liệu giả lập) ở `updates/vX.Y/*.jpg`: cảnh trong `tools/guide/cap.js`, mock ở `tools/guide/mock_gas.js`;
   `NODE_PATH=$(npm root -g) node tools/guide/cap.js <cảnh>` → `node tools/guide/shot2jpg.js <cảnh> updates/vX.Y/<tên>.jpg`.
4. Tính năng nhiều bước: PDF HDSD 16:9 `docs/HDSD_<tên>_vX.Y.pdf` (tools/guide/deckkit.js) + `guide:` trong thông báo;
   gửi PDF cho người dùng lưu vào <thư mục HDSD trên Drive>.
5. Kiểm thử Playwright với mock (không gọi được script.google.com) + `python3 tools/check_scripts.py index.html`.

## Phong cách giao diện
- Font <Aptos> cho mọi chữ. Màu qua biến `--t-pri --t-pri2 --t-ink --t-soft --t-line --t-bg` (chủ đề màu `data-theme`).
- Thẻ trắng, viền mảnh, không gradient / bóng nặng. Màu loại dữ liệu: vạch đậm + nền ~13%.
- Popup khi đăng nhập xếp hàng: Thông báo cập nhật → <…> → <…>.

## Ghi chú kỹ thuật
- Vá theo lớp `window.fn = …` trong khối `<script>` cuối file, ghi chú phiên bản.
- Backend: <danh sách web app /exec + file sheet>. Code `.gs` ở kho trung tâm riêng tư `<owner>/mmh-backend` (`backends.json` ▸
  `apps` có repo này). Sửa backend ⇒ sửa ở kho đó + PR ⇒ GitHub tự deploy; gộp backend trước frontend. Không bắt người dùng
  dán `.gs` / Deploy tay. Quy trình: skill gh-webapp-upgrader ▸ `references/backend-deploy.md`.
- Mọi lệnh ghi đi qua `APP_OUTBOX` (hàng đợi bền vững): giao diện đổi trước, không chờ, không màn hình loading.
```
