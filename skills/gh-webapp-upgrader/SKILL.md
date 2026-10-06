---
name: gh-webapp-upgrader
description: >
  Nâng cấp, tối ưu, bảo trì webapp nội bộ trên GitHub Pages (thường 1 file index.html) nối Google Sheets qua Apps Script:
  giao diện nhã nhặn + nhiều chủ đề màu; thao tác "không chờ" (hiện ngay, ghi ngầm, hàng đợi ghi bền vững tự thử lại);
  kết nối đa kênh tới nhiều sheet / nhiều backend; quy trình phát hành chuẩn — tăng phiên bản, thông báo cập nhật trong app,
  ảnh chụp thật bằng Playwright + backend giả lập, PDF hướng dẫn ngang 16:9. Dùng BẤT CỨ KHI NÀO người dùng muốn sửa lỗi,
  cải tiến UI/UX, thêm tính năng, tăng tốc, đổi màu, thêm kết nối sheet, làm thông báo cập nhật / HDSD, hay đánh giá tổng thể
  một webapp GitHub (github.io, Apps Script /exec, JSONP, doGet/doPost) — kể cả khi chỉ nói "app chậm", "bấm phải chờ
  loading", "làm app đẹp hơn", "kết nối thêm file sheet", "đánh giá hệ thống", "sửa backend", "deploy Apps Script",
  "đưa backend vào mmh-backend" (sửa & tự deploy .gs qua kho trung tâm, không bắt người dùng dán code).
  Không dùng để tạo webapp mới từ đầu (dùng mmh-webapp-builder nếu có).
---

# Nâng cấp WebApp GitHub Pages + Google Sheets

Skill này đóng gói cách làm đã được kiểm chứng trên một hệ thống thật (≈15.000 dòng, 1 file `index.html`, 3 backend phòng ban
+ 4 nguồn dữ liệu Google Sheet khác). Mục tiêu của mọi thay đổi: **người dùng không bao giờ phải chờ**, **không bao giờ mất dữ
liệu đã gõ**, **giao diện bình tĩnh, dễ đọc**, và **mỗi bản cập nhật đều được báo rõ ràng trong app**.

Người dùng của loại app này thường là nhân sự văn phòng không rành kỹ thuật. Trả lời và viết nội dung (thông báo, HDSD,
commit tóm tắt cho họ) bằng **ngôn ngữ của người dùng** (thường là tiếng Việt), câu ngắn, kiểu *bấm vào đâu → làm gì → kết quả*.

## 1. Lần đầu làm việc với một repo

1. Đọc `CLAUDE.md` / `README` của repo nếu có — quy tắc ở đó được ưu tiên hơn skill này.
2. Khảo sát nhanh (đừng đọc cả file 1 MB): kích thước, số khối `<script>`/`<style>`, các URL `script.google.com/.../exec`,
   các khoá `localStorage`, hàm ghi dữ liệu (`apiPost`, `fetch(..., {method:"POST"})`, JSONP), cách đăng nhập.
   Lệnh gợi ý: `grep -o "https://script.google.com/macros/s/[A-Za-z0-9_-]*" index.html | sort -u`.
3. Nếu repo chưa có "bộ khung phát hành", cài bằng `bash scripts/init_kit.sh <repo>` — script chép vào repo:
   `updates/notes.js` (dữ liệu thông báo), `tools/guide/*` (chụp ảnh, mock backend, dựng PDF), `tools/check_scripts.py`,
   và in ra đoạn HTML cần dán (module thông báo cập nhật, chủ đề màu). Sau đó viết các quy tắc vào `CLAUDE.md` của repo
   (mẫu ở `references/claude-md-template.md`) để mọi phiên sau tự tuân theo.
4. Chưa rõ người dùng muốn gì ⇒ làm bản đánh giá tổng thể trước (`references/audit.md`), đề xuất theo thứ tự ưu tiên.
5. **Backend:** code `.gs` nằm ở **kho trung tâm riêng tư** (MMH: `ManiMedicalHanoi/mmh-backend`), deploy tự động qua GitHub
   Actions — đọc `references/backend-deploy.md`. Gắn kho đó vào phiên (`add_repo`), chạy `tools/scan-app.mjs` để biết backend
   của app đã có trong kho chưa; chưa có ⇒ thêm theo mục 3 của file đó (người dùng chỉ gửi Script ID khi được hỏi).

## 2. Quy trình chuẩn cho MỖI thay đổi người dùng nhìn thấy

1. **Hiểu đúng triệu chứng.** Tái hiện bằng mock trước khi sửa (đặc biệt lỗi "lúc được lúc không": mạng chậm, phản hồi hỏng,
   đổi tab giữa chừng, dữ liệu cũ từ máy chủ). Tìm nguyên nhân gốc, không vá triệu chứng.
