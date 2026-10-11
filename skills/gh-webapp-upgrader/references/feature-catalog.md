# Sổ tay tính năng (feature catalog) — các webapp MMH và Sổ theo dõi học sinh

> **Dùng khi:** làm app mới (chọn sẵn tính năng ở mục 17–18), thêm tính năng cho app cũ (xem app nào đã làm, chép từ đâu),
> hoặc người dùng hỏi "app có những gì / đã làm được gì". Cập nhật file này khi phát hành tính năng mới đáng dùng lại.

> Tổng hợp từ 4 hệ thống đang chạy, để tham khảo khi làm app mới:
>
> | App | Repo | Phiên bản (10/2026) | Người dùng |
> |---|---|---|---|
> | **MMH Report Hub** | `ManiMedicalHanoi/MMH-Report` | v17.4 | Nhân sự văn phòng MMH (Product, Marketing, Back Office, quản lý) |
> | **MMH CRM** | `ManiMedicalHanoi/MMH-CRM` | v30.9 | Sales 4 nhóm (Dental, Surgical, Eyeless, Thái Lan – tiếng Anh) |
> | **MMH Product Data** | `ManiMedicalHanoi/Product-Data` | v2.0 | Toàn công ty (xem), Admin / người được cấp quyền (sửa) |
> | **Sổ theo dõi học sinh 11D3** | `THPTYenHoa/Theo-doi-hanh-kiem-11D3-…` | v4.8 | Giáo viên chủ nhiệm, cán bộ lớp, phụ huynh |
>
> Backend: `ManiMedicalHanoi/mmh-backend` (riêng tư, 7+ backend MMH) và `THPTYenHoa/yenhoa-backend` (riêng tư, backend trường).
> Quy trình nâng cấp đóng gói trong skill **`gh-webapp-upgrader`** (`MMH-Report/skills/gh-webapp-upgrader/`).
>
> Mỗi mục ghi **làm gì → vì sao → ở đâu** (repo · tên khối / hàm), để khi làm app mới có thể mở đúng chỗ ra chép.

---

## Mục lục

