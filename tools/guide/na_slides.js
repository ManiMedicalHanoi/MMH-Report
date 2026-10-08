/* Slide hướng dẫn MỞ MỚI ĐỊA BÀN & SKU MỚI (CRM v30.5) — dùng chung bản VN / EN.
   build_na.js (deck riêng: LANG=vi|en) và newacc_en.js (chèn vào HDSD toàn hệ thống tiếng Anh) gọi module này.
   Ảnh: shots/na_<vi|en>_*.jpg — chụp bằng Playwright với backend giả lập (dữ liệu giả). */
module.exports = function (K, lang, o) {
  o = o || {};
  const { slide, steps, tip, fig, a } = K, EN = lang === 'en', T = (vi, en) => EN ? en : vi, P = 'na_' + lang + '_';
  const br = (img, w, crop, maxH) => fig({ img: P + img, w, frame: 'browser', crop, maxH });
  const ph = (img, w, crop) => fig({ img: P + img, w: w || 240, frame: 'phone', crop });
  const APP = 'https://manimedicalhanoi.github.io/MMH-CRM/';
  const acc = '#B06A1F', sec = T('MỞ MỚI', 'NEW ACCOUNTS');
  if (o.cover) slide({ bare: true, cls: 'cover', body: `
    <div class="cv-l">
      <div class="cv-tag">${T('HƯỚNG DẪN CẬP NHẬT · MMH CRM v30.5', 'UPDATE GUIDE · MMH CRM v30.5')}</div>
      <h1>${T('Mở mới địa bàn &amp; SKU mới', 'New accounts &amp; new SKUs')}<br><span>${T('Ghi nhận · quản lý xác nhận · tính KPI', 'Record · manager approval · KPI')}</span></h1>
      <p class="cv-p">${T('Cách sales điền thông tin khách hàng / SKU mới kèm bằng chứng, và cách quản lý trực tiếp / Director xem — xác nhận — trả lại bổ sung ngay trên CRM. Case đã xác nhận được tính KPI mở mới.',
        'How sales record a new account / new SKU with evidence, and how line managers / the Director review, approve or return it right in the CRM. Approved cases count for the new-account KPI.')}</p>
      <div class="cv-chips"><span>🏪 ${T('Khách hàng mới', 'New account')}</span><span>📦 ${T('SKU mới', 'New SKU')}</span><span>✅ ${T('Quản lý xác nhận', 'Manager approval')}</span><span>📊 KPI</span></div>
      <div class="cv-link">${T('Mở app', 'Open the app')}: ${a(APP)}</div>
      <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
    </div>
    <div class="cv-r">${br('review_page', 760, [0, 0, 1, 0.8])}</div>` });

  slide({ sec, kick: T('THEO FILE MMH KPI FY68', 'FROM THE MMH KPI FY68 FILE'), acc, title: T('KPI mở mới của từng nhóm', 'New-account KPIs by team'), sub: T('Sheet 4. Rule · 5. Member KPI Monthly', 'Sheets 4. Rule · 5. Member KPI Monthly'), body: `
    <div class="two"><div class="col-t">
      <table style="width:100%;border-collapse:collapse;font-size:16px;margin-bottom:12px"><tr style="text-align:left;color:#6B7B8C;font-size:13px"><th style="padding:6px 10px;border-bottom:1px solid #E6EAEF">KPI</th><th style="padding:6px 10px;border-bottom:1px solid #E6EAEF">PIC</th><th style="padding:6px 10px;border-bottom:1px solid #E6EAEF">${T('Nhóm · khu vực', 'Team · area')}</th></tr>
        <tr><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5"><b>C1-01</b></td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Viet</td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Dental VN · ${T('Bắc', 'North')}</td></tr>
        <tr><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5"><b>C1-02</b></td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Vinh</td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Dental VN · ${T('Trung', 'Central')}</td></tr>
        <tr><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5"><b>C1-03</b></td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Phuong</td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Dental VN · ${T('Nam', 'South')}</td></tr>
        <tr><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5"><b>C1-04</b></td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Viet Ha</td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Surgical VN · ${T('Bắc', 'North')}</td></tr>
        <tr><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5"><b>C1-05</b></td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Khang</td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Surgical VN · ${T('Nam', 'South')}</td></tr>
        <tr><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5"><b>C2-03</b></td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Miew</td><td style="padding:6px 10px;border-bottom:1px solid #F0F2F5">Surgical Thailand · Manipler</td></tr></table>
      ${tip(T('Đếm <b>khách hàng / đại lý mới</b> (đơn MANI đầu tiên qua NPP trong FY68, do sale rep mở) và <b>SKU mới</b> (khách đặt một mã SKU lần đầu). Chỉ tính vào <b>tháng phát sinh đầu tiên</b>, tối đa 130%.',
        'Counts <b>new accounts / dealers</b> (first MANI order via the distributor in FY68, opened by the sales rep) and <b>new SKUs</b> (an account ordering a SKU for the first time). Counted only in the <b>month it first happens</b>, max 130%.'))}
    </div><div class="col-t">
      <h3 style="margin:0 0 8px;font-size:18px;color:#1F3347">${T('Cần đủ 4 điều kiện', 'All 4 conditions are required')}</h3>
      ${steps([
        [1, T('Lịch sử chăm sóc, làm việc với khách trên <b>báo cáo tuần</b>.', 'Care / work history with the account in the <b>weekly report</b>.')],
        [2, T('<b>Xác nhận của nhà phân phối</b> (ảnh email / tin nhắn NPP).', '<b>Distributor confirmation</b> (screenshot of the distributor e-mail / message).')],
        [3, T('Thông tin khách hàng / SKU mới <b>đúng format</b>.', 'New account / SKU information in the <b>required format</b>.')],
        [4, T('Thông tin <b>đơn hàng đầu tiên</b> qua NPP (PO, hoá đơn, phiếu xuất).', 'Details of the <b>first order</b> via the distributor (PO, invoice, delivery note).')],
      ])}${tip(T('CRM tự đối chiếu 4 điều kiện này trên mỗi case để quản lý duyệt nhanh.', 'The CRM checks these 4 conditions on every case so managers can review quickly.'))}
    </div></div>` });

  slide({ sec, kick: T('MÀN HÌNH MỚI', 'NEW LAYOUT'), acc, title: T('Tab Mở mới gọn hơn', 'A cleaner New accounts tab'), sub: T('Menu Mở mới &amp; SKU mới (điện thoại: nút Mở mới ở thanh dưới)', 'Menu New account &amp; SKU (phone: New accounts in the bottom bar)'), body: `
    <div class="two w3"><div class="col-t">${steps([
      [1, T('<b>Thẻ KPI</b> theo PIC: số case đã xác nhận / target FY, % và số case chờ duyệt — bấm để lọc theo người.', '<b>KPI cards</b> per PIC: approved cases / FY target, % and cases pending — click to filter by person.')],
      [2, T('<b>Một dòng lọc</b>: Tất cả · Cần tôi duyệt · Chờ duyệt · Cần bổ sung · Nháp · Đã xác nhận · Từ chối, cùng ô chọn PIC và tháng.', '<b>One filter bar</b>: All · To review · Pending · Changes requested · Draft · Approved · Rejected, plus PIC and month selectors.')],
      [3, T('Danh sách gọn: ảnh bằng chứng, khách hàng, loại, NPP, tháng KPI, trạng thái. Bấm để mở chi tiết.', 'Compact list: evidence thumbnail, account, type, distributor, KPI month, status. Click to open.')],
    ])}</div><div class="col-f">${br('sales_page', 690)}</div></div>` });

  slide({ sec, kick: T('SALES · BƯỚC 1', 'SALES · STEP 1'), acc, title: T('Thêm case mở mới', 'Add a new-account case'), sub: T('Nút ＋ Thêm case', 'Button ＋ Add a case'), body: `
    <div class="two w3"><div class="col-t">${steps([
      [1, T('Chọn <b>Đại lý / khách hàng mới</b> hoặc <b>SKU mới</b>.', 'Choose <b>New account</b> or <b>New SKU</b>.')],
      [2, T('Chọn <b>Account</b> trong danh mục khách hàng (chưa có thì thêm ở tab Khách hàng) và <b>nhà phân phối</b>.', 'Pick the <b>account</b> from the customer list (add it in Customers first if missing) and the <b>distributor</b>.')],
      [3, T('Nhập <b>ngày NPP xác nhận / đơn đầu tiên</b> — tháng của ngày này là tháng tính KPI; SKU mới: ghi mã SKU.', 'Enter the <b>distributor confirmation / first order date</b> — its month is the KPI month; for a new SKU, enter the SKU code.')],
    ])}${tip(T('Ô vàng cuối form cho biết còn thiếu gì trước khi gửi. Có thể <b>Lưu nháp</b> và làm tiếp sau.', 'The yellow bar at the bottom shows what is still missing. You can <b>Save draft</b> and continue later.'))}</div>
    <div class="col-f">${br('sales_form', 690)}</div></div>` });

  slide({ sec, kick: T('SALES · BƯỚC 2', 'SALES · STEP 2'), acc, title: T('Bằng chứng &amp; gửi xin xác nhận', 'Evidence &amp; send for approval'), sub: T('Kéo thả file · tick 3 cam kết · Lưu &amp; gửi', 'Drop files · tick the 3 confirmations · Save &amp; send'), body: `
    <div class="two w3"><div class="col-t">${steps([
      [1, T('<b>Kéo thả / dán (Ctrl+V)</b> ảnh chụp email NPP xác nhận (bắt buộc), PO / hoá đơn / phiếu xuất, thông báo trúng thầu… và gắn loại cho từng file.', '<b>Drop / paste (Ctrl+V)</b> the distributor confirmation screenshot (required), PO / invoice / delivery note, tender award… and tag each file.')],
      [2, T('Tick <b>3 cam kết</b> theo quy định KPI.', 'Tick the <b>3 confirmations</b> required by the KPI rule.')],
      [3, T('<b>Lưu &amp; gửi email xin xác nhận</b> → quản lý trực tiếp nhận email kèm bằng chứng; case chuyển <b>Chờ duyệt</b>.', '<b>Save &amp; send for approval</b> → your line manager receives an e-mail with the evidence; the case becomes <b>Pending</b>.')],
    ])}</div><div class="col-f">${br('sales_form2', 690)}</div></div>` });

  slide({ sec, kick: T('QUẢN LÝ · DIRECTOR', 'MANAGER · DIRECTOR'), acc: '#2F6B4A', title: T('Xem case cần duyệt', 'Review pending cases'), sub: T('Email “Xin xác nhận” ▸ Mở CRM · hoặc tab Mở mới ▸ Cần tôi duyệt', 'E-mail “Approval request” ▸ Open the CRM · or New accounts ▸ To review'), body: `
    <div class="two w3"><div class="col-t">${steps([
      [1, T('Khung cam <b>“case đang chờ bạn xác nhận”</b> ▸ <b>Duyệt ngay</b> (hoặc nút tròn ở góc dưới).', 'The orange <b>“cases waiting for your approval”</b> box ▸ <b>Review now</b> (or the round button at the bottom).')],
      [2, T('Mỗi case mở ngay: <b>các bước</b>, thông tin sales gửi, <b>4 điều kiện KPI</b> (✓ / !) tự đối chiếu.', 'Each case opens with the <b>steps</b>, what the sales rep sent and the <b>4 KPI conditions</b> (✓ / !) checked automatically.')],
      [3, T('<b>Bằng chứng hiện lớn</b> ngay bên phải; bấm ảnh nhỏ để chuyển, bấm ảnh lớn để phóng to; PDF xem trực tiếp.', '<b>Evidence shown large</b> on the right; click a thumbnail to switch, click the large view to zoom; PDFs open inline.')],
    ])}</div><div class="col-f">${br('review_modal', 700)}</div></div>` });

  slide({ sec, kick: T('QUẢN LÝ · QUYẾT ĐỊNH', 'MANAGER · DECISION'), acc: '#2F6B4A', title: T('Xác nhận · Trả lại bổ sung · Từ chối', 'Approve · Return for changes · Reject'), sub: T('3 nút ở chân hộp — luôn nhìn thấy', '3 buttons at the bottom — always visible'), body: `
    <div class="two w3"><div class="col-t">${steps([
      [1, T('<b>Xác nhận</b> → case được tính KPI tháng của case; email báo PIC, Director, kế toán.', '<b>Approve</b> → the case counts for KPI in its month; the PIC, Director and accounting are e-mailed.')],
      [2, T('<b>Trả lại bổ sung</b> (ghi rõ cần thêm gì) → case về Nháp, <b>giữ nguyên bằng chứng</b>; sales sửa rồi gửi lại.', '<b>Return for changes</b> (say what is missing) → back to Draft, <b>evidence kept</b>; the rep completes and resends.')],
      [3, T('<b>Từ chối</b> (bắt buộc lý do) → bằng chứng bị xoá, case không được tính.', '<b>Reject</b> (reason required) → evidence deleted, the case does not count.')],
    ])}${tip(T('Duyệt xong, app tự mở case chờ duyệt tiếp theo; ‹ › để chuyển qua lại.', 'After each decision the next pending case opens automatically; use ‹ › to move between cases.'))}</div>
    <div class="col-f">${br('review_cm', 700)}</div></div>` });

  slide({ sec, kick: T('SALES · KHI BỊ TRẢ LẠI', 'SALES · WHEN RETURNED'), acc, title: T('Bổ sung rồi gửi lại', 'Complete it and send again'), sub: T('Tab Mở mới ▸ Cần bổ sung', 'New accounts ▸ Changes requested'), body: `
    <div class="two w3"><div class="col-t">${steps([
      [1, T('Nhận email <b>“Cần bổ sung”</b>; trên CRM case có nhãn cam <b>Cần bổ sung</b>.', 'You receive a <b>“Changes requested”</b> e-mail; in the CRM the case shows an orange <b>Changes requested</b> label.')],
      [2, T('Mở case: khung vàng ghi rõ <b>quản lý yêu cầu gì</b>; danh sách 4 điều kiện cho thấy mục còn thiếu (!).', 'Open the case: the yellow box shows <b>what the manager asked for</b>; the 4-condition list shows what is missing (!).')],
      [3, T('<b>Sửa</b> → bổ sung file / thông tin → <b>Gửi lại xin xác nhận</b>.', '<b>Edit</b> → add the files / information → <b>Send for approval again</b>.')],
    ])}</div><div class="col-f">${br('sales_ret', 690)}</div></div>` });

  if (o.mobile !== false) slide({ sec, kick: T('ĐIỆN THOẠI', 'MOBILE'), acc, title: T('Duyệt ngay trên điện thoại', 'Approve on your phone'), sub: T('Cùng thao tác, bố cục 1 cột', 'Same steps, one-column layout'), body: `
    <div class="two"><div class="col-t">${steps([
      [1, T('Thanh dưới ▸ <b>Mở mới</b>. Dải trạng thái cuộn ngang; chọn PIC / tháng bên dưới.', 'Bottom bar ▸ <b>New accounts</b>. The status bar scrolls sideways; PIC / month below.')],
      [2, T('Mở case: thông tin + 4 điều kiện, kéo xuống xem bằng chứng.', 'Open a case: information + 4 conditions; scroll for the evidence.')],
      [3, T('Nút <b>Xác nhận</b> / <b>Trả lại bổ sung</b> / <b>Từ chối</b> luôn ở cuối màn hình.', '<b>Approve</b> / <b>Return for changes</b> / <b>Reject</b> stay at the bottom of the screen.')],
    ])}</div><div class="col-f row">${ph('mob_page', 230)}${ph('mob_modal', 230)}</div></div>` });

  if (o.end) slide({ sec: T('TÓM TẮT', 'SUMMARY'), acc, title: T('Luồng mở mới trong 1 trang', 'The whole flow on one page'), sub: T('Ai làm gì · khi nào được tính KPI', 'Who does what · when it counts for KPI'), body: `
    <ul class="dl" style="font-size:17px">
      <li><b>1 · Sales</b> — ${T('＋ Thêm case → khách hàng / SKU mới, NPP, ngày đơn đầu tiên → bằng chứng (xác nhận NPP bắt buộc) → Lưu &amp; gửi.', '＋ Add a case → new account / SKU, distributor, first order date → evidence (distributor confirmation required) → Save &amp; send.')}</li>
      <li><b>2 · ${T('Quản lý trực tiếp / Director', 'Line manager / Director')}</b> — ${T('email hoặc tab Mở mới ▸ Cần tôi duyệt → xem thông tin, 4 điều kiện, bằng chứng → Xác nhận / Trả lại bổ sung / Từ chối.', 'e-mail or New accounts ▸ To review → check the information, 4 conditions and evidence → Approve / Return / Reject.')}</li>
      <li><b>3 · KPI</b> — ${T('case <b>Đã xác nhận</b> tự cộng vào KPI mở mới (C1-01…C1-05, C2-03) của tháng phát sinh đầu tiên; tab KPI cập nhật trong ít phút.', '<b>Approved</b> cases are added to the new-account KPI (C1-01…C1-05, C2-03) of the month they first happen; the KPI tab updates within minutes.')}</li>
      <li><b>${T('Cần hỗ trợ', 'Help')}</b> — ${T('Product Team (Giang). Quy định đầy đủ: nút <b>Quy định KPI</b> trong tab Mở mới.', 'Product Team (Giang). Full rules: the <b>KPI rules</b> button in the New accounts tab.')}</li>
    </ul>` });
};
