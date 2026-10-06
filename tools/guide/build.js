/* HDSD MMH Calendar v15.2 — nội dung slide. Khung / hàm dựng: deckkit.js */
const { fs, DIR, J, esc, L, a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v15.2';
/* ═════════ 1. COVER ═════════ */
slide({
  bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">THÔNG BÁO CẬP NHẬT · REPORT HUB v15</div>
    <h1>MMH Calendar<br><span>Công tác · Đào tạo · Sự kiện · Bài đăng</span></h1>
    <p class="cv-p">Một lịch chung cho cả công ty — đề xuất &amp; báo cáo công tác, tạo buổi đào tạo, gửi thư mời, chia sẻ tài liệu, nhắc việc tự động. Dữ liệu lấy trực tiếp từ các file Google Sheet đang dùng.</p>
    <div class="cv-chips"><span>🧳 Business Trip</span><span>🎓 Training Hub</span><span>🎪 Marketing Offline</span><span>📣 Digital Marketing</span></div>
    <div class="cv-link">Mở app: ${a(L.app)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
  </div>
  <div class="cv-r">${fig({ img: 'calmonth', w: 760, frame: 'browser', map: {} })}</div>`
});

/* ═════════ 2. NỘI DUNG ═════════ */
const card = (ic, t, d, c) => `<div class="ov" style="--c:${c}"><div class="ic">${ic}</div><h4>${t}</h4><p>${d}</p></div>`;
slide({
  sec: 'TỔNG QUAN', title: 'Có gì mới trong bản cập nhật', sub: 'Mỗi phần dưới đây có hướng dẫn từng bước với ảnh chụp màn hình thật ở các trang sau', body: `
  <div class="ovg">
    ${card('📅', 'MMH Calendar', 'Lịch chung: công tác, đào tạo, sự kiện offline, bài đăng online. Bộ lọc, 3 chế độ xem, tìm kiếm, chạy tốt trên điện thoại. <i>Trang 4–7</i>', '#1F3A52')}
    ${card('🎓', 'Đào tạo', 'Team Leader / Manager / Director tạo buổi ngay trên lịch, gửi thư mời theo nhóm hoặc từng người, thư mục tài liệu tự tạo. <i>Trang 8–11</i>', '#8a71b6')}
    ${card('📚', 'Tài liệu cho mọi người', 'Kéo thả để tải tài liệu vào thư mục buổi học. Ai cũng 👁 Xem và ⬇️ Tải về được. <i>Trang 10–11</i>', '#6F5AA0')}
    ${card('🧳', 'Công tác', 'Đề xuất chuyến đi, xem chi tiết &amp; toàn bộ nội dung báo cáo, PIC cập nhật báo cáo ngay trên lịch. <i>Trang 12–14</i>', '#3E8E6B')}
    ${card('📮', 'Thư nhắc việc', 'Mỗi lần đăng nhập: nhắc báo cáo công tác quá 3 ngày, thư mục đào tạo còn trống quá 1 ngày. <i>Trang 6</i>', '#C0504D')}
    ${card('🔐', 'Phân quyền rõ ràng', 'Ai cũng xem được. Chỉ PIC sửa chuyến của mình; chỉ người tạo / trainer sửa buổi đào tạo của mình. <i>Trang 16</i>', '#D9981F')}
  </div>`
});

/* ═════════ 3. KẾT NỐI DỮ LIỆU ═════════ */
const src = (ic, c, name, what, links, rw) => `<div class="src" style="--c:${c}"><div class="src-h"><span class="ic">${ic}</span><div><h4>${name}</h4><span class="rw ${rw === 'Đọc + ghi' ? 'w' : ''}">${rw}</span></div></div><p>${what}</p><div class="src-l">${links}</div></div>`;
slide({
  sec: 'KẾT NỐI DỮ LIỆU', title: 'Report Hub lấy dữ liệu từ đâu?', sub: 'Không nhập lại: mọi thứ đọc/ghi thẳng vào các file Google đang dùng (bấm vào link để mở file gốc)', body: `
  <div class="net">
    <div class="net-c">
      <div class="hub"><div class="hub-ic">📅</div><h3>MMH Report Hub</h3><p>MMH Calendar · Lịch làm việc</p>${a(L.app, 'manimedicalhanoi.github.io/MMH-Report')}</div>
      <div class="sync">⟳ Lịch tự làm mới (dữ liệu nguồn ≤ 15 phút) · thao tác tạo / gửi / báo cáo trên app hiện <b>ngay lập tức</b> · bấm <b>↻ Làm mới</b> để tải tức thì</div>
    </div>
    <div class="net-g">
      ${src('🎓', '#8a71b6', 'Training Hub', 'Buổi đào tạo (sheet <b>Training Report</b>), thư mời email, thư mục tài liệu trên Google Drive.', `${a(L.trnSheet, '📗 MMH - Training Master')}<br>${a(L.hub, '🌐 Training Hub (web)')}`, 'Đọc + ghi')}
      ${src('🧳', '#3E8E6B', 'Business Trip', 'Đề xuất công tác, trạng thái duyệt, báo cáo công tác (sheet <b>MMH Travel report</b>), email xin duyệt / báo cáo.', a(L.trip, '📗 Vietnam - Business trip Approval and Report'), 'Đọc + ghi')}
      ${src('🎪', '#9B4F7E', 'Marketing Offline FY68', 'Sự kiện offline: workshop, seminar, exhibition, webinar — ngày, KOL, địa điểm, trạng thái chốt.', a(L.off, '📗 2. Vietnam - Marketing Offline FY68'), 'Đọc')}
      ${src('📣', '#4E7CAF', 'Digital Marketing &amp; Design FY68', 'Bài đăng online: bài sự kiện, bài sản phẩm, page, format, ngày on-air, bài Design.', a(L.on, '📗 3. Vietnam - Digital Marketing &amp; Design FY68'), 'Đọc')}
    </div>
  </div>`
});

/* ═════════ 4. MỞ MMH CALENDAR ═════════ */
slide({
  sec: 'BẮT ĐẦU', title: 'Mở MMH Calendar từ màn hình chính', sub: 'Đăng nhập Report Hub như bình thường — các nút mới nằm ngay trên thanh công cụ', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, '<b>📅 MMH Calendar</b> — mở lịch chung. Số đỏ trên nút = số việc bạn cần hoàn thành (báo cáo công tác, tài liệu đào tạo).'],
    [2, '<b>✈️ Đề xuất công tác</b> — tạo đề xuất ngay từ Lịch làm việc (hoặc nhấp đúp vào một ngày → chọn Đề xuất công tác).'],
    [3, '<b>Nút bật/tắt lớp lịch</b>: ✈️ Công tác, 🎓 Đào tạo hiện thẳng trên Lịch làm việc của bạn. Đào tạo luôn bật; Công tác mặc định ẩn — bấm để bật.'],
  ])}
    ${tip('💡 Không thấy các nút mới? Nhấn <b>Ctrl + F5</b> (Mac: <b>Cmd + Shift + R</b>) và kiểm tra số phiên bản cạnh chữ <b>MMH Report</b> là <b>v15.2</b>.')}</div>
    <div class="col-f">${fig({ img: 'main', w: 780, frame: 'browser' })}</div>
  </div>`
});

/* ═════════ 5. TỔNG QUAN LỊCH ═════════ */
slide({
  sec: 'MMH CALENDAR', title: 'Toàn cảnh MMH Calendar', sub: 'Mỗi loại một màu — bấm vào bất kỳ mục nào để xem chi tiết ở bảng bên phải', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, '<b>Tháng · Tuần · Danh sách</b> — đổi kiểu xem; ‹ › chuyển kỳ, <b>Hôm nay</b> quay về hiện tại.'],
    [2, '<b>Hiển thị</b> — bật/tắt từng loại: 🧳 Công tác, 🎓 Đào tạo, 🎪 Sự kiện offline, 📸 Bài sự kiện, 🦷 Bài sản phẩm; lọc theo Page, chỉ bài Design, Trạng thái, Người.'],
    [3, '<b>🔔 Việc cần làm</b> — số việc chưa xong / quá hạn của bạn; bấm để mở thư nhắc việc.'],
    [4, '<b>＋ Tạo mới</b> — đề xuất công tác hoặc tạo kế hoạch đào tạo (hoặc nhấp đúp vào ngày).'],
    [5, '<b>Thẻ số liệu</b> — tổng hợp theo kỳ đang xem và theo bộ lọc: số chuyến, ngày-người, chi phí dự tính, số buổi, số sự kiện, bài on-air…'],
  ])}</div>
    <div class="col-f">${fig({ img: 'calmonth', w: 790, frame: 'browser', pos: { 2: 'r' } })}</div>
  </div>`
});

/* ═════════ 6. THƯ NHẮC VIỆC ═════════ */
slide({
  sec: 'NHẮC VIỆC', acc: '#C0504D', title: 'Thư nhắc việc mỗi lần đăng nhập', sub: 'Hệ thống tự kiểm tra — thư hiện mỗi lần vào app cho tới khi bạn hoàn thành', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, '<b>Lời nhắc theo tên bạn</b>: tổng số việc và số việc đã quá hạn.'],
    [2, '<b>🧳 Báo cáo công tác chưa nộp</b> — chuyến <b>Approved</b> đã kết thúc. Hạn: <b>3 ngày</b> sau ngày về. Bấm <b>📋 Cập nhật báo cáo</b> để mở đúng chuyến.'],
    [3, '<b>📚 Thư mục đào tạo còn trống</b> — buổi bạn là người tạo / trainer đã diễn ra nhưng chưa có tài liệu. Hạn: <b>1 ngày</b> sau buổi học. Bấm <b>⬆️ Tải tài liệu</b>.'],
    [4, '<b>Mở MMH Calendar</b> để xử lý, hoặc <b>Để sau</b> (lần đăng nhập sau thư lại hiện).'],
  ])}
    ${tip('🔔 Trong MMH Calendar, nút chuông đỏ <b>“🔔 2 · 1 quá hạn”</b> luôn hiện số việc còn lại — bấm để mở lại thư bất cứ lúc nào.', 'red')}</div>
    <div class="col-f">${fig({ img: 'letter', w: 790, maxH: 520, frame: 'browser', crop: [0.26, 0.2, 0.48, 0.6] })}</div>
  </div>`
});

