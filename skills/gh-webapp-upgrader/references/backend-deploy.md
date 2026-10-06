# Backend Apps Script: sửa & tự deploy qua kho trung tâm (không bắt người dùng dán code)

Đọc khi: cần **xem / sửa backend** (`.gs`) của một app, người dùng nói "sửa backend", "deploy", "cập nhật Apps Script",
"không muốn tải lên tải xuống / dán code nữa", hoặc lần đầu làm việc với một app có URL `script.google.com/…/exec`.

Đã chạy thật với 7 backend của MMH Report Hub (06/10/2026). Kho trung tâm của MMH: **`ManiMedicalHanoi/mmh-backend`**
(riêng tư). Bộ khung để dựng kho tương tự ở nơi khác: `assets/backend-repo/` (copy nguyên thư mục).

## 1. Cách hệ thống hoạt động

```
Claude sửa backends/<key>/*.gs ─PR─► gộp main ─► GitHub Actions "Deploy backend"
   ─► Apps Script API: đẩy code ▸ tạo phiên bản ▸ trỏ ĐÚNG deployment cũ sang phiên bản mới (URL /exec không đổi)
   ─► gọi thử URL; lỗi ⇒ tự trỏ lại phiên bản trước + trả code trong dự án về như cũ
```
- Chìa khoá: secret `CLASPRC_JSON` của kho trung tâm = nội dung `~/.clasprc.json` sau `clasp login` bằng tài khoản **sở hữu
  script** (MMH: `mmh_product`). Một chìa khoá dùng cho mọi app. Claude **không bao giờ** xin người dùng dán chìa khoá vào chat.
- `tools/gas.mjs` gọi thẳng Apps Script API (không cần cài clasp): `status | discover | pull | deploy | deploy-changed | rollback`.
- `backends.json`: mỗi backend `name, apps[], deploymentId, scriptId, sheetId, url`. `apps` = repo app nào gọi backend đó.
- Workflows: **Deploy backend** (tự chạy khi gộp `backends/**`; chạy tay = deploy tất cả code trong repo), **Kéo code về**
  (tự chạy khi `backends.json` đổi), **Quay lại bản trước**, **Kiểm tra** (PR: selftest + cú pháp; chạy tay: bảng tình trạng).
- Claude điều khiển bằng GitHub MCP: `actions_run_trigger` (chạy workflow, `ref` = nhánh để thử trước khi gộp),
  `actions_list` / `get_job_logs` (đọc kết quả). `script.google.com` thường bị chặn trong môi trường Claude — GitHub Actions gọi được.

## 2. Đầu mỗi phiên có đụng tới backend

1. `add_repo` kho trung tâm (`access: "push"`) ⇒ clone ⇒ đọc `CLAUDE.md` + `TODO.md` của kho đó (việc còn dở, đã hứa).
   Không có quyền / chưa có kho ⇒ xem mục 6.
2. `node tools/scan-app.mjs <thư mục app> <owner/repo>` ⇒ backend nào app gọi đã có trong kho, backend nào MỚI.
3. Có backend MỚI ⇒ mục 3 trước khi sửa gì.

## 3. Thêm backend của một app (lần đầu cho mỗi app)

1. `node tools/scan-app.mjs <app> <owner/repo> --add` ⇒ PR ⇒ gộp. Workflow **Kéo code về** tự chạy: dò Drive tìm Script ID
   của script **riêng**; script **gắn với file Sheet** không hiện trên Drive ⇒ phải hỏi người dùng.
2. Hỏi người dùng đúng 1 việc, kèm bảng *tên backend ↔ phần đầu Mã triển khai* để họ không nhầm:
   > Mở file Sheet ▸ **Tiện ích mở rộng ▸ Apps Script** ▸ ở **tab mới** vừa mở, copy thanh địa chỉ
   > (`https://script.google.com/…/projects/<Script ID>/edit`) và gửi theo thứ tự.

   Người dùng hay gửi nhầm (đã gặp cả 3): URL `/exec` hoặc mã `AKfycb…` (= Mã triển khai), URL `docs.google.com/spreadsheets`
   (= file Sheet — vẫn lưu vào `sheetId` để kiểm chéo). Script ID thường bắt đầu bằng `1`, ~57 ký tự.
   Không đọc được Script ID từ URL `/exec` (`lib=` trong chuyển hướng KHÔNG phải Script ID).
3. Ghi Script ID (+ `sheetId` nếu có) vào `backends.json` trên nhánh ⇒ chạy **Kéo code về** với `ref` = nhánh, `backend=all`
   ⇒ bot commit code gốc + `.pull.json` vào nhánh. `pull` tự kiểm: đúng loại mã, script gắn đúng Sheet, có deployment app gọi.
4. Chạy **Kiểm tra** (ref = nhánh) ⇒ đọc bảng: phiên bản · quyền đang chạy, *code chưa deploy*, deployment khác (bản mới hơn).
5. Gộp PR (deploy tự động **bỏ qua** bản gốc vừa đưa vào — kiểm tra log "bản gốc vừa đưa vào repo").
6. Báo người dùng bằng lời thường các điểm ⚠️ cần quyết định trước lần deploy đầu (mục 5), ghi vào `TODO.md`.

## 4. Sửa backend (hằng ngày)

