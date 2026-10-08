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
  xám viền `#E6EAEF`. Màu theo loại lịch (`KIND` trong MMH Calendar): vạch đậm + nền tô nhẹ ~13% — không quá nhạt
  (người dùng đã phản hồi v15.3 quá nhạt, khó nhìn) và không tô đặc.
- Tránh nền đậm, gradient, viền sọc, bóng đổ nặng, emoji màu dày đặc. Thông báo = thẻ trắng, viền mảnh.
- Lớp CSS chung ở `<style id="calm-css">` + `<style id="calm2-css">` cuối `index.html` — giao diện mới nên tuân theo các token ở đó.
- **Chủ đề màu (v15.7)**: `<style id="theme-css">` trong `<head>` định nghĩa 10 tông qua `html[data-theme=…]` (mặc định `mmh`, lưu
  `localStorage.mmh_theme`, nút `#th-btn` → `THEME.open()`). CSS mới **không viết cứng màu brand** mà dùng biến:
  `--t-pri` (nút chính), `--t-pri2` (hover), `--t-ink` (tiêu đề), `--t-soft` / `--t-line` (nền / viền xanh nhạt), `--t-bg`,
  `--mmh-blue`, `--mmh-navy`, `--lb1..3`, `--pale`, `--gray`. Màu `KIND` của lịch và màu trạng thái giữ cố định.
- **Thanh trên cùng (v16.6)**: 1 dòng thấp (logo · MMH Calendar · Tìm nhanh · nhóm `#tb-tools`: Thông báo cập nhật, Việc đã giao,
  Màu giao diện `#th-btn`, VN/EN `#lang-switch` · chip người dùng). Menu người dùng `UM` (`#um-pop`) chỉ còn tài khoản, Phân quyền người dùng,
  Đăng xuất (người dùng yêu cầu đưa các nút ra ngoài, trừ Phân quyền). Nút mới cho thanh trên cùng: thêm vào `#tb-tools`, giữ gọn. Nút "Đồng bộ Sales tasks" đã bỏ (backend tự đồng bộ 10 phút/lần; `#vs-btn` cất trong `#um-hidden`).
  Phần tử nằm ngoài màn hình khi đóng (ngăn kéo, bảng tin) chỉ đổ bóng khi mở (`.show` / không `.collapsed`).
- Thứ tự popup khi đăng nhập: Thông báo cập nhật (`UPD`) → Nhắc hạn chứng từ (`DL`) → Việc mới được giao (`ASG`) → Thư nhắc việc (`NT`);
  popup mới phải xếp hàng tương tự (cờ `pending` + bọc `NT.open`).

## Ghi chú kỹ thuật
- Các bản vá xếp lớp bằng `window.fn = …` trong các khối `<script>` thêm ở cuối file — giữ phong cách này.
- Backend: Google Apps Script (JSONP cho đọc, POST `URLSearchParams{action,payload}` cho ghi).
  Training Hub (`TRAINING_HUB_API`), Business Trip (backend Report Hub `GAS_URLS`), MMH Calendar Feed trong 2 file MKT.
- **Code `.gs` của cả 7 backend** nằm ở kho riêng tư **`ManiMedicalHanoi/mmh-backend`** (từ 06/10/2026): gắn vào phiên bằng
  `add_repo` (push), sửa `backends/<key>/*.gs` → PR → gộp ⇒ GitHub Actions tự deploy đúng deployment cũ (URL không đổi, gọi thử,
  lỗi tự quay lại). **Không** gửi file `.gs` cho người dùng dán / Deploy tay. Gộp backend trước, đợi Deploy xanh, rồi mới gộp
  app. Đọc `CLAUDE.md` + `TODO.md` của kho đó trước khi sửa (còn điểm chờ người dùng quyết định trước lần deploy đầu);
  quy trình đầy đủ: `skills/gh-webapp-upgrader/references/backend-deploy.md`.
  Training Hub dùng chung với repo `Training-Hub` (`rhAssign*`, sheet `RH_Assign` trong file Training Master) ⇒ giữ tương thích.