/* ═════════ 7. XEM TUẦN / DANH SÁCH / ĐIỆN THOẠI ═════════ */
slide({
  sec: 'MMH CALENDAR', title: 'Xem theo tuần, danh sách và trên điện thoại', sub: 'Cùng dữ liệu, cùng bộ lọc — chọn kiểu xem phù hợp với bạn', body: `
  <div class="three">
    <div class="c3a">${fig({ img: 'calweek', w: 620, frame: 'browser' })}
      <div class="cap"><b>▥ Tuần</b> — thẻ chi tiết từng ngày: điểm đến, trainer, giờ học, trạng thái. Nhấp đúp vào ngày để tạo mới. <b>☰ Danh sách</b> gom theo ngày, kèm mục <b>📌 Chưa chốt ngày</b> trong tháng.</div>
      ${tip('📱 Trên điện thoại: bấm <b>☰ Bộ lọc</b> để mở cột Hiển thị / Trạng thái / Người; bảng chi tiết mở toàn màn hình.')}</div>
    <div class="c3b">${fig({ img: 'phone', w: 232, frame: 'phone' })}<div class="cap c">📱 Danh sách trên điện thoại</div></div>
    <div class="c3b">${fig({ img: 'phone2', w: 232, frame: 'phone' })}<div class="cap c">📱 Chi tiết buổi đào tạo</div></div>
  </div>`
});