1. Sửa `backends/<key>/*.gs` — giữ phong cách code sẵn có; backend dùng chung nhiều app (`apps` > 1) phải tương thích mọi app.
   Không đổi mục `webapp` trong `appsscript.json`. Không tạo deployment mới.
2. `node tools/syntax.mjs`; kiểm hành vi bằng mock (frontend: `references/testing.md`); sửa `tools/` ⇒ `node tools/selftest.mjs`.
3. PR ⇒ gộp ⇒ đọc log **Deploy backend**: `phiên bản A → B · URL giữ nguyên · gọi thử: …`. Đỏ ⇒ đọc lỗi, sửa, gộp lại.
4. Thay đổi cả app lẫn backend: gộp **backend trước**, đợi Deploy xanh, rồi mới gộp frontend. Frontend vẫn nên chịu được backend
   cũ (bắt `Unknown action`).
5. Báo người dùng: đã lên phiên bản nào, cách quay lại (Actions ▸ Quay lại bản trước ▸ tên backend).

## 5. Các lớp an toàn (đừng gỡ) và lý do

| Lớp | Chặn chuyện gì đã/ có thể xảy ra |
|---|---|
| Quyền web app so với **entryPoints của deployment đang chạy**, không so với manifest HEAD | Business Trip: HEAD ghi `MYSELF`; nếu manifest lệch bản chạy, deploy sẽ đổi quyền ⇒ cả công ty mất truy cập. URL `/a/macros/<domain>/` **không** có nghĩa là quyền domain |
| Phát hiện sửa tay: code trên Apps Script ≠ mọi bản từng có trong repo ⇒ dừng | ghi đè mất phần người khác sửa trên trình soạn |
| Deploy tự động chỉ đưa thay đổi từ repo: bỏ qua bản gốc mới; `.pull.json` (`pending`) còn khớp ⇒ dừng, phải deploy tay | lúc kéo về, 3/7 backend MMH có code sửa trên trình soạn **chưa deploy** (Management còn xoá `index.html`) — lần sửa đầu sẽ đưa lên lẫn |
| Gọi thử sau deploy, lỗi ⇒ trỏ lại bản trước **và trả code HEAD về** | trigger hẹn giờ / menu Sheet chạy code HEAD chứ không chạy bản deploy |
| Hàng chờ riêng `gas-deploy` / `gas-pull` | GitHub chỉ giữ 1 lượt chờ/nhóm ⇒ Deploy từng bị huỷ ngầm khi chạy cùng Kéo code về |
| Giữ thứ tự file `.files.json` | thứ tự nạp file ảnh hưởng biến toàn cục Apps Script |
| Cảnh báo ≥ 180 phiên bản | giới hạn 200 phiên bản/dự án (xoá trong Lịch sử dự án) |

Quyết định cần hỏi người dùng (không tự quyết): đưa code *chưa deploy* lên hay không; deployment khác đang ở bản mới hơn bản
app gọi (MMH Training Hub: app gọi bản 32, `AKfycbxDLx…` ở bản 34) ⇒ có muốn app dùng bản mới không.

## 6. Dựng kho trung tâm lần đầu (khi chưa có) — người dùng không rành kỹ thuật

Claude làm phần kỹ thuật; người dùng chỉ bấm theo hướng dẫn (đã kiểm chứng):
1. Ứng dụng Claude trên GitHub **không tạo được repo** ⇒ người dùng tạo: github.com/new ▸ tên ▸ **Private** ▸ Add README ▸ Create;
   đảm bảo GitHub App Claude có quyền repo đó. Claude: `add_repo` ⇒ copy `assets/backend-repo/` ⇒ PR ⇒ gộp.
2. Bật Apps Script API: https://script.google.com/home/usersettings (tài khoản sở hữu script).
3. Lấy chìa khoá bằng **Google Cloud Shell** (không cài gì): https://shell.cloud.google.com/?show=terminal ▸
   `npx -y @google/clasp@3 login --no-localhost` ▸ **Ctrl + bấm** link ▸ Cho phép ▸ trang `localhost` báo lỗi là bình thường ▸
   copy cả địa chỉ trên trình duyệt ▸ dán vào Cloud Shell bằng **chuột phải ▸ Paste** ▸ `cat ~/.clasprc.json` ▸ copy bằng
   **chuột phải ▸ Copy**. Dặn rõ: trong màn hình đen **Ctrl+C = huỷ lệnh** (đã gặp: "User force closed the prompt with SIGINT").
4. Dán vào `https://github.com/<owner>/<repo>/settings/secrets/actions/new`, tên `CLASPRC_JSON`; xoá bản trên Cloud Shell.
   `gas.mjs` chịu được copy lỗi thường gặp (dấu xuống dòng do màn hình ngắt dòng, chữ dấu nhắc, mất phần `access_token` cuối).
5. Script ID: như mục 3.

Sự cố: `Access blocked` khi cho phép ⇒ quản trị Workspace tin cậy client ID clasp
`1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com`; Cloud Shell bị tắt ⇒ máy tính cài Node.js LTS ▸
`npx -y @google/clasp@3 login`; `invalid_grant` ⇒ chìa khoá bị thu hồi/hết hạn ⇒ đăng nhập lại, cập nhật secret;
"Apps Script API not enabled" ⇒ bước 2, đợi ~5 phút. Thu hồi chìa khoá: https://myaccount.google.com/permissions ▸ clasp.