- MMH Calendar Feed (v3.2) có ghi dữ liệu: `mmhOptions` (đọc Data validation) và `mmhWrite` (update/add/delete) — không ghi cột
  có công thức, xác nhận đúng dòng bằng `check`. Web app giới hạn trong domain ⇒ gọi bằng JSONP (GET), giữ URL < ~7500 ký tự.
- Bộ dựng PDF: hàm chung ở `tools/guide/deckkit.js`; mỗi bản hướng dẫn 1 file nội dung (`build.js` = v15.2, `build155.js` = v15.5).
  Mock đăng nhập người khác: `newPage(b,{pic:'Minh Trang'})`; giả lập ngày: `{time:'2026-10-15T09:00:00+07:00'}`.
- **Thao tác lạc quan (v15.7)**: thêm / xoá Key task, Sub-task hiện ngay; `RT_LEDGER` ghi nhớ thao tác 3 phút để dữ liệu cũ từ
  backend (đang đồng bộ) không làm thẻ hiện lại / biến mất. Sửa dữ liệu MKT (`MK`) làm ngay trong khung chi tiết `#mc-dr`
  (không modal, không loading): cập nhật cục bộ trước, lỗi thì trả lại dữ liệu cũ. Mock có `lag`, `staleMs`, `failWrite` để test.
- **Hàng đợi ghi `OUTBOX` (v15.8)**: `apiPost` của mọi lệnh ghi (danh sách `POL`) đi qua hàng đợi lưu ở `localStorage.mmh_outbox_v1`:
  gắn URL backend lúc bấm, chạy tuần tự từng backend, đổi số tạm `tmp-…` sang số thật (`__tmp` trong body), thử lại khi lỗi mạng/bận
  (cùng `rid`), phản hồi không chắc ⇒ đọc lại `weekly` để xác minh trước khi gửi lại, lỗi thật ⇒ chip đỏ + bảng Thử lại / Bỏ.
  Thao tác ghi mới: cập nhật giao diện trước, gọi `apiPost`, KHÔNG chờ `_noWait` / không hiện màn hình chờ. Mock: `flaky:{action:['drop'|'lost'|'busy']}`.
- **Skill dùng chung** `skills/gh-webapp-upgrader/` (đóng gói: `skills/dist/gh-webapp-upgrader.skill`): quy trình + mẫu (outbox, theme, thông báo,
  mock, PDF, backend qua kho trung tâm `references/backend-deploy.md` + `assets/backend-repo/`) rút ra từ repo này cho mọi webapp
  GitHub khác. Sửa skill ⇒ chạy `scripts/selftest_outbox.js` + `assets/backend-repo/tools/selftest.mjs`, đóng gói lại, nhắc người
  dùng tải lại file `.skill` lên phần Skills của Claude. Bộ công cụ trong `assets/backend-repo/` phải giữ giống `mmh-backend`.
- **Đăng nhập email + mã 6 số (v16.0, `AUTH`)**: Training Hub `rhAuthStart` / `rhAuthVerify` / `rhAuthMe` (file `RH_Auth.gs` ở
  mmh-backend), danh sách người dùng sheet **`RH_Users`** (Training Master; Admin: Giang), khoá ký phiên sheet ẩn `RH_Secret`.
  Phiên lưu `localStorage.mmh_tk`; app tự gắn `tk=` vào URL của MỌI lệnh gọi `script.google.com` (bắt ở `<script>.src` và `fetch`)
  ⇒ tính năng mới không cần gắn tay. Có phiên ⇒ danh tính (`mmh_pic`) lấy từ phiên. Giai đoạn 1: vẫn có link "chọn tên như trước"
  đến `AUTH.GRACE`; giai đoạn 2 (TODO mmh-backend) backend bắt buộc `tk`. Không đưa email nhân sự vào repo công khai này.
  Mock: mã đúng `123456`, `newPage(b,{nopic:true,gate:true})` dừng ở màn đăng nhập, `{tk:'mmh.product'}` có sẵn phiên,
  `{revoked:true}` phiên bị thu hồi; `M.TKS` ghi tham số `tk` của mọi lệnh gọi. HDSD: `build160.js`.