/* ═════════ 8. ĐÀO TẠO 1 — TẠO BUỔI ═════════ */
slide({
  sec: 'ĐÀO TẠO', kick: 'BƯỚC 1 / 4', acc: '#8a71b6', title: 'Tạo buổi đào tạo ngay trên lịch', sub: 'Dành cho Team Leader / Manager / Director — ghi thẳng vào Training Hub (sheet Training Report, trạng thái Plan)', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, '<b>Nhấp đúp vào ngày</b> trên MMH Calendar (hoặc bấm <b>＋ Tạo mới</b>).'],
    [2, 'Chọn <b>🎓 Tạo kế hoạch đào tạo</b>. (<b>✈️ Đề xuất công tác</b> cũng nằm ở đây.)'],
    [3, 'Điền <b>Chủ đề</b>, Mục tiêu, Ngày &amp; giờ, Nhóm chủ đề, Hình thức, <b>Trainer</b>.'],
    [4, '<b>Đối tượng tham dự</b>: chọn cả <b>nhóm</b> (Sales team, Marketing team…) và/hoặc <b>từng người</b> — app tự đếm số người.'],
    [5, 'Bấm <b>Lưu &amp; soạn email mời →</b> (hoặc <b>Lưu buổi đào tạo</b> để gửi thư mời sau). Buổi học hiện ngay trên lịch màu tím 🟪.'],
  ])}</div>
    <div class="col-f row">
      ${fig({ img: 'newmenu', w: 330, frame: 'card', crop: [0.39, 0.56, 0.27, 0.38], map: { 1: 1, 3: 2 }, pos: { 3: 'tr' } })}
      ${fig({ img: 'trnform', w: 420, frame: 'card', maxH: 560, map: { 1: 3, 3: 3, 4: 4, 5: 5 } })}
    </div>
  </div>`
});

/* ═════════ 9. ĐÀO TẠO 2 — THƯ MỜI ═════════ */
slide({
  sec: 'ĐÀO TẠO', kick: 'BƯỚC 2 / 4', acc: '#8a71b6', title: 'Gửi thư mời — thư mục tài liệu tự tạo', sub: 'Gửi bằng chính tài khoản email của bạn, người nhận trả lời về hộp thư của bạn', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, '<b>Gửi tới</b>: tự lấy từ Đối tượng tham dự. Thêm/bớt <b>nhóm</b> hoặc <b>từng người</b>; thêm người <b>CC</b> nếu cần.'],
    [2, 'Tick <b>Gửi bản CC cho tôi</b> để lưu lại thư. Tiêu đề để trống = mẫu chuẩn <i>[MMH Training] Thư mời đào tạo — …</i>; thêm <b>Lời nhắn</b> nếu muốn.'],
    [3, 'Bấm <b>📨 Gửi email</b>. Hệ thống: ① tạo <b>thư mục tài liệu</b> trên Drive, ② ghi link vào Training Hub, ③ gửi thư kèm dòng <i>“Vui lòng truy cập và tham khảo tài liệu đào tạo tại đây”</i> (hyperlink tới thư mục).'],
  ])}
    ${tip('👁 <b>Xem trước</b> nội dung thư trước khi gửi · <b>Soạn bằng Gmail</b> nếu muốn tự chỉnh thư · <b>Để sau</b>: mở buổi trên lịch, bấm <b>✉️ Gửi thư mời</b> bất cứ lúc nào (gửi lại cũng được).', 'pur')}</div>
    <div class="col-f">${fig({ img: 'trncompose', w: 520, frame: 'card', maxH: 575 })}</div>
  </div>`
});

