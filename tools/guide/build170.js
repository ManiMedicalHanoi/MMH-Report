/* HDSD Report Hub v16.7 – v17.0 — phần mới nhất của bản HDSD đầy đủ docs/HDSD_Report_Hub_v17.0.pdf
   Ảnh: shots/r_*.jpg (backend giả lập, số liệu giả) + v168kpn (cap.js).
   Chạy: node tools/guide/build170.js → PDF=1 node tools/guide/render.js → ghép với các HDSD cũ trong docs/ (pypdf)
         thành docs/HDSD_Report_Hub_v17.0.pdf */
const { L, a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v17.0'; KIT.foot = 'Hướng dẫn sử dụng';
const br = (img, w, crop, maxH) => fig({ img, w, frame: 'browser', crop, maxH });
const ph = (img, w) => fig({ img, w: w || 240, frame: 'phone' });

slide({ bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">HƯỚNG DẪN SỬ DỤNG · MMH REPORT HUB v17.0</div>
    <h1>MMH Report Hub<br><span>Bản đầy đủ · mới nhất v16.7 – v17.0</span></h1>
    <p class="cv-p">Phần đầu: các thay đổi mới nhất (đăng nhập trên điện thoại, KPI, Total KPI công ty, lịch riêng tư, nhắc việc, email cập nhật). Phần sau: hướng dẫn toàn bộ hệ thống — MMH Calendar, giao việc & dữ liệu MKT, đăng nhập email, tìm nhanh, phân quyền, email giao việc.</p>
    <div class="cv-chips"><span>📊 KPI</span><span>🗓 Lịch riêng tư</span><span>⏰ Nhắc việc</span><span>✉ Email cập nhật</span></div>
    <div class="cv-link">Mở app: ${a(L.app)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
  </div>
  <div class="cv-r">${br('r_kt_sum', 760, [0, 0, 1, 0.8])}</div>` });

slide({ sec: 'MỤC LỤC', acc: '#3A5CAA', title: 'Nội dung tài liệu', sub: 'Bấm badge phiên bản cạnh chữ MMH Report để xem lại mọi thông báo cập nhật', body: `
  <ul class="dl" style="font-size:17px">
    <li><b>Phần 1 — Mới nhất (v16.7 – v17.0)</b>: đăng nhập điện thoại · KPI của bạn · Total KPI công ty · lịch riêng tư · nhắc việc · email cập nhật.</li>
    <li><b>Phần 2 — MMH Calendar (v15.2)</b>: lịch chung, thêm / sửa sự kiện, bộ lọc.</li>
    <li><b>Phần 3 — Giao việc &amp; dữ liệu MKT (v15.5)</b>: Key task, Sub-task, sửa dữ liệu Marketing tại chỗ.</li>
    <li><b>Phần 4 — Đăng nhập bằng email (v16.0)</b>.</li>
    <li><b>Phần 5 — Tìm nhanh · Phân quyền · Email giao việc (v16.1 – v16.3)</b>.</li>
  </ul>
  ${tip('Hình minh hoạ dùng dữ liệu giả lập — số liệu thật xem trực tiếp trên app.')}` });

slide({ sec: 'ĐĂNG NHẬP', kick: 'v16.7', acc: '#3A5CAA', title: 'Đăng nhập trên điện thoại', sub: 'Chrome đang đăng nhập một Gmail khác vẫn dùng được', body: `
  <div class="two"><div class="col-t">${steps([
    [1, 'Nhập email công ty (@manimedicalhanoi.com / @mani.inc) → <b>Gửi mã đăng nhập</b>.'],
    [2, 'Nhập <b>mã 6 số</b> trong email → <b>Đăng nhập</b>. Phiên dùng 30 ngày trên máy đó.'],
  ])}${tip('Không thấy mã ⇒ xem thư mục Spam / Thư rác.')}</div>
  <div class="col-f" style="display:flex;gap:28px;justify-content:center">${ph('r_login1', 230)}${ph('r_login2', 230)}</div></div>` });

slide({ sec: 'KPI', kick: 'v16.9', acc: '#2F6B4A', title: 'Biết rõ đang xem KPI của ai', sub: 'Menu KPI · số liệu chỉ xem, theo file MMH KPI FY68', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Quản lý chọn người ở hàng trên cùng — thẻ đang chọn viền đậm, có dòng <b>Đang xem KPI của …</b>.'],
    [2, 'Thanh tiến độ theo màu file KPI: <b>&lt; 90%</b> xám · <b>90–100%</b> xanh · <b>100–120%</b> vàng · <b>&gt; 120%</b> xanh lá.'],
    [3, 'Doanh số tháng kế toán chưa chốt ghi <b>Chưa chốt</b> (không phải 0%).'],
  ])}</div>
  <div class="col-f">${br('r_kpi_person', 700)}</div></div>` });

slide({ sec: 'KPI', kick: 'ADMIN · DIRECTOR · QUẢN LÝ', acc: '#2F6B4A', title: 'Total KPI công ty', sub: 'Menu KPI ▸ nút Total KPI công ty', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>Tổng quan</b>: doanh số toàn công ty và 4 góc nhìn (Tài chính · Khách hàng · Quy trình · Học hỏi) — bấm mục tiêu để xem KPI liên kết.'],
    [2, '<b>KPI công ty</b>: bấm ▸ để mở KPI con.'],
    [3, '<b>Thành viên</b>: % từng người theo tháng / quý / năm.'],
    [4, 'Chọn <b>Tháng · Lũy kế · Cả năm</b>; <b>Cách tính KPI</b> tóm tắt quy tắc của file KPI.'],
  ])}</div>
  <div class="col-f">${br('r_kt_sum', 700)}</div></div>` });

slide({ sec: 'KPI', kick: 'THÀNH VIÊN', acc: '#2F6B4A', title: 'KPI từng thành viên', sub: 'Total KPI công ty ▸ tab Thành viên', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Nhóm theo phòng ban; cột Cả năm · Quý · Tháng.'],
    [2, 'Ô tô màu theo cùng thang màu KPI — nhìn nhanh ai cần hỗ trợ.'],
  ])}${tip('Chỉ Admin, Director và quản lý thấy Total KPI.')}</div>
  <div class="col-f">${br('r_kt_mem', 700, [0, 0, 1, 0.75])}</div></div>` });

