/* HDSD v15.5 — Giao việc · Email tự động khi hoàn thành · Sửa dữ liệu Marketing trên MMH Calendar
   Chạy: node tools/guide/cap.js asgadd asgpopup mkdrawer → node tools/guide/tojpg.js → node tools/guide/build155.js
         → PDF=1 node tools/guide/render.js → copy tools/guide/out.pdf vào docs/ */
const { L, a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v15.5';

/* 1. Bìa */
slide({
  bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">THÔNG BÁO CẬP NHẬT · REPORT HUB v15.5</div>
    <h1>Giao việc &amp; dữ liệu Marketing<br><span>Rõ người giao · Tự báo hoàn thành · Sửa ngay trên lịch</span></h1>
    <p class="cv-p">Việc được giao hiện popup cho người nhận và được cắm cờ trên lịch; hoàn thành là người giao tự nhận email. Sự kiện offline và bài đăng online sửa / thêm / xoá thẳng từ MMH Calendar.</p>
    <div class="cv-chips"><span>✉ Việc được giao</span><span>📨 Email tự động</span><span>🎪 Marketing Offline</span><span>📣 Digital Marketing</span></div>
    <div class="cv-link">Mở app: ${a(L.app)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
  </div>
  <div class="cv-r">${fig({ img: 'mkmenu', w: 760, frame: 'browser', crop: [0, 0, 1, 0.86], map: {} })}</div>`
});

/* 2. Giao việc */
slide({
  sec: 'GIAO VIỆC', kick: 'BƯỚC 1 / 4', acc: '#B04F4B', title: 'Giao việc cho người khác', sub: 'Team Leader / Manager / Director — thao tác như thêm việc bình thường, chỉ cần chọn PIC khác', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, 'Nhấp đúp vào ngày trên <b>Lịch làm việc</b> (hoặc <b>＋ Thêm việc</b>) → đặt <b>tên công việc</b>, chọn Key task.'],
    [2, 'Chọn <b>PIC</b> là người nhận việc.'],
    [3, 'Giữ tick <b>Soạn email giao việc</b> → hộp thư mở sẵn mẫu thư; email nay có kèm <b>link MMH Report Hub</b>.'],
    [4, 'Bấm <b>Thêm</b>. Hệ thống ghi nhận <b>ai giao cho ai</b> (sheet <b>RH_Assign</b> trong file Training Master) — người nhận sẽ thấy popup khi đăng nhập.'],
  ])}
    ${tip('Giao lại một việc đã có: mở task → <b>✉️ Gửi email</b> giao việc — cũng được ghi nhận như trên.')}</div>
    <div class="col-f">${fig({ img: 'asgadd', w: 470, frame: 'card', maxH: 560 })}</div>
  </div>`
});

/* 3. Popup người nhận */
slide({
  sec: 'GIAO VIỆC', kick: 'BƯỚC 2 / 4', acc: '#B04F4B', title: 'Người nhận: popup khi đăng nhập', sub: 'Mỗi việc mới chỉ hiện một lần — sau đó luôn có cờ trên lịch', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, 'Ngay khi đăng nhập: <b>“Bạn có N việc mới được giao”</b>.'],
    [2, 'Mỗi việc ghi rõ <b>Email từ ai</b> (người giao), Key task, ngày bắt đầu và <b>hạn</b>.'],
    [3, '<b>Mở công việc</b> để cập nhật tiến độ ngay, hoặc <b>Xem Lịch làm việc</b>.'],
  ])}
    ${tip('Thứ tự popup khi đăng nhập: Thông báo cập nhật → Nhắc hạn chứng từ → <b>Việc mới được giao</b> → Thư nhắc việc. Mỗi hộp chờ hộp trước đóng mới hiện.')}</div>
    <div class="col-f">${fig({ img: 'asgpopup', w: 760, frame: 'browser', crop: [0.27, 0.29, 0.46, 0.43] })}</div>
  </div>`
});

/* 4. Cờ */
slide({
  sec: 'GIAO VIỆC', kick: 'BƯỚC 3 / 4', acc: '#B04F4B', title: 'Nhãn “✉ Email từ …” trên lịch và danh sách', sub: 'Việc được giao luôn được đánh dấu quan trọng — ai cũng thấy ai là người giao', body: `
  <div class="pair">
    <div>${fig({ img: 'asgcal', w: 545, frame: 'browser', crop: [0.17, 0.12, 0.45, 0.62] })}
      <div class="cap"><b>Lịch làm việc</b> — thẻ việc có nhãn đỏ nhạt <b>✉ Email từ Thuong</b>; ô Deadline thu gọn hiện dấu <b>✉</b>. Rê chuột để xem người giao, người nhận, hạn.</div></div>
    <div>${fig({ img: 'asgdetail', w: 545, frame: 'browser', crop: [0.235, 0.36, 0.5, 0.32] })}
      <div class="cap"><b>Cập nhật công việc / Tiến độ</b> — dòng sub-task có cùng nhãn. Hoàn thành xong nhãn chuyển xám <b>✓ Email từ Thuong</b>.</div></div>
  </div>`
});

/* 5. Email tự động */
const mail = `<div class="fr-card" style="width:560px"><div style="padding:18px 22px;font-family:Aptos,'Segoe UI',Arial,sans-serif;color:#1F3347">
  <div style="font-size:18px;font-weight:700;color:#003047;margin-bottom:10px">[MMH] Đã hoàn thành: Truyền thông: Agenda sự kiện</div>
  <div style="display:flex;gap:10px;align-items:center;font-size:12.5px;color:#6B7B8C;margin-bottom:14px"><span style="width:34px;height:34px;border-radius:50%;background:#3A5CAA;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">R</span><span><b style="color:#1F3347">MMH Report Hub</b><br>đến Thuong · cc Minh Trang</span></div>
  <div style="font-size:14px;line-height:1.55">Chào Thuong,<br><br><b>Minh Trang</b> đã hoàn thành công việc bạn giao trên MMH Report Hub:
  <table style="margin:10px 0;font-size:13.5px;border-collapse:collapse">
   <tr><td style="color:#6B7B8C;padding:3px 14px 3px 0">Công việc</td><td style="font-weight:600">Truyền thông: Agenda sự kiện</td></tr>
   <tr><td style="color:#6B7B8C;padding:3px 14px 3px 0">Thuộc Key Task</td><td style="font-weight:600">20261019 Dental Products_Seminar_Dr. Nguyen Thanh Dung…</td></tr>
   <tr><td style="color:#6B7B8C;padding:3px 14px 3px 0">Hạn</td><td style="font-weight:600">2026-10-08</td></tr>
   <tr><td style="color:#6B7B8C;padding:3px 14px 3px 0">Hoàn thành lúc</td><td style="font-weight:600">2026-10-07 16:20</td></tr>
   <tr><td style="color:#6B7B8C;padding:3px 14px 3px 0">Kết quả</td><td style="font-weight:600">Đã đăng agenda trên page Mani Dental</td></tr></table>
  <span style="display:inline-block;background:#3A5CAA;color:#fff;padding:8px 14px;border-radius:8px;font-weight:600;font-size:13px">Mở MMH Report Hub</span>
  <div style="color:#7A8999;font-size:12px;margin-top:10px">Email tự động từ MMH Report Hub — không cần trả lời.</div></div></div></div>`;
slide({
  sec: 'GIAO VIỆC', kick: 'BƯỚC 4 / 4', acc: '#B04F4B', title: 'Hoàn thành → người giao tự nhận email', sub: 'PIC không cần làm gì thêm ngoài việc chuyển trạng thái sang Completed', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, 'Người nhận chuyển việc sang <b>Completed</b> (thanh tiến độ 100%, chip trạng thái hoặc form cập nhật).'],
    [2, 'Hệ thống <b>tự gửi email</b> cho người giao (CC người nhận) kèm kết quả và link Report Hub.'],
    [3, 'Cập nhật Completed trực tiếp trên Google Sheet cũng được — lần mở app kế tiếp của bất kỳ ai liên quan sẽ tự gửi email.'],
  ])}
    ${tip('Mỗi việc chỉ gửi <b>một</b> email hoàn thành, kể cả khi bấm lưu nhiều lần.')}</div>
    <div class="col-f">${mail}</div>
  </div>`
});