/* ═════════ 10. ĐÀO TẠO 3 — TẢI TÀI LIỆU ═════════ */
slide({
  sec: 'ĐÀO TẠO', kick: 'BƯỚC 3 / 4', acc: '#8a71b6', title: 'Kéo thả tài liệu vào thư mục buổi học', sub: 'Người tạo / trainer của buổi: mở buổi trên lịch → bảng chi tiết bên phải', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, '<b>Thao tác của chủ buổi</b>: ✉️ Gửi (lại) thư mời · ✏️ Sửa buổi đào tạo · ↻ tải lại danh sách tài liệu.'],
    [2, '<b>Kéo thả file</b> vào khung nét đứt (hoặc bấm để chọn nhiều file). File tải thẳng vào thư mục của buổi, có thanh % — file lớn tự chia nhỏ, mạng chập chờn vẫn tải tiếp được.'],
    [3, 'File xuất hiện ngay trong danh sách, kèm nút <b>👁 Xem</b> / <b>⬇️ Tải về</b>.'],
  ])}
    ${tip('⏰ Tải tài liệu trong vòng <b>1 ngày</b> sau buổi học — nếu thư mục còn trống, hệ thống nhắc mỗi lần đăng nhập.', 'red')}
    ${tip('Chưa có thư mục? Tải file lên lần đầu, hệ thống <b>tự tạo thư mục</b> và ghi link vào Training Hub.')}</div>
    <div class="col-f">${fig({ img: 'trnowner', w: 640, frame: 'browser', crop: [0.385, 0, 0.615, 0.84] })}</div>
  </div>`
});

/* ═════════ 11. ĐÀO TẠO 4 — MỌI NGƯỜI XEM / TẢI ═════════ */
slide({
  sec: 'ĐÀO TẠO', kick: 'BƯỚC 4 / 4', acc: '#8a71b6', title: 'Mọi người xem &amp; tải tài liệu', sub: 'Ai cũng mở được mọi buổi đào tạo trên lịch — chỉ không sửa được buổi của người khác', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, 'Buổi của người khác hiện ghi chú <b>“chỉ xem”</b>: không sửa, không gửi thư mời, không thêm tài liệu.'],
    [2, '<b>👁 Xem</b> — xem trước trên Google Drive (Slide, PDF, Doc, video…).'],
    [3, '<b>⬇️ Tải về</b> máy. Google Docs / Slides / Sheets tự chuyển thành <b>.docx / .pptx / .xlsx</b>. (Google Form chỉ có nút Xem.)'],
  ])}
    ${tip('🔓 Thư mục tài liệu được <b>tự chia sẻ</b> cho mọi tài khoản <b>@manimedicalhanoi.com</b> (quyền xem). Đăng nhập Google bằng email công ty để mở file.')}</div>
    <div class="col-f">${fig({ img: 'trnviewer', w: 640, frame: 'browser', crop: [0.385, 0, 0.615, 0.72] })}</div>
  </div>`
});