slide({ sec: 'LỊCH', kick: 'v16.9', acc: '#B04F4B', title: 'Lịch riêng tư hơn', sub: 'Áp dụng cho MMH Calendar và mọi lịch trong Report Hub, CRM', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>Đào tạo</b>: chỉ trainer và người được mời (audience) thấy buổi đào tạo.'],
    [2, '<b>Công tác</b> của người khác luôn ẩn.'],
    [3, 'Manager / Director / Admin bật <b>Công tác người khác</b> ở cột bộ lọc khi cần xem.'],
  ])}</div>
  <div class="col-f">${br('r_mc', 700)}</div></div>` });

slide({ sec: 'NHẮC VIỆC', kick: 'v16.8', acc: '#B04F4B', title: 'Nhắc việc đúng ngày', sub: 'Popup hiện khi mở app', body: `
  <div class="two"><div class="col-t">${steps([
    [1, '<b>Ngày 2 hằng tháng</b>: nhắc gửi báo cáo KPI tháng.'],
    [2, '<b>Ngày 09 tháng đầu quý, trước 17:00</b>: nhắc hoàn thành file tự đánh giá hiệu quả công việc quý trước — chỉ hiện đúng ngày đó.'],
    [3, 'Hạn nộp chứng từ chi phí của Kế toán: nhắc trước hạn như cũ.'],
  ])}</div>
  <div class="col-f">${fig({ img: 'v168kpn', w: 460, frame: 'card' })}</div></div>` });

slide({ sec: 'EMAIL CẬP NHẬT', kick: 'CHỈ ADMIN', acc: '#3A5CAA', title: 'Gửi email thông báo cập nhật', sub: 'Badge phiên bản (Thông báo cập nhật) ▸ Gửi email cập nhật', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Mở <b>Thông báo cập nhật</b> → <b>Gửi email cập nhật</b>.'],
    [2, 'Chọn <b>1 bản cập nhật</b> (mỗi email 1 bản), sửa lời mở đầu nếu cần — xem trước ngay bên phải: email tiếng Việt, <b>ảnh minh hoạ nằm ngay trong thư</b>.'],
    [3, '<b>Gửi thử cho tôi</b> để kiểm tra → <b>Gửi email</b> tới toàn bộ nhân sự dùng Report Hub. Đính kèm sẵn: HD của bản cập nhật + HDSD toàn hệ thống (lấy từ app, không cần tải lên Drive).'],
  ])}${tip('Tiêu đề “MMH Report Hub Update – tên bản cập nhật – ngày”. Email tự động, người nhận không cần trả lời.')}</div>
  <div class="col-f">${br('r_upm2', 700)}</div></div>` });

writeDeck('HDSD Report Hub v17.0');
