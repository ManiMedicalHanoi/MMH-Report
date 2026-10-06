# Kết nối đa kênh — nhiều backend Apps Script, nhiều Google Sheet

## Mục lục
1. Bản đồ kết nối (làm đầu tiên)
2. Mẫu gọi: JSONP đọc, ghi an toàn, POST
3. Nhiều phòng ban / nhiều backend cùng app
4. Nguồn "feed" chỉ đọc + ghi ngược (Calendar Feed)
5. Khi KHÔNG có code backend
6. Bảo mật & quota
7. Mẫu backend

## 1. Bản đồ kết nối
Trước khi thêm/sửa kết nối, lập bảng (đưa luôn vào HDSD, có hyperlink):
| Nguồn | URL web app (`/exec`) | File sheet | Đọc / Ghi | Quyền truy cập | Ai giữ code `.gs` |
Tìm trong code: `grep -o "https://script.google.com/macros/s/[A-Za-z0-9_-]*" index.html | sort -u` và các biến `*_API`, `GAS_URLS`.

## 2. Mẫu gọi
- **Đọc = JSONP** (`<script src="…/exec?action=list&callback=cb">`): không vướng CORS, chạy cả với web app "Anyone within domain"
  (trình duyệt gửi cookie Google). Timeout 20–30 s (lần đầu Apps Script khởi động nguội có thể 10–60 s ⇒ cho `boot` 60 s).
- **Thẻ script lỗi** thường do Google chuyển hướng sang trang chọn tài khoản (máy đăng nhập nhiều Gmail) ⇒ với lệnh đọc, thử
  lại 1 lần bằng `fetch` GET rồi bóc JSON; vẫn lỗi thì hướng dẫn mở cửa sổ ẩn danh / chọn đúng tài khoản.
- **Ghi**: qua hàng đợi (outbox.md). Mỗi lệnh có `rid`; gửi kèm `actor` (người thao tác), `expect` (tên hiện tại của dòng).
- **POST** khi dữ liệu dài (URL > 7.500 ký tự): `fetch(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(b)})`
  — `text/plain` để không bị preflight CORS; backend `doPost` đọc `e.postData.contents`. Web app "Anyone" thường đọc được
  phản hồi; nếu không (`no-cors`) thì coi là "không chắc" và xác minh theo `rid` (action `status&rid=`).
- Backend nhiều chức năng (Training Hub…) có thể nhận `URLSearchParams{action, payload: JSON}` — giữ đúng định dạng backend đó dùng.

## 3. Nhiều phòng ban / nhiều backend
- Giữ map `GAS_URLS = {marketing:…, backoffice:…, management:…}` và **chụp URL tại lúc bấm** cho mọi lệnh ghi (biến toàn cục
  `GAS_URL` đổi theo tab là nguồn lỗi ghi nhầm).
- Backend trả `source` trong mọi phản hồi đọc; client so với nguồn đang mở — lệch thì **chặn hiển thị**, xoá cache sai, báo
  "Backend X đang chạy code của Y — dán lại Code.gs đúng rồi Deploy ▸ New version".
- Cache theo nguồn (`localStorage` riêng từng nguồn) ⇒ chuyển tab hiện ngay; tải sẵn các nguồn khác sau đăng nhập.
- Lệnh "dùng chung" (gửi email, đề xuất công tác) có thể đi qua backend của nguồn chính khi nguồn hiện tại không có module đó —
  tạm đổi URL trong 1 lời gọi đồng bộ (`var keep=GAS_URL; GAS_URL=…; try{ return apiPost(b); } finally { GAS_URL=keep; }`).
- Tính năng cần lưu trữ dùng chung mà backend chính không sửa được ⇒ đặt ở backend khác mình kiểm soát (sheet riêng, ví dụ
  `RH_Assign` trong file Training), giao tiếp qua khoá cầu nối (`rhKey`) + `actor`.

## 4. Feed chỉ đọc + ghi ngược
Nhiều file sheet (sự kiện, bài đăng, lịch công tác) được đọc qua 1 web app "feed" giới hạn trong domain. Khi cần sửa ngay trên app:
- `options&kind=…` đọc Data validation của các cột ⇒ form có đúng danh mục (cache 6 giờ trên client).
- `write&op=update|add|delete&kind=…&row=…&check=<giá trị khoá>&data=<JSON chỉ các ô đã đổi>`: backend xác nhận đúng dòng
  bằng `check`, **không ghi ô có công thức**, ghi nhật ký (Script Properties / tab `_log`), danh sách người được sửa (`EDITORS`).
- Ghi bằng JSONP GET (vì domain-restricted) ⇒ giữ URL ngắn: chỉ gửi trường đã đổi (thêm mới thì gửi mọi trường đã điền).
- Định dạng ngày theo đúng sheet (ví dụ `yyyymmdd`, `yyyymmdd-dd`, tháng `yyyymm`) — đọc mẫu dữ liệu thật trước khi viết.

## 5. Khi KHÔNG có code backend
- Không đoán tên action: tìm trong frontend các action đang dùng; thử action mới phải chịu được `Unknown action` (báo người
  dùng cần cập nhật backend thay vì lỗi khó hiểu).
- Khi sửa backend: viết **file `.gs` đầy đủ** (không phải đoạn vá), ghi số phiên bản trong tên file, gửi cho người dùng kèm các
  bước: mở Apps Script ▸ dán ▸ Lưu ▸ Deploy ▸ Manage deployments ▸ Edit ▸ New version ▸ Deploy. Frontend vẫn chạy với bản cũ.
- Đề xuất đưa code `.gs` vào repo (thư mục `backend/`, hoặc repo riêng private nếu repo app public) và dùng `clasp` để triển khai.

## 6. Bảo mật & quota
- Repo public ⇒ mọi URL `/exec`, khoá cầu nối trong JS đều công khai. Không đặt bí mật thật ở client.
- "Đăng nhập bằng cách chọn tên" không phải xác thực: ai có link cũng chọn tên người khác được. Hướng nâng cấp: web app
  "Anyone within <domain>" + `Session.getActiveUser().getEmail()` làm `actor` phía máy chủ (không tin `actor` từ client), hoặc
  Google Identity Services (ID token) + kiểm tra ở backend.
- Quota Apps Script: thời gian chạy 6 phút/lần, ~30 lần chạy đồng thời, MailApp 100 (Gmail thường) / 1.500 (Workspace) người
  nhận/ngày, UrlFetch 20k–100k/ngày. Polling `version` mỗi 12 s × số người dùng ⇒ tính trước; trả `version` từ
  `PropertiesService`/`CacheService` (không mở sheet).

## 7. Mẫu backend
`assets/gas/Code_template.gs`: router `doGet`/`doPost`, JSONP, `LockService` + chống trùng `rid` qua `CacheService` (6 giờ),
vân tay `version`, cột ID cố định + kiểm `expect`, bỏ qua ô công thức, `options` từ Data validation, `actor` từ
`Session.getActiveUser()`, nhật ký `_log`.
