/* HDSD MMH CRM v30.3 — bản ĐẦY ĐỦ (toàn bộ hệ thống, gồm các thay đổi mới nhất v30.0 – v30.3)
   Ảnh: chụp từ MMH-CRM với backend giả lập, lưu tools/guide/shots/crm_*.jpg (+ .json kích thước)
   Chạy: node tools/guide/buildcrm.js → PDF=1 node tools/guide/render.js → copy tools/guide/out.pdf thành MMH-CRM/docs/HDSD_MMH_CRM_v30.3.pdf */
const { a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v30.3'; KIT.app = 'MMH CRM'; KIT.host = 'manimedicalhanoi.github.io/MMH-CRM'; KIT.foot = 'Hướng dẫn sử dụng';
const APP = 'https://manimedicalhanoi.github.io/MMH-CRM/';
const ph = (img, w, crop) => fig({ img, w: w || 250, frame: 'phone', crop });
const br = (img, w, crop, maxH) => fig({ img, w, frame: 'browser', crop, maxH });

slide({ bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">HƯỚNG DẪN SỬ DỤNG · MMH CRM v30.3</div>
    <h1>MMH CRM<br><span>Khách hàng · đi địa bàn · công tác · KPI</span></h1>
    <p class="cv-p">Bản đầy đủ cho toàn bộ hệ thống, gồm các thay đổi mới nhất: giao diện gọn, điện thoại cho sales đi địa bàn, nút Hôm nay, Total KPI, lịch riêng tư, nhắc hạn và email cập nhật.</p>
    <div class="cv-chips"><span>📱 Điện thoại</span><span>📍 Đi địa bàn</span><span>✈️ Công tác</span><span>📊 KPI</span></div>
    <div class="cv-link">Mở app: ${a(APP)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
  </div>
  <div class="cv-r">${br('crm_cal', 760, [0, 0, 1, 0.9])}</div>` });

slide({ sec: 'BẮT ĐẦU', kick: 'ĐĂNG NHẬP', acc: '#3A5CAA', title: 'Đăng nhập bằng email công ty', sub: 'Dùng chung tài khoản với MMH Report Hub', body: `
  <div class="two"><div class="col-t">${steps([
    [1, `Mở ${a(APP)} → nhập email <b>@manimedicalhanoi.com</b> hoặc <b>@mani.inc</b> → <b>Gửi mã đăng nhập</b>.`],
    [2, 'Mở hộp thư, nhập <b>mã 6 số</b> → <b>Đăng nhập</b>. Phiên dùng được 30 ngày trên máy đó.'],
    [3, 'App tự mở đúng file dữ liệu của nhóm bạn (Dental / Surgical / Eyeless / Thailand) và đúng quyền xem.'],
  ])}${tip('Điện thoại đang đăng nhập một Gmail khác vẫn dùng được bình thường. Không thấy mã ⇒ xem thư mục <b>Spam / Thư rác</b>.')}</div>
  <div class="col-f">${ph('crm_login', 250)}</div></div>` });

slide({ sec: 'GIAO DIỆN', kick: 'MÁY TÍNH', acc: '#3A5CAA', title: 'Màn hình chính', sub: 'Mở app là vào Lịch công việc tuần này', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>Thanh trên cùng</b>: MMH Calendar · Tìm nhanh (Ctrl + K) · Liên kết · năm FY · Có gì mới · màu giao diện · tên của bạn.'],
    [2, '<b>Menu bên</b>: Dashboard, KPI, Khách hàng, Key stakeholder, Cập nhật, Mở mới, Đơn hàng… Quản lý có thêm <b>Nhóm đang xem</b>.'],
    [3, '<b>Lịch công việc</b>: đi địa bàn · việc khác · công tác · đào tạo. Bấm thẻ để cập nhật, bấm ngày trống / <b>＋ Thêm việc</b> để thêm.'],
  ])}${tip('Màu thẻ theo loại việc; chấm màu = trạng thái. Việc quá hạn gom vào nút đỏ trên đầu lịch.')}</div>
  <div class="col-f">${br('crm_cal', 700)}</div></div>` });

slide({ sec: 'ĐIỆN THOẠI', kick: 'CHO SALES ĐI ĐỊA BÀN', acc: '#2F6B4A', title: 'Thanh dưới · Hôm nay · ＋ Ghi nhanh', sub: 'Mọi thao tác chính nằm trong tầm ngón cái', body: `
  <div class="two"><div class="col-t">${steps([
    [1, 'Thanh dưới: <b>Lịch</b> · <b>Khách hàng</b> · <b>Hôm nay</b> · <b>Mở mới</b> · <b>Thêm</b> (mọi chức năng khác, Bảng tin, Màu, FY…).'],
    [2, '<b>Hôm nay</b>: việc trong ngày, quá hạn, sắp đến hạn — số trên nút là việc chưa xong.'],
    [3, 'Nút <b>＋</b> nổi góc phải dưới: thêm Đi địa bàn · Công việc khác · Đề xuất công tác.'],
  ])}${tip('Mở lịch tuần là tự cuộn tới hôm nay; kéo lên để xem ngày đã qua.')}</div>
  <div class="col-f row">${ph('crm_m_cal', 230)}${ph('crm_m_today', 230)}</div></div>` });

slide({ sec: 'ĐI ĐỊA BÀN', kick: 'NGAY TẠI CHỖ', acc: '#0E8A7E', title: 'Chụp ảnh & báo kết quả trong 2 chạm', sub: 'Thẻ đi địa bàn hôm nay (chưa xong) có sẵn 2 nút', body: `
  <div class="two"><div class="col-t">${steps([
    [1, '<b>Chụp ảnh</b> → mở thẳng camera; ảnh tự kèm toạ độ GPS, giờ chụp, nén nhẹ.'],
    [2, '<b>Báo kết quả</b> → form mở sẵn, trạng thái <b>Completed</b>; điền <b>Người gặp</b> (nút CBC), kết quả 4 mục, Next action, Customer feedback.'],
    [3, '<b>Cập nhật vào Sheet</b>: hiện ngay trên app, lưu nền vào Google Sheet (mạng yếu tự gửi lại).'],
  ])}${tip('Task Visiting bắt buộc có ảnh chụp tại chỗ — không chọn ảnh có sẵn.')}</div>
  <div class="col-f row">${ph('crm_m_cal', 230, [0, 0.35, 1, 0.65])}${ph('crm_m_result', 230)}</div></div>` });

slide({ sec: 'THÊM VIỆC', kick: 'GHI NHANH · CÔNG TÁC', acc: '#7A4FD6', title: 'Thêm việc & đề xuất công tác', sub: 'Form mở ngay, không phải chờ', body: `
  <div class="two"><div class="col-t">${steps([
    [1, 'Bấm <b>＋</b> (điện thoại) hoặc <b>＋ Thêm việc</b> (máy tính) → chọn <b>Đi địa bàn</b>, <b>Công việc khác</b> hoặc <b>Đề xuất công tác</b>.'],
    [2, '<b>Đề xuất công tác</b>: ngày đi / về, điểm đến, người đi cùng, mục đích, chi phí dự trù, lịch trình, thiết bị → <b>Gửi đề xuất</b> (ghi vào file Business Trip + email xin duyệt).'],
    [3, 'Chuyến đã duyệt: bấm thẻ công tác ▸ <b>Báo cáo công tác</b> → Key Activities · Key Findings · Follow Up → lưu (tạo Google Doc, chuyến tự Completed).'],
  ])}</div>
  <div class="col-f row">${ph('crm_m_add', 220)}${br('crm_trip', 430, [0.2, 0.05, 0.6, 0.95])}</div></div>` });

slide({ sec: 'KHÁCH HÀNG', acc: '#3A5CAA', title: 'Khách hàng & người liên hệ', sub: 'Tìm nhanh theo tên, mã, tỉnh, PIC — gõ không dấu cũng được', body: `
  <div class="two"><div class="col-t">${steps([
    [1, '<b>Khách hàng</b>: danh sách account, lọc loại KH / khu vực / nhóm ADP, Chưa gặp trong FY, sắp theo doanh số.'],
    [2, 'Bấm 1 account → <b>Hồ sơ 360°</b>: lần gặp, CBC, đơn hàng, doanh số.'],
    [3, '<b>＋ Account mới</b>, <b>Người liên hệ / khách Event</b> (Key stakeholder) thêm ngay trên app.'],
  ])}${tip('Trên điện thoại danh sách hiện dạng thẻ: tên · loại · tỉnh · PIC · số lần làm việc.')}</div>
  <div class="col-f row">${br('crm_cust', 520, [0, 0, 1, 0.85])}${ph('crm_m_cust', 200)}</div></div>` });

slide({ sec: 'MỞ MỚI', kick: 'KPI C1', acc: '#B06A1F', title: 'Mở mới địa bàn & SKU mới', sub: 'Ghi nhận đại lý / SKU mới kèm chứng từ, gửi quản lý xác nhận', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>＋ Thêm case mở mới</b> → chọn account, loại (KH mới / SKU mới), NPP, ngày đơn đầu tiên.'],
    [2, 'Kéo thả chứng từ (ảnh, PDF) → <b>Gửi xác nhận</b> — người duyệt nhận email.'],
    [3, 'Case <b>Đã xác nhận</b> mới được tính KPI C1. Lọc theo tháng / trạng thái ở thanh trên.'],
  ])}${tip('Người duyệt thấy nút <b>case chờ bạn xác nhận</b> ở góc dưới bên trái.')}</div>
  <div class="col-f">${br('crm_newacc', 690)}</div></div>` });

slide({ sec: 'KPI', kick: 'KPI & MỤC TIÊU', acc: '#2E5C8A', title: 'KPI của bạn và của nhóm', sub: 'Theo file MMH KPI FY68 · số liệu chỉ xem', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Chọn kỳ <b>Tháng / Quý / Năm</b>. Thẻ trên cùng: KPI tháng, quý, năm, số KPI đạt.'],
    [2, 'Quản lý: hàng <b>Đang xem KPI của</b> — người đang chọn tô đậm; biểu đồ so sánh đánh dấu ◀ đang xem.'],
    [3, 'Bảng chi tiết: target, actual, % đạt. Doanh số kế toán chưa chốt ghi <b>Chưa chốt</b>.'],
  ])}${tip('Màu theo file KPI: <b>&lt; 90%</b> xám · <b>90–100%</b> xanh · <b>100–120%</b> vàng · <b>&gt; 120%</b> xanh lá. Gửi báo cáo KPI tháng, Setting Expectation ở các nút trên cùng.')}</div>
  <div class="col-f">${br('crm_kpi2', 690)}</div></div>` });