2. **Sửa theo kiểu "lớp vá"** khi app là 1 file lớn: thêm khối `<script>`/`<style>` mới ở cuối, bọc hàm cũ bằng
   `var o=window.fn; window.fn=function(){ … return o.apply(this,arguments); }`. Ghi chú đầu khối: phiên bản + mục đích.
   Sửa thẳng vào hàm gốc chỉ khi lớp vá không thể đúng (ví dụ cần chặn trước mọi lớp bọc khác).
3. **Kiểm thử bằng Playwright + backend giả lập** (`references/testing.md`): kịch bản bình thường + chậm + lỗi + tải lại trang;
   chạy lại các bài test cũ; `python3 tools/check_scripts.py index.html` để kiểm tra cú pháp mọi khối script.
4. **Phát hành** (`references/release-notes.md`): tăng số phiên bản trên badge + tham số cache `notes.js?v=`; thêm mục thông báo
   lên ĐẦU `window.APP_UPDATES`; ảnh chụp thật vào `updates/vX.Y/`; tính năng nhiều bước ⇒ thêm PDF HDSD 16:9 ở `docs/`.
5. **Commit → PR → merge** theo quy ước của repo (nếu chủ repo đã cho phép thì tự squash-merge). Ghi rõ đã kiểm thử gì.
6. **Báo lại người dùng** ngắn gọn: đã sửa gì, họ sẽ thấy gì, giới hạn còn lại (ví dụ: chỉ kiểm thử bằng mock). Backend sửa
   qua kho trung tâm ⇒ báo phiên bản đã lên + cách quay lại; **không** bắt người dùng dán `.gs` / Deploy tay.

## 3. Nguyên tắc thiết kế — đọc file tham chiếu tương ứng khi đụng tới

| Chủ đề | Khi nào đọc | File |
|---|---|---|
| Giao diện nhã nhặn, token màu, 10 chủ đề màu, popup xếp hàng | đổi màu / làm đẹp / thêm hộp thoại | `references/ui-themes.md`, `assets/theme-kit.html` |
| Thao tác "không chờ": lạc quan, danh mục lưu sẵn, sửa tại chỗ, chống dữ liệu cũ | "phải chờ loading", "không hiện ngay", "chậm" | `references/instant-ux.md` |
| Hàng đợi ghi bền vững (OUTBOX) | "không ghi được", mất dữ liệu, mạng yếu, ghi trùng | `references/outbox.md`, `assets/outbox.js` |
| Kết nối đa kênh: nhiều backend Apps Script / nhiều sheet | thêm nguồn dữ liệu, ghi sang sheet khác, lỗi CORS/JSONP | `references/multi-backend.md`, `assets/gas/Code_template.gs` |
| Thông báo cập nhật trong app + ảnh thật + PDF HDSD | mọi bản phát hành | `references/release-notes.md`, `assets/update-notice.html` |
| Kiểm thử với backend giả lập | trước mọi lần push | `references/testing.md`, `scripts/mock_gas.js` |
| Sửa & tự deploy backend `.gs` qua kho trung tâm (không dán code) | mọi thay đổi backend, thêm app mới, lỗi deploy | `references/backend-deploy.md`, `assets/backend-repo/` |
| Đánh giá tổng thể hệ thống | người dùng hỏi "đánh giá", "cải tiến gì" | `references/audit.md` |

Năm nguyên tắc cốt lõi (lý do nằm trong các file trên):

1. **Hiện trước, ghi sau.** Mọi thao tác cập nhật giao diện ngay (< 100 ms), lệnh ghi chạy nền qua hàng đợi. Không dùng
   overlay "Đang tải…" cho thao tác của người dùng; chỉ dùng chip trạng thái nhỏ ở góc.
2. **Không bao giờ mất thao tác.** Lệnh ghi được lưu `localStorage`, gắn đúng backend lúc bấm, có mã `rid` để backend chống
   ghi trùng, tự thử lại; lỗi thật thì báo rõ + nút Thử lại / Bỏ; dữ liệu đã gõ trong form luôn được giữ khi lỗi.
3. **Dữ liệu mở sẵn.** Danh mục (dropdown, danh bạ, cấu hình) lưu `localStorage`, mở form bằng bản lưu sẵn, làm mới ngầm,
   tải trước sau đăng nhập. Lần mở app sau vẽ ngay từ cache rồi đồng bộ.
4. **Giao diện bình tĩnh và đổi được màu.** Màu qua biến CSS (`--t-pri`, `--t-ink`, …), không viết cứng màu brand; chủ đề
   đổi bằng `data-theme` trên `<html>` ⇒ tức thì, không vẽ lại. Màu mang nghĩa (loại sự kiện, trạng thái) giữ cố định.