/* 6. Sửa dữ liệu Marketing */
slide({
  sec: 'MARKETING', kick: 'SỬA', acc: '#9B4F7E', title: 'Sửa sự kiện offline &amp; bài đăng ngay trên lịch', sub: 'Ghi thẳng vào 2 file Marketing FY68 — không cần mở Google Sheet', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, 'Bấm vào sự kiện / bài đăng trên MMH Calendar → <b>✏️ Sửa</b>. Form ghi rõ <b>file · sheet · dòng</b> sẽ được sửa.'],
    [2, 'Ngày diễn ra: chọn từ – đến, app tự ghi đúng dạng <b>20261026-29</b> và cập nhật cột Month.'],
    [3, 'Các ô chọn (Loại sự kiện, Kế hoạch, Format, Page, Trạng thái…) lấy <b>đúng danh mục trên sheet</b>.'],
    [4, '<b>🗑️ Xoá</b> — xoá hẳn dòng trên sheet (có hỏi xác nhận).'],
    [5, '<b>Lưu</b> — chỉ những ô bạn đổi mới được ghi; cột có công thức (Event Name, Area, số liệu thực tế) giữ nguyên. Lịch cập nhật ngay.'],
  ])}</div>
    <div class="col-f row">${fig({ img: 'mkedit', w: 430, frame: 'card', maxH: 560 })}</div>
  </div>`
});

/* 7. Thêm mới + quyền */
slide({
  sec: 'MARKETING', kick: 'THÊM MỚI', acc: '#9B4F7E', title: 'Thêm sự kiện / bài đăng mới', sub: 'Nhấp đúp vào ngày hoặc ＋ Tạo mới — có thêm 3 lựa chọn cho nhóm Marketing', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, '<b>🎪 Sự kiện offline</b> → dòng mới cuối sheet <b>REPORT_EVENT</b> (tự chép công thức của dòng trên, tự đánh số No).'],
    [2, '<b>📸 Bài đăng sự kiện</b> → sheet <b>EVENT REPORT</b>; <b>🦷 Bài đăng sản phẩm</b> → sheet <b>PRODUCT REPORT</b>.'],
    [3, 'Điền link bài đăng ⇒ cột <b>Ngày điền link</b> tự ghi ngày.'],
  ])}
    <h4 class="h4" style="margin-top:16px">Ai được sửa?</h4>
    <ul class="dl"><li>Nhân sự <b>Sales &amp; Marketing</b> (Marketing, Product, quản lý). PIC Sales chỉ xem.</li>
      <li>Mọi lần sửa được ghi nhật ký (người sửa + email) trong web app feed.</li></ul></div>
    <div class="col-f">${fig({ img: 'mkmenu', w: 600, frame: 'browser', crop: [0.22, 0.5, 0.42, 0.36] })}</div>
  </div>`
});