1. [Kiến trúc chung](#1-kiến-trúc-chung)
2. [Backend Apps Script & kho backend tự deploy](#2-backend-apps-script--kho-backend-tự-deploy)
3. [Đăng nhập & phân quyền](#3-đăng-nhập--phân-quyền)
4. [Tốc độ: "không bao giờ phải chờ"](#4-tốc-độ-không-bao-giờ-phải-chờ)
5. [Giao diện & trải nghiệm](#5-giao-diện--trải-nghiệm)
6. [Điều hướng, tìm kiếm, xem chi tiết](#6-điều-hướng-tìm-kiếm-xem-chi-tiết)
7. [Lịch, giao việc, công tác, nhắc hạn](#7-lịch-giao-việc-công-tác-nhắc-hạn)
8. [Báo cáo, KPI, thống kê, biểu đồ](#8-báo-cáo-kpi-thống-kê-biểu-đồ)
9. [Email & thông báo](#9-email--thông-báo)
10. [Hướng dẫn, chế độ trải nghiệm, HDSD PDF](#10-hướng-dẫn-chế-độ-trải-nghiệm-hdsd-pdf)
11. [Nhân vật đồng hành (cô Thảo) & cách xưng hô](#11-nhân-vật-đồng-hành-cô-thảo--cách-xưng-hô)
12. [Đa ngôn ngữ](#12-đa-ngôn-ngữ)
13. [Tải file PDF / Excel, ảnh, bằng chứng](#13-tải-file-pdf--excel-ảnh-bằng-chứng)
14. [Riêng tư & an toàn dữ liệu](#14-riêng-tư--an-toàn-dữ-liệu)
15. [Quy trình phát hành & kiểm thử](#15-quy-trình-phát-hành--kiểm-thử)
16. [Cạm bẫy đã gặp (bài học)](#16-cạm-bẫy-đã-gặp-bài-học)
17. [Checklist khi làm một app mới](#17-checklist-khi-làm-một-app-mới)
18. [Bảng tra nhanh: muốn X → chép từ đâu](#18-bảng-tra-nhanh-muốn-x--chép-từ-đâu)

---

## 1. Kiến trúc chung

| Thành phần | Cách làm | Vì sao |
|---|---|---|
| **Frontend** | 1 file `index.html` trên **GitHub Pages** (nhánh `main`), có thể thêm vài file `.js` dùng chung (vd. `baocao.js`, `taive.js`, `back.js`, `mascot.js`) | Miễn phí, không cần máy chủ, cập nhật = merge PR |
| **Dữ liệu** | Google Sheet (+ Google Drive cho tài liệu, ảnh) | Người dùng quen Sheet, xem / sửa tay khi cần |
| **Backend** | Google Apps Script web app (`/exec`), mỗi nhóm dữ liệu một backend | Gắn sẵn với Sheet / Drive / Gmail của công ty |
| **Vá lớp** | Tính năng mới = khối `<style id="vXX-css">` + `<script id="vXX-js">` thêm **cuối file**, bọc hàm cũ: `const o=window.fn; window.fn=fn=function(){ … return o.apply(this,arguments); }` | Không phải sửa code cũ; mỗi phiên bản là một khối có ghi chú đầu khối; dễ tìm, dễ gỡ |
| **Nhiều trang** | Trang phụ dùng chung module (vd. `phu-huynh.html` của Sổ theo dõi dùng chung `baocao.js`, `mascot.js`, `back.js`) | Một chỗ sửa, hai trang cùng hưởng |
| **Hướng dẫn cho Claude** | `CLAUDE.md` mỗi repo: quy tắc bắt buộc, ghi chú kỹ thuật từng phiên bản | Phiên làm việc sau tự tuân theo, không phải giải thích lại |

**Nguyên tắc thiết kế xuyên suốt** (skill `gh-webapp-upgrader`):
1. **Hiện trước, ghi sau** — mọi thao tác cập nhật giao diện < 100 ms, lệnh ghi chạy nền.
2. **Không bao giờ mất thao tác** — lệnh ghi lưu trên máy, có mã chống trùng, tự thử lại.
3. **Dữ liệu mở sẵn** — vẽ từ bản lưu trên máy rồi đồng bộ phía sau.
4. **Giao diện bình tĩnh, đổi được màu** — màu qua biến CSS, nhiều chủ đề.
5. **Mỗi bản cập nhật đều có thông báo** trong app, kèm ảnh thật và PDF khi cần.

---

## 2. Backend Apps Script & kho backend tự deploy

### 2.1 Gọi backend từ trình duyệt
- **Đọc** = JSONP (`<script src="…/exec?action=…&callback=…">`) hoặc `fetch`. **Ghi** = `POST` với `URLSearchParams{action, payload}` (hoặc JSON text/plain).
- **Đọc không kèm cookie** (Report Hub v16.7, CRM v30.0, module `AUTH`): bọc setter `<script>.src` ⇒ URL `script.google.com/macros/s/…` có `callback=` được đọc bằng `fetch(credentials:"omit")` rồi gọi đúng callback; hỏng 2 lần (web app chỉ cho domain, link `/a/macros/`) ⇒ quay về thẻ `<script>`.
  *Vì sao:* Chrome đăng nhập Gmail khác / nhiều tài khoản làm thẻ `<script>` bị chuyển sang trang chọn tài khoản ⇒ không đăng nhập được.
- Web app giới hạn trong domain chỉ gọi được bằng JSONP (GET); giữ URL < ~7.500 ký tự.
- Frontend chạy được với backend cũ: bắt lỗi "Không nhận ra yêu cầu / Unknown action" ⇒ tắt tính năng mới hoặc dùng lệnh cũ (vd. `LIVE.off` của Sổ theo dõi).

### 2.2 Kho backend trung tâm, tự deploy (không bắt người dùng dán code)
- Code `.gs` của mọi backend nằm ở **kho riêng tư** (`mmh-backend`, `yenhoa-backend`), thư mục `backends/<key>/`; `backends.json ▸ apps` ghi app nào dùng backend nào.
- Sửa → PR → squash merge `main` ⇒ **GitHub Actions "Deploy backend"** cập nhật đúng deployment cũ (URL `/exec` không đổi), gọi thử, lỗi thì tự quay về phiên bản trước.
- Có người sửa trực tiếp trên trình soạn ⇒ Deploy báo ⇒ chạy workflow **"Kéo code về"** rồi áp lại thay đổi.
- Luật: **gộp backend trước, đợi Deploy xanh, rồi mới gộp app**. Không đổi mục `webapp` trong `appsscript.json`, không tạo deployment mới. Trước khi push: `node tools/syntax.mjs` (+ `tests/*.js`, `tools/selftest.mjs`).
- Backend dùng chung nhiều app (vd. Training Hub: đăng nhập, phân quyền, việc được giao, email cập nhật) ⇒ mọi thay đổi phải giữ tương thích cho tất cả app.
- **Script ID ≠ mã triển khai `AKfycb…` ≠ ID file Sheet** — hỏi người dùng kèm hướng dẫn chỗ copy (⚙ Cài đặt dự án).

### 2.3 Thiết kế lệnh backend nên có
| Mẫu | Ví dụ | Ghi chú |
|---|---|---|
| `bootstrap` gộp | Sổ theo dõi: cấu hình + học sinh + chủ đề + trạng thái khoá trong 1 lần gọi | Mở app chỉ 1 lượt mạng |
| `sync {rev}` | Sổ theo dõi `DongBo.gs`: mỗi lần ghi đổi `rev`; `rev` không đổi ⇒ trả `same` ngay (không đọc Sheet) | Đồng bộ 4 giây/lần vẫn nhẹ |
| Ghi có `rid` | `addEntries` (rid chống trùng), `rhAssignAdd` | Gửi lại an toàn |
| Xoá idempotent | `deleteEntry`: không còn ⇒ vẫn trả `ok` | Hàng đợi thử lại không báo lỗi giả |
| ID cố định | Dòng có cột ID, không dựa số dòng | Người khác chèn / xoá dòng không làm ghi nhầm |
| Kiểm khoá ở máy chủ | `kiemKhoa_` chặn ghi vào tháng đã khoá sổ | App chặn trước, máy chủ chặn lần nữa |
| Đệm (`CacheService`) gắn phiên bản | khoá `hk_e_<rev>_<tháng>` | Ghi xong tự hết hạn đệm |

---

## 3. Đăng nhập & phân quyền

### 3.1 Email + mã 6 số (OTP)
- **Report Hub v16.0 / CRM v29 / Product Data v2.0**: Training Hub `rhAuthStart` → email mã 6 số → `rhAuthVerify` → phiên lưu `localStorage.mmh_tk` (dùng chung cả 3 app — đăng nhập 1 nơi là vào được nơi khác). Danh sách người dùng: sheet `RH_Users`; khoá ký phiên: sheet ẩn `RH_Secret`.
- **Tự gắn `tk=`** vào URL mọi lệnh gọi `script.google.com` (bắt ở `<script>.src` và `fetch`) ⇒ tính năng mới không phải tự gắn.
- **Giai đoạn chuyển tiếp**: vẫn có link "chọn tên / mật khẩu như trước" đến ngày `AUTH.GRACE`.
- **Sổ theo dõi v3.0** (`otpStart` / `otpVerify`): màn đăng nhập 2 bước (email → mã), ô mã tự gửi khi đủ 6 số, đếm ngược "Gửi lại mã (45s)", nút "Đổi email", gợi ý xem cả Thư rác, lời hướng dẫn kèm ảnh nhân vật khi bấm vào ô email (v4.8).
- Email gửi mã / thông báo luôn từ miền `@manimedicalhanoi.com` (`mmhMail_`) — miền `@mani.inc` hay vào spam.

### 3.2 Phân quyền
- **Trang Phân quyền người dùng** (Report Hub v16.2, `ADM` / `PERM`): chọn người → email, tên, phòng ban, vai trò → bật / tắt từng chức năng (Giao việc, Báo cáo, Đề xuất công tác, Tạo đào tạo, Sửa dữ liệu MKT, Xem Management, Sửa Product Data…). Công tắc viền vàng = khác mặc định của vai trò. Cột "Đăng nhập gần nhất" (đỏ = chưa từng đăng nhập). **Đăng xuất khỏi mọi máy** từ xa.
- Cách code: `PERM.def(u)` = quyền mặc định theo vai trò (giữ logic cũ); chỉ lưu phần **khác mặc định**; `PERM.ov(k,m)` áp qua các hàm bọc (`canAssign`, `MK.can`, `buildTabs`…). Thêm chức năng cần quyền ⇒ thêm vào `PERM.FEAT` + `def` + hàm bọc + khoá `RH_PERM_KEYS` ở backend.
- **Product Data**: lớp `body.pd-ro` / `body.pd-nodel` ẩn nút; các hàm ghi cũng tự chặn.
- **Sổ theo dõi**: vai trò lấy từ sheet `TaiKhoan` (GVCN / Lớp trưởng / Tổ trưởng / Quản trị); bảng quyền `QUYEN` hiện trong Cài đặt ("Quyền của bạn" với cán bộ lớp); backend kiểm lại mọi lệnh ghi; dòng "Quản trị" chỉ hiện với chính tài khoản Quản trị.
- **Quyền xem** (CRM): Management đổi nhóm; Team Leader xem cả nhóm; PIC chỉ thấy việc của mình. Tìm nhanh (Ctrl+K) cũng tôn trọng quyền này.
- **Lọc dữ liệu ngay khi về** (`VIS`, Report Hub / CRM v16.9 / v30.2): bọc callback ⇒ buổi đào tạo chỉ trainer + người được mời thấy; chuyến công tác người khác luôn ẩn, quản lý bật bằng chip `VIS.chip()`.
- **Khách chỉ đọc** (trang phụ huynh): `loginKhach` ⇒ token chỉ được `bootstrap` + `entries`; không thấy ảnh bằng chứng (backend trả `'1'` thay mã file).

### 3.3 Đăng ký có duyệt (Sổ theo dõi v3.7–3.8)
Phụ huynh tự nhập email → mã 6 số (`phDangKy`) → xác nhận (`phXacNhan`) → **GVCN được báo ngay** (email + thẻ "Phụ huynh vừa đăng ký" + chấm đỏ menu) → Duyệt / Từ chối → phụ huynh nhận thư kèm **PDF hướng dẫn**. Huỷ nhận thư bằng link ký **HMAC** (không cần đăng nhập).

### 3.4 Đăng xuất
- Menu tài khoản (Report Hub `UM` / Sổ theo dõi `#ava39`) ▸ Đăng xuất ⇒ xoá dữ liệu lớp lưu trên máy (`hk_cache_v4`, hàng đợi).
- Trang khách (phụ huynh, v4.8): nút **Thoát** góc phải ⇒ hộp xác nhận có nhân vật ⇒ xoá token / cache / đăng ký trên máy ⇒ về trang đăng nhập.

---

## 4. Tốc độ: "không bao giờ phải chờ"

### 4.1 Mở app tức thì
- Vẽ ngay từ bản lưu `localStorage` (`hk_cache_v4`, `pd_cache_v1`, `LS_BOOT`, `SRC_CACHE`), chip nhỏ "Dữ liệu lúc 08:15 · đang cập nhật…", đồng bộ phía sau.
- **Tải nền cả năm** (`preloadYear`) sau khi mở; đồng bộ 60 s chỉ tháng đang xem, cả năm 10 phút/lần.
- **Danh mục lưu sẵn** (dropdown, danh bạ, danh sách tỉnh `tripMaster`…): form mở bằng bản lưu, làm mới ngầm nếu cũ > 15 phút, chưa có ⇒ dùng danh sách dự phòng (`TP_FB_DEST`). Tải trước ngay sau đăng nhập.
- **Màn chờ có nội dung** khi buộc phải chờ lần đầu: thanh tiến trình + nhân vật chạy + lời nhắn đổi theo thời gian / theo vai ("Mạng lag xíu, các con chờ chút nha…").

### 4.2 Thao tác lạc quan (optimistic)
- Thêm / xoá / sửa ⇒ cập nhật màn hình trước (số tạm `tmp-…`), gọi backend sau, **không** overlay "Đang tải…", chỉ chip nhỏ "Đang lưu…".
- **Sổ ghi nhớ thao tác** (`RT_LEDGER` 3 phút / `hqOverlay()` / `overlay()`): dữ liệu cũ từ máy chủ (đệm, lần đọc chạy trước lần ghi) không làm thẻ vừa thêm biến mất / vừa xoá hiện lại.
- **Sửa ngay trong khung chi tiết** (Report Hub MKT `#mc-dr`): không modal, không loading; lỗi thì trả lại giá trị cũ.
- **Toast có Hoàn tác** sau mỗi lần ghi điểm.

### 4.3 Hàng đợi ghi bền vững (OUTBOX)
Có ở cả 4 app (Report Hub `OUTBOX` v15.8, CRM ảnh địa bàn v30.7, Product Data `PQ`, Sổ theo dõi `HQ`):
- Lệnh ghi lưu `localStorage` (`mmh_outbox_v1`, `pd_outbox_v1`, `hk_outbox_v1`), **gắn URL backend lúc bấm** (không đọc biến toàn cục lúc gửi).
- Chạy tuần tự từng backend; đổi số tạm sang số thật (`__tmp` trong body).
- Lỗi mạng / máy chủ bận ⇒ thử lại 2 → 60 s **cùng `rid`**; phản hồi không chắc ⇒ **đọc lại để xác minh** đã ghi chưa rồi mới gửi lại.
- Lỗi thật ⇒ trả giao diện về như cũ + **chip đỏ** + bảng **Thử lại / Bỏ**.
- `update` chỉ gửi ô đã đổi; lệnh kèm bằng chứng (`ev`) chạy **sau** lệnh ghi chính, gắn đúng số thật.
- **Ảnh tách 2 bước** (CRM v30.7): chữ gửi trước (vài giây), ảnh theo sau ở nền; mất sóng ⇒ lưu trên máy, tự gửi khi có mạng, kể cả sau khi đóng app. *Nguyên nhân cũ:* gửi chữ + ảnh 1 lần, máy chủ upload Drive + tra địa chỉ GPS + ghi Sheet ⇒ 4G yếu mất vài phút, hết giờ là mất cả.
- Mock kiểm thử: `drop:{action:1}`, `flaky`, `failWrite`, `lag`, `staleMs`.

### 4.4 Cập nhật trực tiếp (Sổ theo dõi v3.2, `LIVE`)
- Hỏi `sync` 4 giây/lần khi đang mở (15 giây nếu không thao tác 2 phút, **dừng khi ẩn tab**, chờ khi hàng đợi ghi đang chạy).
- Có thay đổi của người khác ⇒ mục mới **trượt vào** (`.fresh`), mục bị xoá **thu gọn** (`.out` 220 ms), điểm đổi ⇒ `.bump`, thông báo nhỏ "Lớp trưởng vừa ghi…". Nhãn "Trực tiếp" / "Cập nhật 1 phút" (backend cũ).

---

## 5. Giao diện & trải nghiệm

### 5.1 Phong cách "nhã nhặn"
- Font **Aptos** cho mọi chữ. Thẻ trắng, viền mảnh `#E6EAEF`, bo 12 px, không đổ bóng nặng, không gradient đậm, không emoji màu dày đặc.
- Màu qua **biến CSS** (`--t-pri`, `--t-ink`, `--t-soft`, `--t-line` / `--teal…--bg`), không viết cứng màu brand. Màu mang nghĩa (loại lịch, trạng thái, xếp loại Tốt/Khá/TB/Yếu, % KPI) **giữ cố định**.
- Màu loại lịch: vạch đậm + nền tô nhẹ ~13% (không quá nhạt, không tô đặc).
- Tab con = gạch chân; chip đang chọn = nền nhạt + viền màu chính (không tô đặc).
- **Ô nhập luôn có viền rõ**, dropdown có mũi tên ▾, ô đang gõ được làm nổi (Report Hub v17.3, CRM v30.7).

### 5.2 Chủ đề màu
- Report Hub v15.7: **10 tông** qua `html[data-theme=…]`, lưu `localStorage.mmh_theme`, nút `#th-btn` → `THEME.open()`; đổi tức thì không vẽ lại.
- Sổ theo dõi: **18 chủ đề**, mỗi chủ đề 8 màu + **ảnh nền** riêng máy tính / điện thoại (`themes/<id>/d.webp`, `m.webp`), thiếu ảnh ⇒ hoạ tiết CSS; GVCN đặt **mặc định cho cả lớp**, trang phụ huynh dùng theo.

### 5.3 Bố cục
- **Thanh trên 1 dòng** (Report Hub v15.9/v16.6): logo · tên · Tìm nhanh · nhóm nút công cụ · chip người dùng; menu tên chỉ còn tài khoản / phân quyền / đăng xuất.
- **Điện thoại** (CRM v30.0–30.1): thanh dưới 5 nút cố định (Lịch · Khách hàng · **Hôm nay** · Mở mới · Thêm), nút ＋ Ghi nhanh nổi góc phải; danh sách dạng thẻ; trang **Hôm nay** = việc hôm nay, quá hạn, sắp đến hạn.
- **Biểu tượng SVG nét mảnh** thay emoji (CRM `V30_ICON`), có bộ quét tự bỏ emoji trong nhãn nút (không đụng nội dung người dùng gõ).
- **Thẻ tổng quan** (Sổ theo dõi `#v32h`): lời chào + 4 ô số bấm được + dải "Điểm tuần" tự lật 6 s/lượt (dừng khi rê chuột).
- **Tab phụ lớn** cho màn chi tiết trên điện thoại (trang phụ huynh v4.8: "Danh sách học sinh / Hồ sơ: tên") thay link "‹ quay lại" nhỏ.
- Phần tử nằm ngoài màn hình khi đóng (ngăn kéo, bảng tin) chỉ đổ bóng khi mở.

### 5.4 Popup xếp hàng khi đăng nhập
Thứ tự cố định, không chồng lên nhau: Thông báo cập nhật → Nhắc hạn chứng từ → Việc mới được giao → Thư nhắc việc → (Duyệt công tác — 1 lần/ngày). Popup mới phải đăng ký vào hàng (cờ `pending` + bọc hàm mở của popup trước).

### 5.5 Chi tiết nhỏ đáng giữ
- Chip trạng thái góc màn hình (Đang lưu… / lỗi đỏ) thay overlay.
- Hiệu ứng thêm / xoá mượt, không giật khi vẽ lại (`animation-delay` âm theo thời điểm thêm).
- Khung hộp thoại trên điện thoại: chân hộp xếp dọc (ô tick "Không hiển thị lại" một dòng, nút "Đã hiểu" rộng hết) — tránh nút `width:100%` che ô tick.
- Ghi chú "Bấm vào số liệu, tên, lỗi hay tổ để xem chi tiết" dưới hàng ô số; ô số có mũi tên "›" và nổi nhẹ khi rê chuột.

---

## 6. Điều hướng, tìm kiếm, xem chi tiết

| Tính năng | Ở đâu | Cách hoạt động |
|---|---|---|
| **Tìm nhanh Ctrl/⌘+K** | Report Hub `QS` v16.1 | Tìm việc 3 phòng ban + sự kiện, bài đăng, công tác, đào tạo; bỏ dấu; theo quyền; **lệnh nhanh** đẩy vào `window.QS_EXTRA_CMDS` (`{ic,title,hay,run}`) |
| Tra cứu học sinh | Sổ theo dõi `findOpen` | Nút kính lúp, phím `/`, Ctrl+K → hồ sơ `openProfile(ma)` |
| **Tìm kiếm thông minh** | Sổ theo dõi `.sq39` / `parseQ` | Gõ "tổ 2", "khá", "vi phạm", "không lỗi", phần còn lại khớp tên hoặc nội dung lỗi |
| **Rê chuột xem chi tiết** | Sổ theo dõi `#tip39` / `tipCtx` | Rê vào ô điểm ⇒ liệt kê lỗi / khen của ô đó, theo tuần |
| **Số liệu bấm được** | Sổ theo dõi `DRILL` v4.6 | Bấm ô số, thanh xếp loại, dòng học sinh / lỗi / tổ, biểu đồ ⇒ **màn chi tiết nền mờ**: tổng · biểu đồ theo tuần · tab Học sinh / Nội dung / Tổ / Từng lượt · bấm tiếp ⇒ xem sâu (nút ‹ lùi tầng) · Mở hồ sơ. Bắt click ở `document` (capture) theo cấu trúc HTML ⇒ không sửa hàm vẽ |
| **Nút Back của điện thoại** | Sổ theo dõi `back.js` v4.8 | Hộp đang mở = 1 bước lịch sử (`pushState`); Back ⇒ đóng hộp / lùi 1 tầng; đổi mục ⇒ ghi lịch sử; về đầu ⇒ "Bấm Quay lại thêm lần nữa để thoát" (2,5 s). Trang dùng `#hash` báo trước bằng `BACK.hashNav()` |
| Mở app vào đúng chỗ | Sổ theo dõi v4.6 | GVCN / cán bộ lớp đăng nhập ⇒ luôn vào "Ghi điểm" đúng tháng / tuần hôm nay (`wkOfDate`, tuần tính từ thứ Hai) |
| Link sâu từ email | Sổ theo dõi | `phu-huynh.html#hs=MA&tb=id1,id2` ⇒ mở đúng hồ sơ + thẻ "Thông báo mới"; `index.html#duyet` ⇒ mở bảng duyệt |

---

## 7. Lịch, giao việc, công tác, nhắc hạn

### 7.1 MMH Calendar (Report Hub v15.2→)
- Một lịch chung: công tác · đào tạo · sự kiện offline · bài đăng · việc; màu theo loại (`KIND`).
- **Tạo buổi đào tạo trên lịch** → gửi thư mời → **thư mục tài liệu tự tạo** trên Drive → kéo thả tài liệu, ai được mời cũng xem / tải.
- **Sửa / xoá sự kiện Marketing ngay trên lịch**: backend `mmhOptions` (đọc Data validation của Sheet để làm dropdown) + `mmhWrite` (update/add/delete) — không ghi cột có công thức, xác nhận đúng dòng bằng `check`.
- Lịch riêng tư (v16.9): chỉ thấy việc liên quan đến mình.

### 7.2 Giao việc (Report Hub v15.5–16.3, Training Hub `RH_Assign`)
- Popup **"Việc mới được giao"** khi đăng nhập; nhãn "✉ Email từ <người giao>" trên thẻ việc.
- **Gửi từ hộp thư của chính mình**: Outlook deeplink (`@mani.inc`), Gmail `view=cm` (`@manimedicalhanoi.com`), `mailto`, hoặc hệ thống gửi hộ. Tiêu đề kèm mã `[#A…]` để theo dõi.
- **Theo dõi**: Chưa xem / Đã xem (kèm giờ) / ✓ Hoàn thành; hoàn thành ⇒ người giao tự nhận email 1 lần.
- **Trao đổi gắn vào việc**: đọc / trả lời trong app, bên kia nhận email; mở app báo khi có trả lời mới.

### 7.3 Công tác
- **Đề xuất công tác mở ngay** (danh mục lưu sẵn), gửi là xong (chạy nền).
- **Một mẫu email đề xuất** cho cả Report Hub và CRM: To Giám đốc, CC trưởng phòng + người đề xuất; nhật ký ở tab "Business Trip Log" của từng hệ thống.
- **Giám đốc duyệt ngay trong app** (Report Hub v17.4, CRM v30.8): nút "Duyệt công tác" + **số đỏ** đề xuất đang chờ; danh sách tự mở 1 lần/ngày; **tick nhiều đề xuất → Duyệt / Từ chối** (từ chối bắt buộc lý do); mỗi người nhận email riêng; chuyến được duyệt **tự có folder** nộp tài liệu.
- Thẻ công tác trên điện thoại có nút **Báo cáo công tác**; chuyến trùng được gộp.

### 7.4 Nhắc hạn tự động
| Nhắc | Khi nào | Ở đâu |
|---|---|---|
| Hạn chứng từ chi phí (Phiếu công tác, Bảng kê mua hàng) | ngày 14, 15, 28, 29 + đúng ngày hạn | Report Hub `DL`, CRM |
| Báo cáo KPI tháng trước | ngày 02, 16:00 | `#kpn` |
| Tự đánh giá quý | ngày 09 tháng đầu quý (09/12/03/06), trước 17:00 | `#kpn` |
| Thư nhắc việc | khi đăng nhập | `NT` |

### 7.5 CRM bán hàng
- Đi địa bàn: thẻ hôm nay có **Chụp ảnh** + **Báo kết quả** (chọn sẵn Completed).
- **Mở mới địa bàn & SKU mới** (v30.5): KPI theo file KPI (`NA_KPI_MAP`), **tự đối chiếu 4 điều kiện** (báo cáo tuần · xác nhận NPP · đúng format · đơn đầu tiên); quản lý duyệt với **bằng chứng cỡ lớn trong khung**, 3 nút: Xác nhận · **Trả lại bổ sung** (về Draft, giữ chứng từ, hiện "Cần bổ sung") · Từ chối.
- Dữ liệu từng nhóm ở **file CRM riêng** của nhóm (v30.9): chuyển dữ liệu cũ tự động, không trùng.

### 7.6 Ghi nhận theo ngày xảy ra (Sổ theo dõi v4.6)
Ô **"Ngày xảy ra"** (Hôm nay / Hôm qua / chọn ngày) ⇒ app tự ghi vào đúng tháng / tuần của ngày đó, ghi chú thêm "ngày dd/mm"; chặn ngày tương lai, ngoài năm học, tháng đã khoá sổ; màn hình giữ tuần đang xem.

### 7.7 Khoá sổ (Sổ theo dõi v3.7)
GVCN **khoá sổ tháng** ⇒ app chặn mọi thêm / sửa / xoá của tháng đó (dải báo, `body.hk-lk`), máy chủ chặn lần nữa; mở khoá được. "Xác nhận xếp loại" cuối kỳ ghi đè xếp loại tự tính (dấu ✓).

---

## 8. Báo cáo, KPI, thống kê, biểu đồ

### 8.1 KPI (Report Hub v16.4–16.9, CRM dùng chung)
- Tab KPI real time có biểu đồ; **màu % theo đúng mã màu file KPI** (`tone()`: < 90% xám · 90–<100% xanh · 100–120% vàng · > 120% xanh lá).
- Hàng chọn người `.kp-who` + **người đang xem nổi bật** trên biểu đồ so sánh.
- Actual trống ⇒ nhãn **"Chưa chốt"** (`pendTag`), không hiện 0%.
- **Tên KPI tiếng Việt ngắn** (`kpiShort`, `KPI_GROUPS`) thay tên tiếng Anh dài.
- **Báo cáo KPI tháng** gửi email; **Setting Expectation** + **tự đánh giá quý** xuất file Word theo mẫu (`templates/setting_expectation.docx`).
- **Total KPI công ty** (`KT`, chỉ Admin / Director / HOD): 3 tab gọn (Tổng quan · KPI công ty · Thành viên) + "Cách tính KPI". Người dùng yêu cầu: gọn, không diễn giải dài.

### 8.2 Báo cáo theo kỳ (Sổ theo dõi v3.3→4.7)
- Chọn kỳ **Tuần / Tháng / Học kỳ / Cả năm** (`bcPeriod`, có kỳ trước `prev`) ⇒ ô số **so với kỳ trước** (▲▼ xanh = tốt lên, đỏ = kém đi).
- **Lời văn tự soạn từ số liệu** (`bcAuto`): nhận xét chung + phương hướng theo nhóm lỗi; người dùng sửa được, máy tự lưu theo kỳ; nút "Viết lại tự động". Đang gõ thì không vẽ lại.
- Thi đua giữa các tổ (xếp hạng Nhất / Nhì…), học sinh cần quan tâm (lý do tự tìm: xếp loại thấp, ≥ 3 lỗi, tái phạm), tiến bộ so với kỳ trước.
- **Khối "Vi phạm & tuyên dương"** (`vpBlock`, v4.7) — đa dạng biểu đồ:

| Biểu đồ | Dùng cho |
|---|---|
| Vòng tròn (donut) theo nhóm | Tỷ trọng lỗi / khen theo nhóm |
| Bảng + **cột nhỏ (sparkline)** mỗi dòng | Lỗi nào đang tăng / giảm |
| Thanh ngang có màu | Top hoạt động được tuyên dương |
| **Bản đồ nhiệt** lỗi × tổ (ô đỏ đậm dần) | Tổ nào mắc lỗi gì nhiều |
| **Biểu đồ hai phía** (đỏ trái / xanh phải) | Vi phạm và khen từng tổ |
| Đường nhiều series | Diễn biến 3 lỗi + 2 hoạt động chính |
| Thanh phân bố xếp loại + chú thích | Phân bố Tốt / Khá / TB / Yếu |
| Cột đôi theo tuần / tháng | Lượt khen / vi phạm theo thời gian |

  Mốc thời gian tự chọn: báo cáo tuần ⇒ theo thứ, 1 tháng ⇒ theo tuần, nhiều tháng ⇒ theo tháng. Bấm mọi dòng / ô / nhóm ⇒ màn chi tiết.
- Lời nhận xét của nhân vật đặt cạnh số liệu (lỗi gặp nhiều nhất, hoạt động được khen nhiều nhất), nét mặt theo kết quả.
- **Chỉ tiêu xếp loại của trường** (theo thứ hạng lớp) ⇒ cảnh báo "đang vượt chỉ tiêu N em".

### 8.3 Xuất báo cáo
- **PDF khổ ngang** (`baocao.js` / `RPT`): trang tổng quan có lời nhân vật, ô số so kỳ trước, donut, diễn biến, thi đua tổ, tuyên dương & nhắc nhở, 2 trang thống kê lỗi / hoạt động được khen, trang nhận xét + chữ ký, phụ lục bảng từng học sinh (16 em/trang). PDF riêng từng học sinh (bản cho phụ huynh / giáo viên), PDF thông báo.
- **Excel** `.xlsx` (ngày giữ định dạng), tên file bỏ dấu.
- **Tóm tắt gửi Zalo** — không nêu tên học sinh vi phạm.

---

## 9. Email & thông báo

### 9.1 Thông báo cập nhật trong app (cả 4 app)
- Dữ liệu ở `updates/notes.js` (`window.MMH_UPDATES` / `HK_UPDATES` / `PD_UPDATES`), mục mới thêm **lên đầu**: `id` `YYYY-MM-DD-vX.Y`, `version`, `date`, `title`, `summary`, `items:[{type:new|imp|fix, title, text, img}]` (+ `en` cùng số mục ở app có email tiếng Anh, + `guide` / `guideVi` PDF).
- Tự hiện khi đăng nhập trong **7 ngày** kể từ `date`; tick "Không hiển thị lại"; bấm **badge phiên bản** để xem lại toàn bộ lịch sử.
- Mỗi mục có **ảnh chụp thật** (dữ liệu giả) ở `updates/vX.Y/*.jpg`; viết kiểu *bấm vào đâu → làm gì → kết quả*, 2–3 câu.
- CRM: nút "What's new" trên thanh trên; nhóm Thái: thông báo hoàn toàn tiếng Anh.

### 9.2 Email thông báo cập nhật cho toàn nhân sự (`UPM`, Report Hub v17.0–17.1, CRM v30.3)
Admin chọn **1 bản cập nhật** (radio) → xem trước → gửi: email kiểu thư Outlook thường (Dear All · lời mở · Link · Version · WHAT'S NEW đánh số, **ảnh nhúng `cid:`** · USER GUIDE · chữ ký · "automated email, do not reply"); đính kèm HD bản cập nhật + HDSD toàn hệ thống (≤ 22 MB, thừa thì chỉ để link). Report Hub viết tiếng Việt, CRM tiếng Anh. Người nhận: mọi người dùng đang hoạt động.

### 9.3 Email tự động theo sự kiện
- **Phụ huynh nhận thư khi con được cộng / bị trừ điểm** (Sổ theo dõi `guiPhuHuynh_`): gộp các mục vừa ghi thành 1 thư / học sinh; ảnh nhân vật theo tình huống; lời nhắn theo mức độ (lần đầu / lần 2 trong tháng / ≥ 5 lần hoặc tái phạm ≥ 3 / tin vui); tổng điểm tháng + xếp loại tạm tính; nút "Xem chi tiết & tải PDF" (link sâu); link huỷ nhận thư ký HMAC; GVCN bật / tắt, chọn gửi cả điểm cộng.
- Hoàn thành việc ⇒ người giao nhận email; trả lời trao đổi ⇒ bên kia nhận email.
- Email đề xuất / duyệt công tác (mẫu chung), email báo cáo KPI tháng.
- Kiểm **quota email** trước khi gửi (`conQuotaMail`); không gọi `MailApp` trực tiếp ở MMH mà qua `mmhMail_` (đúng miền gửi).

---

## 10. Hướng dẫn, chế độ trải nghiệm, HDSD PDF

### 10.1 Hướng dẫn từng bước trong app (`tour.js`)
Tự chạy lần đầu theo vai (GVCN 11 bước, cán bộ lớp 9, phụ huynh 9); khoét sáng đúng phần tử + bàn tay chỉ + thẻ có nhân vật, Tiếp / Quay lại / Bỏ qua, phím ← → Esc; mở lại ở nút **?**.

### 10.2 Chế độ "Kiểm tra tính năng ứng dụng" (Sổ theo dõi v4.0–4.5, cho ban giám khảo / người mới)
- `demo.js` nạp đầu trang: **chặn `fetch` tới backend** và trả lời bằng **máy chủ mô phỏng** trong trình duyệt (dữ liệu mẫu tên giả, lưu `localStorage`); email gửi đi ⇒ **Hộp thư mô phỏng**; link trong thư mở đúng trang.
- Thanh trải nghiệm: **đổi vai** (GVCN · Lớp trưởng · Tổ trưởng · Phụ huynh), Hướng dẫn, Hộp thư, Làm lại, Thoát (khôi phục phiên thật).
- **Hướng dẫn trải nghiệm theo vai** (`demo-guide.js`): chọn vai → danh sách việc → hướng dẫn TỪNG BƯỚC: 4 tấm che tối + **vòng sáng** quanh chỗ cần bấm + bong bóng chỉ dẫn; bấm đúng chỗ là tự sang bước (bắt cả `pointerdown`); tự đổi vai / đổi trang giữa chừng và tiếp tục (`sessionStorage`). Tên việc ngắn, tự nhiên — không viết "đóng vai…".
- Luật: **thêm lệnh backend mới ⇒ thêm `case` trong máy chủ mô phỏng**.

### 10.3 HDSD PDF ngang 16:9
- Pipeline: `cap.js` (Playwright + backend giả lập chụp mọi cảnh, **số chú thích màu cam** tự vẽ quanh phần tử) → `build.js` (HTML trang chiếu, ảnh thật, hyperlink, QR) → PDF. Report Hub có `deckkit.js` dùng chung, mỗi bản HD 1 file nội dung.
- Sổ theo dõi: 3 bộ (GVCN · cán bộ lớp · phụ huynh) + **bản đầy đủ** ghép tự động (bìa, mục lục, trang phân cách) + HD trải nghiệm; nhân vật góc dưới mỗi trang nội dung (tự bỏ nếu chạm chữ), **bìa và trang phân cách không có nhân vật**; không nhắc vai Quản trị.
- Link HD ngay ở màn đăng nhập; thư duyệt phụ huynh tự đính kèm HD đúng phiên bản (`PH_PDF_VER`).

### 10.4 "Tính năng sắp ra mắt" (`roadmap.js`)
Hộp lộ trình: mục đang dùng + các mục "ĐANG PHÁT TRIỂN" (bấm ⇒ "Nội dung đang phát triển…"); lối vào ở màn đăng nhập, menu tài khoản, trang phụ huynh. Hữu ích khi trình bày tầm nhìn mở rộng.

### 10.5 Lời hướng dẫn tại chỗ
Bấm vào ô quan trọng (email đăng ký, email đăng nhập) ⇒ hiện khung hướng dẫn kèm ảnh nhân vật: nhập gì, mã gửi về đâu, xem Thư rác, khi nào nhận thư (v4.8).

---

## 11. Nhân vật đồng hành (cô Thảo) & cách xưng hô

- `mascot.js` (`MASCOT.say / img / loader`): **16–18 biểu cảm 3D** (chào, hướng dẫn, chỉ tay, vui, khen lớn, cổ vũ, buồn, lo lắng, nghiêm, giận, suy nghĩ, ngạc nhiên, nghỉ ngơi, ăn mừng, chụp ảnh, cảm ơn, chạy…), **nhiều bộ trang phục** (chủ nhiệm, đời thường, áo dài — tự ưu tiên 14–22/11, STEM, mùa đông…), chọn ngẫu nhiên trong ảnh đã tải; ảnh lỗi ⇒ SVG dự phòng; hiệu ứng động CSS theo biểu cảm.
- **Phản ứng khi ghi điểm** (`mReact`): khen ⇒ vui / khen lớn; trừ lần đầu ⇒ buồn; lần 2 ⇒ nghiêm; lần 3+ hoặc ≥ 6 lỗi/tháng ⇒ giận.
- **Bong bóng lời nói** góc dưới: tự ẩn sau vài giây **tính từ lúc thật sự hiện** (trang mở ở nền thì chờ đến khi hiển thị), chạm ra ngoài / cuộn là ẩn, có ×.
- Có mặt ở: lời chào, màn chờ, hướng dẫn, báo cáo, PDF, email, hộp xác nhận.
- Ảnh: tạo bằng Gemini theo **prompt mẫu viết cho người không rành** (`docs/prompt-chibi-3d.md`, lặp đủ REFERENCE + CHARACTER + OUTFIT + STYLE mỗi khung); tách nền tự động (`tools/mascot/cut.py`: flood-fill nền trắng, giữ bóng chân mờ ⇒ webp 360 px + png cho email); video nền xanh ⇒ WebP động bằng ffmpeg chromakey. **Không đưa ảnh thật của người vào repo.**
- **Xưng hô** (người dùng yêu cầu):
  - Với phụ huynh: nói về con ⇒ **"cô Thảo"**; tự xưng với các bác ⇒ **"em"**; thông báo / hướng dẫn ⇒ **"giáo viên chủ nhiệm"**; không xưng "cô" trống không. Phụ huynh 1 em ⇒ "bác"; trang chung ⇒ "các bác". Học sinh ⇒ "các con / con X".
  - Với cán bộ lớp (học sinh) ⇒ "em"; với GVCN ⇒ "Chào cô Thảo!".
  - Tránh từ khó / khẩu hiệu ("chốt" ⇒ "khoá sổ" / "xác nhận xếp loại"; "Cô chủ nhiệm" ⇒ "Giáo viên chủ nhiệm").

---

## 12. Đa ngôn ngữ

- **CRM nhóm Thái = toàn bộ tiếng Anh** (v30.4): bộ dịch DOM (`DICT_EN` / `RULES_EN`, bật khi `I18N.on`) + từ điển bổ sung; chữ không nằm trên giao diện (tên KPI, Total KPI, file Word, email KPI, gợi ý chi phí) sửa trong code theo cờ ngôn ngữ. Máy mới + trình duyệt không phải tiếng Việt ⇒ màn đăng nhập tiếng Anh.
- **Kiểm bằng máy**: Playwright đăng nhập vai nhóm Thái, liệt kê mọi text node còn dấu tiếng Việt ⇒ phải bằng 0.
- Thông báo cập nhật & HDSD có bản tiếng Anh riêng (ảnh chụp giao diện tiếng Anh, dữ liệu giả Thái Lan).

---

## 13. Tải file PDF / Excel, ảnh, bằng chứng

- **`taive.js` (`DL`)**: không dùng lệnh In của trình duyệt (điện thoại, trình duyệt trong Zalo / Gmail bấm "không thấy gì"). PDF = dựng trang trong iframe ẩn → `html2canvas` từng trang → `jsPDF` → **tự tải + bảng Mở file / Chia sẻ / Tải lại**; màn chờ có % tiến độ. Excel: mọi link `.csv` tự đổi sang `.xlsx` (SheetJS). Thư viện để ở `vendor/`, tải khi cần lần đầu.
- **Ảnh / tài liệu bằng chứng** (Sổ theo dõi v3.1): Chụp ảnh (điện thoại) / Chọn ảnh, tài liệu ngay ở bước ghi; ảnh **thu nhỏ ≤ 1600 px JPEG** trước khi gửi; lưu thư mục Drive riêng tư; biểu tượng 📎 mở xem; phụ huynh không xem được.
- **Ảnh địa bàn** (CRM v30.7): gửi nền sau khi chữ đã lưu (xem 4.3).
- **Tài liệu đào tạo** (Report Hub v16.4): tải chạy nền, nút "Tạo thư mục tài liệu".
- **Product Data**: tài liệu theo `FOLDER_MAP` (danh mục × loại tài liệu), thư viện ảnh cuộn ngang gốc (bỏ GSAP / Swiper cho nhẹ).

---

## 14. Riêng tư & an toàn dữ liệu

- Repo app để **công khai** ⇒ ảnh phát hành, HDSD, mock **chỉ dùng dữ liệu giả**: không tên / điểm học sinh thật, không số KPI / ngân sách thật, **không email nhân sự**.
- Code backend ở **kho riêng tư**.
- Mỗi người chỉ thấy phần được phép (lọc ngay khi dữ liệu về, backend kiểm lại quyền ghi).
- Trang khách chỉ đọc; bằng chứng không lộ mã file; đệm phía máy chủ tách riêng cho khách.
- Huỷ nhận thư bằng link ký HMAC; phiên đăng nhập có thể thu hồi từ xa.
- Thông tin riêng (học phí, sức khoẻ…) chỉ gửi đúng gia đình (định hướng mở rộng).
- Việc còn chờ: trang phụ huynh chỉ hiện số liệu chung của cả lớp, xem chi tiết từng em cần xác thực email phụ huynh.

---

## 15. Quy trình phát hành & kiểm thử

**Mỗi thay đổi người dùng nhìn thấy (cùng 1 PR):**
1. Tăng số phiên bản (badge cạnh tên app) + tham số cache `notes.js?v=`.
2. Thêm mục thông báo lên đầu `notes.js` + ảnh thật (dữ liệu giả) `updates/vX.Y/` (JPEG ~82, rộng ≤ 1300 px, < 200 KB).
3. Tính năng nhiều bước ⇒ PDF HDSD ngang 16:9 ở `docs/`.
4. Cập nhật mục phiên bản trong `CLAUDE.md`.
5. Kiểm thử → commit → PR → **squash merge `main`** (chủ repo đã cho phép).

**Kiểm thử:**
- Playwright (Chromium có sẵn) + **backend giả lập** (`tools/test/mock.js`, `page.route(/script\.google\.com/)`), vì `script.google.com` bị chặn trong môi trường Claude.
- Mock có các "núm vặn": `lag`, `drop`, `flaky`, `failWrite`, `staleMs`, `revoked`, `oldBackend`, `khoa`, `phReg`, đăng nhập sẵn `{tk}` / `{as:'gvcn'}`, giả lập ngày `{time}`, người khác ghi `M.ext()`.
- Bộ kiểm thử tổng (`run.js`) chạy mọi mục cũ + mới, kết thúc bằng "Tất cả đạt" và "không lỗi JavaScript".
- `node --check` mọi khối `<script>`; kịch bản tự bấm theo vòng sáng để kiểm 14 bài hướng dẫn trên máy tính + điện thoại; bộ quét chữ Việt cho bản tiếng Anh; kiểm PDF không tràn trang.
- Báo lại người dùng ngắn gọn: đã sửa gì, họ sẽ thấy gì, giới hạn còn lại.

---

## 16. Cạm bẫy đã gặp (bài học)

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Đăng nhập lỗi trên Chrome nhiều tài khoản Gmail | Thẻ `<script>` JSONP bị chuyển trang chọn tài khoản | Đọc bằng `fetch(credentials:"omit")`, hỏng mới quay về `<script>` |
| Ghi đi nhầm backend | Đọc biến URL toàn cục lúc gửi (người dùng đã đổi tab) | Chụp URL backend **lúc bấm** |
| Ghi nhầm dòng | Dựa số dòng, có người chèn / xoá dòng | Cột ID cố định, hoặc gửi kèm tên hiện tại để khoá |
| Thẻ vừa thêm biến mất / vừa xoá hiện lại | Dữ liệu cũ từ máy chủ về sau lần ghi | Sổ ghi nhớ thao tác áp lại (`RT_LEDGER`, `hqOverlay`) |
| "Không ghi được" khi mạng yếu | Gửi 1 lần, hết giờ là mất | Hàng đợi bền vững + `rid` + xác minh trước khi gửi lại |
| Gửi ảnh mất vài phút | Chữ + ảnh 1 request, máy chủ xử lý nặng | Tách 2 bước, chữ trước, ảnh nền |
| Tải PDF "không thấy gì" trên điện thoại / Zalo | Lệnh In không chạy trong trình duyệt nhúng | Tự dựng PDF bằng html2canvas + jsPDF |
| Bong bóng nhân vật nằm mãi | Hẹn giờ ẩn chạy lúc trang ở nền, khung hiện sau | Bắt đầu đếm giờ khi thật sự hiện |
| Nút che ô tick trên điện thoại | `.btn{width:100%}` chung + `flex:none` | Quy tắc riêng, xếp dọc trên màn hẹp |
| Back của điện thoại thoát khỏi app | App không ghi lịch sử | `pushState` cho mục / hộp, chốt đầu lịch sử |
| Đổi `#hash` bị hiểu là bấm Back | `popstate` cũng bắn khi app tự đổi hash | Báo trước `BACK.hashNav()` |
| Quy tắc CSS mới không ăn | Quy tắc cũ cụ thể hơn (`.box button{…}`) | Viết `.box .new-btn{…}` |
| Rời trang mất trạng thái | Thứ tự `beforeunload → pagehide → visibilitychange` | Đặt cờ `GONE` ở `pagehide` |
| Trigger / menu Sheet chạy code chưa deploy | Trigger chạy **code đã lưu**, web app chạy **bản deploy** | Sửa qua kho backend, không lưu dở trên trình soạn |
| Playwright treo khi giả lập giờ | `clock.setFixedTime` làm vòng chờ theo `Date.now()` không dừng | Dùng bộ đếm vòng lặp |
| Email vào spam | Gửi từ miền `@mani.inc` | Luôn gửi từ `@manimedicalhanoi.com` (`mmhMail_`) |
| Tiêu đề thông báo hiện `&amp;` | Tiêu đề là chữ thuần | Chỉ `summary` / `text` dùng HTML |

---

## 17. Checklist khi làm một app mới

**Nền tảng (nên có ngay từ đầu)**
- [ ] 1 file `index.html` trên GitHub Pages + `CLAUDE.md` (mẫu: skill `gh-webapp-upgrader ▸ references/claude-md-template.md`).
- [ ] Backend Apps Script trong **kho backend riêng tư**, deploy bằng GitHub Actions (`assets/backend-repo/`).
- [ ] Lệnh `bootstrap` gộp + `sync {rev}` + ghi có `rid` + ID cố định.
- [ ] Đăng nhập email + mã 6 số (dùng chung phiên `mmh_tk` nếu là app MMH).
- [ ] Quyền: mặc định theo vai trò + ngoại lệ từng người; backend kiểm lại.
- [ ] Bản lưu trên máy để mở tức thì + đồng bộ nền.
- [ ] Hàng đợi ghi bền vững (`assets/outbox.js`) + chip trạng thái.
- [ ] Chủ đề màu qua biến CSS, font Aptos, phong cách nhã nhặn.
- [ ] Thông báo cập nhật (`notes.js`) + badge phiên bản + lịch sử.
- [ ] Backend giả lập + `run.js` Playwright.

**Nên thêm khi app lớn dần**
- [ ] Tìm nhanh Ctrl+K + lệnh nhanh.
- [ ] Số liệu bấm được → màn chi tiết nhiều tầng.
- [ ] Nút Back ở lại trong app (`back.js`).
- [ ] Popup xếp hàng khi đăng nhập; nhắc hạn tự động.
- [ ] Báo cáo theo kỳ có so kỳ trước, lời văn tự soạn, PDF ngang, Excel `.xlsx`.
- [ ] Email tự động theo sự kiện (có link sâu, huỷ nhận ký HMAC, đúng miền gửi).
- [ ] Email thông báo cập nhật cho toàn bộ người dùng.
- [ ] Hướng dẫn từng bước theo vai + HDSD PDF ảnh thật.
- [ ] Chế độ trải nghiệm có máy chủ mô phỏng (khi cần trình diễn / dự thi).
- [ ] Nhân vật đồng hành + quy tắc xưng hô (nếu đối tượng là học sinh / phụ huynh / người mới).
- [ ] Bản tiếng Anh + bộ quét chữ Việt (nếu có người dùng nước ngoài).
- [ ] Trang phụ chỉ đọc cho khách (phụ huynh, đối tác) dùng chung module.

---

## 18. Bảng tra nhanh: muốn X → chép từ đâu

| Muốn có | Repo | Tìm theo |
|---|---|---|
| Đăng nhập email + mã 6 số | MMH-Report / Sổ theo dõi | module `AUTH` · `lgEmail` / `lgCode`; backend `RH_Auth.gs` / `DangNhapEmail.gs` |
| Đọc Apps Script không kèm cookie | MMH-Report / MMH-CRM | `AUTH` (bọc `<script>.src`) |
| Trang phân quyền | MMH-Report | `ADM`, `PERM`, `PERM.FEAT` |
| Hàng đợi ghi | MMH-Report / Sổ theo dõi / Product-Data | `OUTBOX` · `HQ` · `PQ`; skill `assets/outbox.js` |
| Ảnh gửi nền 2 bước | MMH-CRM | khối v30.7 |
| Cập nhật trực tiếp | Sổ theo dõi | `LIVE` (khối `v32-js`), backend `DongBo.gs` |
| 10 / 18 chủ đề màu | MMH-Report `theme-css` · Sổ theo dõi `THEME` | `THEME.open()` |
| Biểu tượng SVG thay emoji | MMH-CRM | `V30_ICON`, khối `v30-css` |
| Thanh dưới điện thoại + trang Hôm nay | MMH-CRM | `V31.today()` |
| Tìm nhanh Ctrl+K | MMH-Report | `QS`, `QS_EXTRA_CMDS` |
| Tìm thông minh + rê chuột | Sổ theo dõi | `parseQ`, `tipCtx` (khối `v39-js`) |
| Màn chi tiết khi bấm số liệu | Sổ theo dõi | `DRILL` (khối `v46-js`) |
| Nút Back | Sổ theo dõi | `back.js` |
| Lịch chung + màu theo loại | MMH-Report | MMH Calendar, `KIND`, `MC.ev` |
| Giao việc + email từ hộp thư mình | MMH-Report | `AT`, Training Hub `RH_Assign.gs` |
| Duyệt công tác hàng loạt | MMH-Report v17.4 / MMH-CRM v30.8 | nút "Duyệt công tác" |
| Nhắc hạn chứng từ / KPI | MMH-Report | `DL`, `#kpn` |
| KPI màu theo file, Total KPI | MMH-Report | `tone()`, `.kp-who`, `pendTag`, `KT` |
| Báo cáo theo kỳ + lời văn tự soạn | Sổ theo dõi | `bcPeriod`, `bcStats`, `bcAuto` (khối `v33-js`) |
| Bộ biểu đồ đa dạng (donut, heatmap, hai phía…) | Sổ theo dõi | `vpStats`, `vpBlock` (khối `v47-js`) |
| PDF khổ ngang có biểu đồ | Sổ theo dõi | `baocao.js` (`RPT`) |
| Tải PDF / Excel trên điện thoại | Sổ theo dõi | `taive.js` (`DL`) |
| Thông báo cập nhật trong app | cả 4 app | `updates/notes.js`, `UPD3` / module thông báo |
| Email cập nhật cho toàn nhân sự | MMH-Report / MMH-CRM | `UPM`, Training Hub `RH_UpdMail.gs` |
| Email phụ huynh theo sự kiện + huỷ nhận HMAC | Sổ theo dõi | backend `KhoaThang.gs` (`guiPhuHuynh_`, `loiNhan_`) |
| Đăng ký có duyệt | Sổ theo dõi | `phDangKy` / `phXacNhan` / `phDuyet` (khối `v38-js`) |
| Khoá sổ tháng | Sổ theo dõi | `lockMonth`, `kiemKhoa_` (khối `v37-js`) |
| Ghi theo ngày xảy ra | Sổ theo dõi | `wkOfDate`, `#gc46` (khối `v46-js`) |
| Hướng dẫn từng bước | Sổ theo dõi | `tour.js` (`TOUR.run`) |
| Chế độ trải nghiệm + máy chủ mô phỏng | Sổ theo dõi | `demo.js`, `demo-ui.js`, `demo-guide.js` |
| "Tính năng sắp ra mắt" | Sổ theo dõi | `roadmap.js` |
| Nhân vật đồng hành | Sổ theo dõi | `mascot.js`, `tools/mascot/cut.py`, `docs/prompt-chibi-3d.md` |
| HDSD PDF ảnh thật | MMH-Report / Sổ theo dõi | `tools/guide/cap.js` → `build.js` (+ `deckkit.js`) |
| Bản tiếng Anh toàn app | MMH-CRM | `DICT_EN`, `RULES_EN`, khối v30.4 |
| Mở mới + duyệt có bằng chứng, trả lại bổ sung | MMH-CRM | khối v30.5 (`naDecide`, `naChecks`) |
| Kho backend tự deploy | mmh-backend / yenhoa-backend | `.github/workflows/deploy.yml`, `tools/` |
| Quy trình đầy đủ | MMH-Report | skill `skills/gh-webapp-upgrader/` (`SKILL.md` + `references/*.md`) |

---

*Cập nhật lần cuối: 11/10/2026 — Report Hub v17.4 · CRM v30.9 · Product Data v2.0 · Sổ theo dõi học sinh v4.8.*