5. **Mỗi bản cập nhật đều có thông báo.** Người dùng biết có gì mới, xem ảnh thật, có PDF khi cần — họ không phải hỏi.

## 4. Cạm bẫy đã gặp (đọc trước khi sửa phần liên quan)

- **JSONP ghi dữ liệu:** thẻ `<script>` lỗi không có nghĩa là chưa ghi (thường do Google chuyển hướng trang chọn tài khoản).
  Đừng tự gửi lại nếu backend không chống trùng theo `rid`; nếu có `rid` thì xác minh (đọc lại dữ liệu) rồi mới gửi lại.
- **Biến URL backend toàn cục** (`GAS_URL` đổi theo tab/phòng ban): lệnh ghi bị hoãn (chờ số thật, debounce 400 ms…) sẽ đi
  nhầm backend nếu người dùng chuyển tab. Luôn chụp URL tại lúc bấm.
- **Số dòng / số thứ tự thay đổi** khi có người xoá/chèn trên sheet ⇒ gửi kèm tên hiện tại (`expect`) để backend khoá đúng
  dòng; tốt hơn nữa là cột ID cố định.
- **Dữ liệu cũ từ máy chủ** sau khi vừa ghi (cache phía Apps Script, lần đọc chạy trước lần ghi) làm thẻ vừa thêm biến mất /
  vừa xoá hiện lại ⇒ cần "sổ ghi nhớ" áp lại thao tác chưa xác nhận (xem `instant-ux.md`).
- **Rời trang:** thứ tự sự kiện là `beforeunload → pagehide → visibilitychange(hidden)`. Nếu lưu "lease" trong
  `visibilitychange` sẽ ghi đè việc nhả lease ở `pagehide` ⇒ đặt cờ `GONE` trong `pagehide`.
- **CSS độ ưu tiên:** quy tắc cũ dạng `.box button{width:32px}` thắng `.new-btn{…}` ⇒ viết `.box .new-btn{width:auto}`.
- **Tiêu đề thông báo là chữ thuần** (không `&amp;`); `summary`/`text` mới được dùng thẻ HTML đơn giản.
- **Playwright:** `page.evaluate` chờ Promise trả về (bọc `void`/`{ }` khi đo "hiện ngay"); hộp `beforeunload` mặc định bị
  dismiss ⇒ `page.on('dialog', d=>d.accept())`; `clock.setFixedTime` làm vòng chờ theo `Date.now()` không bao giờ kết thúc ⇒
  dùng bộ đếm vòng lặp; ảnh `file://` trong `setContent` có thể trắng ⇒ ghi file html tạm rồi `goto`.
- **Apps Script:** web app giới hạn trong domain chỉ gọi được bằng JSONP (GET) từ trình duyệt đã đăng nhập; URL < ~7.500 ký tự;
  web app chạy **phiên bản đã deploy**, còn trigger / menu Sheet chạy **code mới nhất đã lưu** — lưu code chưa deploy là đổi
  hành vi trigger ngay.
- **Backend:** sửa trong kho trung tâm + PR, để GitHub Actions deploy (`references/backend-deploy.md`); không tạo deployment
  mới (URL mới, app không gọi tới). Chỉ khi chưa dựng được kho trung tâm mới gửi file `.gs` đầy đủ cho người dùng dán.
  Frontend vẫn nên chạy được với backend cũ (bắt lỗi `Unknown action` ⇒ báo cần cập nhật backend).
- **Script ID ≠ Mã triển khai ≠ ID file Sheet.** Script ID chỉ có trong địa chỉ trang Apps Script (`…/projects/<ID>/edit`) hoặc
  ⚙ Cài đặt dự án; người dùng thường gửi nhầm `AKfycb…` hoặc link Sheet — hỏi lại kèm hướng dẫn tab nào, copy chỗ nào.

## 5. Đầu ra mong đợi khi kết thúc một lượt

- Code đã sửa + test pass + commit/PR (theo quyền của repo).
- `updates/notes.js` có mục mới, ảnh ở `updates/vX.Y/`, badge phiên bản đã tăng.
- (Tính năng lớn) `docs/HDSD_<tên>_vX.Y.pdf` — gửi file cho người dùng.
- (Nếu sửa backend) PR đã gộp ở kho trung tâm + log Deploy xanh (phiên bản cũ → mới); việc chờ người dùng quyết định ghi
  vào `TODO.md` của kho đó.
- Tin nhắn tổng kết ngắn bằng ngôn ngữ người dùng: thay đổi, cách dùng, giới hạn, việc họ cần làm (nếu có).