/* 8. Cài đặt */
slide({
  sec: 'CÀI ĐẶT', acc: '#D9981F', title: 'Dành cho quản trị: cập nhật 2 backend', sub: 'Dán code mới → Deploy ▸ Manage deployments ▸ ✏️ ▸ Version: New version ▸ Deploy (giữ nguyên link /exec)', body: `
  <div class="lk" style="grid-template-columns:1fr 1fr">
    <div class="lkc"><h4>🎓 Training Hub backend v3.12</h4>
      <p>Ghi nhận việc được giao (sheet <b>RH_Assign</b> tự tạo trong file Training Master), popup người nhận, <b>email tự động khi hoàn thành</b>.</p>
      <p><b>Web app</b><br>${a(L.hubApi)}</p><p><b>File Training Master</b><br>${a(L.trnSheet)}</p></div>
    <div class="lkc"><h4>📅 MMH Calendar Feed v3.2</h4>
      <p>Sửa / thêm / xoá dữ liệu Marketing. Dán vào <b>cả 2 project</b> feed. Tài khoản triển khai cần quyền <b>sửa</b> 2 file Marketing.</p>
      <p><b>Feed (MKT Online)</b><br>${a(L.feedOn)}</p><p><b>Feed (MKT Offline)</b><br>${a(L.feedOff)}</p>
      <p class="sm">Giới hạn người sửa: điền email vào <b>MMH_FEED.EDITORS</b> (để trống = mọi tài khoản công ty). Xem nhật ký: chạy hàm <b>xemNhatKySua</b>.</p></div>
  </div>
  ${tip('Chưa cập nhật backend thì app vẫn chạy bình thường: chỉ chưa có popup / cờ / email hoàn thành (Training Hub) và nút Sửa báo lỗi khi lưu (Feed).')}`
});

writeDeck('MMH Report Hub v15.5 — Giao việc & dữ liệu Marketing');