slide({ sec: 'KPI', kick: 'ADMIN · DIRECTOR · QUẢN LÝ', acc: '#2E5C8A', title: 'Total KPI công ty', sub: 'KPI & Mục tiêu ▸ Total KPI công ty', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>Tổng quan</b>: doanh số toàn công ty, điểm 4 góc nhìn, từng mục tiêu chiến lược (bấm để xem KPI liên kết).'],
    [2, '<b>KPI công ty</b>: bấm ▸ để xem KPI con. <b>Thành viên</b>: % từng người theo năm / quý / tháng.'],
    [3, 'Chọn <b>Tháng · Lũy kế · Cả năm</b>; <b>Cách tính KPI</b> theo sheet 4. Rule.'],
  ])}</div>
  <div class="col-f">${br('crm_kt', 690)}</div></div>` });

slide({ sec: 'NHẮC HẠN', kick: 'TỰ HIỆN KHI ĐĂNG NHẬP', acc: '#B04F4B', title: 'Nhắc hạn & thông báo cập nhật', sub: 'Hiện lần lượt, không chồng lên nhau', body: `
  <div class="pair">
    <div>${br('crm_dl', 545, [0.28, 0.12, 0.46, 0.85], 380)}<div class="cap"><b>Hạn chứng từ kế toán</b> (ngày 14, 15, 28, 29 và đúng ngày hạn) · <b>KPI tháng</b> ngày 02 (trước 16:00) · <b>tự đánh giá quý</b> ngày 09 tháng đầu quý (trước 17:00).</div></div>
    <div>${br('crm_upd', 545, [0.18, 0.18, 0.64, 0.66], 380)}<div class="cap"><b>Có gì mới</b>: tự hiện 7 ngày sau mỗi bản cập nhật; bấm nút <b>Có gì mới</b> trên thanh trên cùng để xem lại.</div></div>
  </div>` });

slide({ sec: 'QUẢN LÝ', kick: 'QUYỀN XEM', acc: '#2F6B4A', title: 'Nhóm đang xem · công tác người khác', sub: 'Management đổi nhóm · Team Leader xem nhóm mình · PIC xem việc của mình', body: `
  <div class="two"><div class="col-t">${steps([
    [1, '<b>Nhóm đang xem</b> (menu bên; điện thoại: Thêm ▸ Nhóm đang xem): Dental · Surgical · Eyeless · Thailand Surgical.'],
    [2, 'Lịch chỉ hiện <b>buổi đào tạo</b> bạn là trainer / được mời, và <b>chuyến công tác</b> của bạn.'],
    [3, 'Quản lý bấm <b>Công tác người khác: Đang ẩn</b> trên thanh lọc để bật xem.'],
  ])}</div>
  <div class="col-f row">${br('crm_mgr_cal', 470, [0, 0, 0.62, 0.7])}${ph('crm_m_more_mgr', 200)}</div></div>` });

slide({ sec: 'EMAIL CẬP NHẬT', kick: 'ADMIN · DIRECTOR', acc: '#3A5CAA', title: 'Gửi email thông báo cập nhật', sub: 'Có gì mới ▸ Gửi email cập nhật', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Chọn phiên bản đưa vào email; sửa tiêu đề, lời mở đầu (tiếng Anh).'],
    [2, 'Xem trước đúng bản gửi: ảnh nằm trong thư, HDSD PDF đính kèm.'],
    [3, '<b>Gửi thử cho tôi</b> → kiểm tra hộp thư → <b>Gửi email</b> tới toàn bộ nhân sự dùng CRM.'],
  ])}${tip('Email gửi kiểu tự động (no-reply), tiêu đề “MMH CRM Update – ngày”.')}</div>
  <div class="col-f">${br('crm_upm', 690)}</div></div>` });

slide({ sec: 'HỖ TRỢ', acc: '#3A5CAA', title: 'Cần hỗ trợ?', sub: 'Product Team · MANI Medical Hanoi', body: `
  <ul class="dl" style="font-size:17px">
    <li><b>Mở app</b>: ${a(APP)} — nên thêm vào màn hình chính điện thoại (Chrome ▸ ⋮ ▸ Thêm vào màn hình chính).</li>
    <li><b>Dữ liệu</b> lưu trên Google Sheet của từng nhóm; sửa trên Sheet thì app tự cập nhật sau ít giây.</li>
    <li><b>Mạng yếu</b>: thao tác vẫn hiện ngay, app tự gửi lại khi có mạng (chip trạng thái ở góc dưới).</li>
    <li><b>Góp ý / báo lỗi</b>: liên hệ Product Team (Giang).</li>
  </ul>` });

writeDeck('HDSD MMH CRM v30.3');