- **Tìm nhanh `QS` (v16.1, Ctrl/⌘ + K, nút `#qs-btn`)**: tìm việc 3 phòng ban (`S._allKeys` + `SRC_CACHE` / `LS_BOOT`) và `MC.ev`
  (sự kiện, bài đăng, công tác, đào tạo), bỏ dấu, PIC chỉ thấy việc của mình. Thêm lệnh nhanh mới: đẩy vào `window.QS_EXTRA_CMDS`
  (`{ic,title,hay,run}` hoặc hàm trả về đối tượng đó / null).
- **Phân quyền `ADM` / `PERM` (v16.2)**: trang quản trị (menu tên ▸ Phân quyền người dùng) đọc / ghi `RH_Users` qua Training Hub
  `rhAdminList` / `rhAdminSave` / `rhAdminKick`. `PERM.def(u)` = quyền mặc định theo vai trò (giữ logic cũ); `Perms` chỉ lưu phần khác mặc định;
  `PERM.ov(k,m)` áp cho người đăng nhập email qua các hàm bọc `canAssign`, `trnCanCreate`, `MK.can`, `buildTabs`/`switchTab` (báo cáo),
  `tripProposeOpen`, `buildSourceTabs`/`switchSource` (Management). Chức năng mới cần phân quyền: thêm vào `PERM.FEAT` + `def` + hàm bọc,
  và thêm khoá vào `RH_PERM_KEYS` (Training Hub). Mock: `{tk:'mmh.product'}` = Admin; `M.ADMU()` danh sách giả lập.
- **Việc được giao (Training Hub v3.14 `RH_Assign.gs`, sheet `RH_Assign`)**: `rhAssignList` (items/mine/byMe) / `Add` (`via` own|system, chống trùng
  `rid`) / `Seen` / `Done` (email người giao 1 lần) / `Reply`; `rhDirectory` (email theo PIC, cần phiên email). App v16.3 (`AT`): khung Soạn email có
  hàng **Gửi từ** (Outlook deeplink cho @mani.inc, Gmail `view=cm` cho @manimedicalhanoi.com, mailto, hoặc hệ thống `rhxCall mailSend`);
  tiêu đề kèm mã `[#A…]`; danh sách theo dõi + trao đổi (bấm nhãn `.asg-flag`). Đọc email trả lời thật CHƯA làm (cần quyền Gmail đọc ⇒ chủ
  script cấp quyền lại, web app gián đoạn) — hỏi người dùng trước. HDSD v16.1–16.3: `build163.js`.
- `script.google.com` bị chặn trong môi trường Claude: không gọi thật được, luôn dùng mock để test.
- **Đọc Apps Script không kèm cookie (v16.7)**: trong module `AUTH`, bọc `<script>.src` ⇒ URL `script.google.com/macros/s/…` có `callback=`
  được đọc bằng `fetch(credentials:"omit")` rồi chạy đúng callback; hỏng 2 lần liền (web app chỉ cho domain, link `/a/macros/`) ⇒ dùng thẻ `<script>`
  như cũ. Sửa lỗi Chrome đăng nhập Gmail khác / nhiều tài khoản ⇒ không gửi được mã đăng nhập. Test: mock trả 404 cho `resourceType()==='script'`.
- **Nhắc hạn KPI (`#kpn`, khối KPI)**: ngày 02 hằng tháng — báo cáo KPI tháng trước (16:00); **ngày 09 tháng đầu quý (09/12/03/06), trước 17:00** —
  tự đánh giá quý trước (v16.8, trước đây ngày 01–08). CRM dùng cùng luật (+ popup hạn chứng từ `DL` chép từ đây). Cảnh chụp: `cap.js v168kpn`.