/* ═════════ 12. CÔNG TÁC 1 — ĐỀ XUẤT ═════════ */
slide({
  sec: 'CÔNG TÁC', kick: 'BƯỚC 1 / 3', acc: '#3E8E6B', title: 'Đề xuất công tác', sub: 'Ghi thẳng vào file Business Trip (Approval Status = Not Yet) và gửi email xin duyệt', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, 'Mở form: nút <b>✈️ Đề xuất công tác</b> trên Lịch làm việc, hoặc <b>nhấp đúp ngày</b> trên MMH Calendar → <b>Đề xuất công tác</b>. Chọn <b>ngày đi / ngày về</b> — số ngày tự tính.'],
    [2, '<b>Điểm đến</b> (chọn nhiều tỉnh) và <b>Người đi cùng</b> (gõ để tìm).'],
    [3, '<b>Mục đích</b>, <b>Kết quả mong đợi</b>, <b>Lịch trình</b>.'],
    [4, '<b>Chi phí dự tính</b>: mỗi dòng một khoản — tổng tự cộng. Chọn <b>thiết bị</b> mang theo.'],
    [5, '<b>📨 Gửi đề xuất</b> → email xin duyệt gửi Director (CC HOD). Quản lý duyệt bằng <b>HOD Menu</b> trên Google Sheet như trước. Chuyến hiện ngay trên lịch: 🕓 Chờ duyệt → ✅ Đã duyệt.'],
  ])}</div>
    <div class="col-f">${fig({ img: 'tripprop', w: 470, frame: 'card', maxH: 585 })}</div>
  </div>`
});

/* ═════════ 13. CÔNG TÁC 2 — XEM CHUYẾN & BÁO CÁO ═════════ */
slide({
  sec: 'CÔNG TÁC', kick: 'BƯỚC 2 / 3', acc: '#3E8E6B', title: 'Xem chuyến đi và toàn bộ báo cáo', sub: 'Bấm vào bất kỳ chuyến nào trên lịch — mọi người đều xem được kế hoạch và nội dung báo cáo', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, '<b>📋 Cập nhật báo cáo công tác</b> — chỉ hiện với <b>PIC của chuyến</b> (chuyến của bạn). Chuyến chưa duyệt: <b>✏️ Xem / sửa đề xuất</b>.'],
    [2, '<b>Thông tin chuyến</b>: trạng thái, người đi, đi cùng, điểm đến, mục đích, kết quả mong đợi, lịch trình, chi phí, thiết bị, folder chuyến đi.'],
    [3, '<b>Báo cáo công tác</b> hiện <b>đầy đủ nội dung</b>: I. Key Activities · II. Key Findings · III. Follow Up Actions, kèm ngày nộp.'],
  ])}
    <div class="legend"><span><i style="background:#FFF4DB"></i>🕓 Chờ duyệt</span><span><i style="background:#E6F3EC"></i>✅ Đã duyệt</span><span><i style="background:#FFF4DB"></i>📝 Đã đi · chờ báo cáo</span><span><i style="background:#E6F3EC"></i>✅ Hoàn thành · đã báo cáo</span></div></div>
    <div class="col-f">${fig({ img: 'tripdrawer', w: 640, maxH: 520, frame: 'browser', crop: [0.385, 0, 0.615, 0.98] })}</div>
  </div>`
});

/* ═════════ 14. CÔNG TÁC 3 — CẬP NHẬT BÁO CÁO ═════════ */
slide({
  sec: 'CÔNG TÁC', kick: 'BƯỚC 3 / 3', acc: '#3E8E6B', title: 'PIC cập nhật báo cáo công tác', sub: 'Trong vòng 3 ngày sau ngày về — ngay trên lịch, không cần mở file Business Trip', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, 'Kiểm tra lại thông tin chuyến đã được duyệt (<b>✓ Approved</b>).'],
    [2, 'Điền 3 phần: <b>Key Activities</b>, <b>Key Findings</b>, <b>Follow Up Actions</b>.'],
    [3, 'Tick <b>Gửi email báo cáo cho Director (CC HOD)</b> — giống nút “Send Report Email” của hệ thống Business Trip.'],
    [4, '<b>Lưu báo cáo</b>: hệ thống tạo <b>Google Doc báo cáo</b> trong folder chuyến đi, ghi cột <b>Business trip Report</b> và ngày nộp, task công tác trên lịch chuyển <b>Completed</b>.'],
  ])}
    ${tip('✏️ Đã nộp vẫn sửa được: mở lại chuyến, chỉnh nội dung và lưu để cập nhật.')}
    ${tip('🔒 Chỉ PIC của chuyến mới cập nhật được báo cáo. Người khác chỉ xem.', 'red')}</div>
    <div class="col-f">${fig({ img: 'tripreport', w: 470, frame: 'card', maxH: 585 })}</div>
  </div>`
});

/* ═════════ 15. SỰ KIỆN & BÀI ĐĂNG ═════════ */
slide({
  sec: 'MARKETING', acc: '#9B4F7E', title: 'Sự kiện offline &amp; bài đăng online', sub: 'Đọc trực tiếp từ 2 file Marketing FY68 — lên lịch là cả công ty cùng thấy', body: `
  <div class="pair">
    <div>${fig({ img: 'offline', w: 545, frame: 'browser', crop: [0.385, 0, 0.615, 0.64] })}
      <div class="cap"><b class="dot" style="background:#9B4F7E"></b><b>🎪 Sự kiện offline</b> — ① loại sự kiện, sản phẩm, KOL, đối tác, địa điểm, khu vực, kế hoạch / thực hiện, tham dự &amp; doanh số mục tiêu · ② folder sự kiện. Nguồn: ${a(L.off, 'Marketing Offline FY68')}</div></div>
    <div>${fig({ img: 'online', w: 545, frame: 'browser', crop: [0.385, 0, 0.615, 0.64] })}
      <div class="cap"><b class="dot" style="background:#4E7CAF"></b><b>📸 Bài sự kiện · 🦷 Bài sản phẩm</b> — ① page, format, pillar, ngày on-air, trạng thái · ② link bài đăng. Lọc theo Page hoặc <b>Chỉ bài Design</b>. Nguồn: ${a(L.on, 'Digital Marketing &amp; Design FY68')}</div></div>
  </div>`
});

/* ═════════ 16. PHÂN QUYỀN ═════════ */
const R = (t, w, c) => `<tr><td>${t}</td><td><span class="who" style="--c:${c || '#4E7CAF'}">${w}</span></td></tr>`;
slide({
  sec: 'PHÂN QUYỀN', acc: '#D9981F', title: 'Ai được làm gì?', sub: 'Xem thì mọi người — sửa thì chỉ chủ sở hữu', body: `
  <div class="two">
    <table class="perm"><thead><tr><th>Thao tác</th><th>Người thực hiện</th></tr></thead><tbody>
      ${R('Xem toàn bộ lịch: công tác, đào tạo, sự kiện, bài đăng', 'Tất cả mọi người', '#3E8E6B')}
      ${R('Xem nội dung báo cáo công tác · xem &amp; tải tài liệu đào tạo', 'Tất cả mọi người', '#3E8E6B')}
      ${R('Đề xuất công tác', 'Mọi nhân viên (chuyến của mình)', '#4E7CAF')}
      ${R('Sửa đề xuất · cập nhật báo cáo công tác', 'Chỉ PIC của chuyến', '#C0504D')}
      ${R('Duyệt công tác', 'Quản lý — HOD Menu trên Google Sheet', '#1F3A52')}
      ${R('Tạo buổi đào tạo', 'Team Leader · Manager · Director', '#8a71b6')}
      ${R('Sửa buổi · gửi thư mời · tải tài liệu lên', 'Người tạo hoặc Trainer của buổi', '#C0504D')}
    </tbody></table>
    <div class="col-t">
      <h4 class="h4">Mặc định hiển thị trên Lịch làm việc</h4>
      <ul class="dl">
        <li><b>🎓 Đào tạo</b> — luôn bật.</li>
        <li><b>✈️ Công tác</b> — mặc định ẩn, bấm nút để bật (tự bật khi bạn vừa đề xuất / báo cáo).</li>
        <li><b>🚗 Địa bàn Sales</b> — chỉ hiện với Director và Head of Sales &amp; Marketing.</li>
      </ul>
      ${tip('Trên MMH Calendar, bộ lọc <b>Hiển thị</b> của bạn được ghi nhớ cho lần mở sau.')}
    </div>
  </div>`
});

/* ═════════ 17. HỎI ĐÁP ═════════ */
const qa = (q, aa) => `<div class="qa"><h4>${q}</h4><p>${aa}</p></div>`;
slide({
  sec: 'HỎI ĐÁP', title: 'Câu hỏi thường gặp', body: `
  <div class="qag">
    ${qa('Không thấy MMH Calendar / nút Xem, Tải về?', 'Trình duyệt đang giữ bản cũ: nhấn <b>Ctrl + F5</b> (Mac: <b>Cmd + Shift + R</b>). Bản mới hiện <b>v15.2</b> cạnh chữ MMH Report.')}
    ${qa('Lịch trống hoặc thiếu mục?', 'Kiểm tra các nút ở cột <b>Hiển thị</b>, bộ lọc <b>Trạng thái = Tất cả</b>, ô tìm kiếm và chip <b>Người</b>. Bấm <b>↻ Làm mới</b> để tải lại ngay.')}
    ${qa('Mở tài liệu bị báo “cần quyền truy cập”?', 'Đăng nhập Google bằng email <b>@manimedicalhanoi.com</b>. Thư mục được chia sẻ tự động cho cả công ty khi có người mở danh sách tài liệu.')}
    ${qa('Gửi thư mời / lưu báo cáo bị lỗi?', 'Đọc dòng lỗi màu đỏ trong form — dữ liệu đã nhập vẫn giữ nguyên, sửa rồi bấm <b>Gửi lại</b>. Thư mời có thể dùng <b>Soạn bằng Gmail</b>.')}
    ${qa('Tôi không tạo được buổi đào tạo?', 'Chức năng dành cho <b>Team Leader / Manager / Director</b> theo danh sách nhân sự trên Training Hub.')}
    ${qa('Sửa trực tiếp trên Google Sheet có được không?', 'Có — app đọc từ chính các file đó. Thay đổi trên sheet hiện trên lịch sau tối đa ~15 phút (hoặc bấm ↻ Làm mới).')}
  </div>`
});

/* ═════════ 18. LIÊN KẾT ═════════ */
slide({
  sec: 'LIÊN KẾT', title: 'Tất cả liên kết trong một trang', sub: 'Bấm trực tiếp trên file PDF để mở', body: `
  <div class="lk">
    <div class="lkc"><h4>📱 Ứng dụng</h4>
      <p><b>MMH Report Hub</b><br>${a(L.app)}</p>
      <p><b>Training Hub</b><br>${a(L.hub)}</p>
      <p><b>📘 Thư mục Hướng dẫn sử dụng (Drive)</b><br>${a(L.guide, 'drive.google.com/drive/folders/1qrY9IGd…')}</p>
      <p class="sm">🆕 Xem lại thông báo cập nhật bất cứ lúc nào: bấm vào số phiên bản <b>v15.2</b> cạnh chữ MMH Report.</p></div>
    <div class="lkc"><h4>📗 File dữ liệu nguồn</h4>
      <p><b>MMH - Training Master</b><br>${a(L.trnSheet)}</p>
      <p><b>Business trip Approval and Report</b><br>${a(L.trip)}</p>
      <p><b>Marketing Offline FY68</b><br>${a(L.off)}</p>
      <p><b>Digital Marketing &amp; Design FY68</b><br>${a(L.on)}</p></div>
    <div class="lkc adm"><h4>⚙️ Dành cho quản trị (Apps Script web app)</h4>
      <p><b>Training Hub backend v3.11</b><br>${a(L.hubApi)}</p>
      <p><b>MMH Calendar Feed — file MKT Online</b><br>${a(L.feedOn)}</p>
      <p><b>MMH Calendar Feed — file MKT Offline</b><br>${a(L.feedOff)}</p>
      <p class="sm">Các web app chỉ mở được bằng tài khoản công ty. Khi cập nhật code: Deploy → Manage deployments → New version (giữ nguyên link).</p></div>
  </div>`
});

writeDeck('MMH Report Hub — Hướng dẫn cập nhật');