- **KPI (v16.9, dùng chung CRM)**: màu % theo mã màu file KPI (sheet 6): `tone()` < 90% `low` (xám) · 90–<100% `mid` (xanh) · 100–120% `ok` (vàng) · > 120% `top` (xanh lá).
  Hàng `.kp-who` chọn người + người đang xem nổi bật trên biểu đồ so sánh. Actual trống ⇒ `pendTag` ("Chưa chốt", tháng đã chốt lấy từ `sync[]` của rhKpi).
  `window.kpiShort` / `window.KPI_GROUPS` = tên KPI tiếng Việt — giao diện KPI mới phải dùng, không hiện tên tiếng Anh dài.
- **Total KPI (`KT`, v16.9)**: backend kpi `rhKpiTotal` (RH_KpiView v1.3: sheet 1 Objective & Strategy, 3 Detail KPI, 4 Rule, 6 Member Summarize), chỉ
  Admin / Director / HOD (`rhKpi` trả `total:true`). Màn gọn 3 tab (Tổng quan · KPI công ty · Thành viên) + Cách tính KPI; tên mục tiêu VN ở `OBJ`, tên KPI thiếu ở `NM`.
  Người dùng yêu cầu: gọn, không diễn giải dài. Ảnh phát hành phải dùng số giả (không đưa số KPI / ngân sách thật vào repo công khai).
- **Quyền xem lịch (`VIS`, v16.9, dùng chung CRM)**: dữ liệu `rhSessions` lọc ngay khi về (bọc callback trong setter `<script>.src`) ⇒ buổi đào tạo chỉ trainer +
  người được mời (`people`) thấy; MMH Calendar lọc ở `MC.ev` (getter), Lịch làm việc ở `c10Items`. Chuyến công tác người khác luôn ẩn, quản lý bật bằng
  `VIS.chip()` (localStorage `mmh_trip_all`).
- **Email thông báo cập nhật `UPM` (v17.0, dùng chung CRM v30.3)**: Thông báo cập nhật ▸ "Gửi email cập nhật" (chỉ Admin).
  Email tiếng Anh dạng thư thường kiểu Outlook (KHÔNG làm bản tin HTML cầu kỳ — người dùng yêu cầu): Dear All · lời mở đầu · Link · Version ·
  WHAT'S NEW đánh số, ảnh nhúng `cid:` · USER GUIDE · chữ ký · dòng "automated email, do not reply". Nội dung lấy từ trường **`en`** của
  mỗi mục `MMH_UPDATES` (`en:{title, items:[{title,text}]}` — **số mục phải bằng `items` tiếng Việt**, ảnh lấy theo thứ tự) ⇒ mục mới
  luôn kèm `en`. Gửi qua Training Hub `rhUpdMail` (`RH_UpdMail.gs`; người nhận: mọi `RH_Users` đang hoạt động). Cấu hình `window.UPM_CFG`
  (pdf = HDSD đầy đủ `docs/HDSD_Report_Hub_vX.Y.pdf`). HDSD đầy đủ = deck mới nhất (`build170.js`) ghép với các HDSD cũ bằng pypdf.
  Khung xem trước là iframe sandbox ⇒ test ảnh qua HTTP (`python3 -m http.server`), `file://` không hiện ảnh.
- **Email cập nhật v2 (v17.1)**: mỗi email chỉ 1 bản cập nhật (chọn radio); Report Hub `UPM_CFG.lang:"vi"` ⇒ email, HDSD và HD cập nhật bằng **tiếng Việt**
  (dùng title / summary / items tiếng Việt); đính kèm `guide` của mục + HDSD toàn hệ thống `UPM_CFG.pdf` (bỏ trùng). CRM dùng cùng module với `lang:"en"`.
  Bộ dựng HDSD CRM: `buildcrm_en.js` (toàn hệ thống, tiếng Anh) + `na_slides.js` / `build_na.js` (HD Mở mới VN / EN).
