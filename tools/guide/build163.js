/* HDSD v16.1–16.3 — Tìm nhanh (Ctrl+K) · Phân quyền người dùng · Email giao việc & trao đổi
   Chạy: node tools/guide/cap.js v161qs v162adm v163 → node tools/guide/tojpg.js → node tools/guide/build163.js
         → PDF=1 node tools/guide/render.js → copy tools/guide/out.pdf vào docs/
   Ảnh thông báo: node tools/guide/noteimg.js updates/v16.3 '[[5,0,"gui-tu-hop-thu"],[6,0,"theo-doi"],[6,1,"trao-doi"]]' */
const { L, a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v16.3';

slide({ bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">THÔNG BÁO CẬP NHẬT · REPORT HUB v16.1 – v16.3</div>
    <h1>Tìm nhanh · Phân quyền<br><span>Email giao việc từ hộp thư của bạn</span></h1>
    <p class="cv-p">Ctrl + K tìm mọi thứ ở cả 3 phòng ban. Admin / Director / HOD tự phân quyền không cần sửa code. Email giao việc gửi từ chính hộp thư của bạn, theo dõi người nhận đã xem / đã xong, trao đổi gắn vào việc.</p>
    <div class="cv-chips"><span>🔎 Ctrl + K</span><span>👥 Phân quyền</span><span>✉ Gửi từ hộp thư của bạn</span><span>📬 Theo dõi & trao đổi</span></div>
    <div class="cv-link">Mở app: ${a(L.app)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
  </div>
  <div class="cv-r">${fig({ img: 'v161qs', w: 760, frame: 'browser', crop: [0.25, 0.08, 0.55, 0.62], map: {} })}</div>` });

slide({ sec: 'TÌM NHANH', kick: 'CTRL + K', acc: '#3A5CAA', title: 'Tìm mọi thứ trong một ô', sub: 'Việc ở cả 3 phòng ban · sự kiện · bài đăng · công tác · đào tạo — không cần gõ dấu', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Bấm <b>Ctrl + K</b> (Mac: <b>⌘ K</b>) hoặc nút <b>Tìm nhanh</b> ở thanh trên cùng (4) → gõ vài chữ.'],
    [2, 'Kết quả chia nhóm. <b>↑ ↓</b> chọn, <b>Enter</b> mở đúng chỗ: việc mở khung cập nhật (phòng ban khác tự chuyển), sự kiện mở chi tiết trên MMH Calendar. <b>Tab</b> sang nhóm kế.'],
    [3, '<b>Lệnh nhanh</b>: thêm việc mới với đúng chữ vừa gõ, mở Báo cáo tuần, Tiến độ, đổi màu…'],
  ])}${tip('PIC thấy việc của mình; quản lý thấy cả nhóm — giống quyền xem ở các tab.')}</div>
  <div class="col-f">${fig({ img: 'v161qs', w: 640, frame: 'browser', crop: [0.0, 0.0, 0.75, 0.72] })}</div></div>` });

slide({ sec: 'PHÂN QUYỀN', kick: 'ADMIN · DIRECTOR · HOD', acc: '#2F6B4A', title: 'Trang Phân quyền người dùng', sub: 'Menu tên của bạn ▸ Phân quyền người dùng (cần đăng nhập bằng email)', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>＋ Thêm người</b>: email công ty, tên PIC (đúng tên trong Report Hub), phòng ban, vai trò.'],
    [2, 'Bấm một dòng để xem / sửa người đó.'],
    [3, 'Bật / tắt từng chức năng. Công tắc <b>viền vàng</b> = khác mặc định của vai trò.'],
    [4, 'Cột <b>Đăng nhập gần nhất</b>: đỏ = chưa từng đăng nhập ⇒ nhắc họ.'],
    [5, '<b>Lưu quyền</b> — có hiệu lực trong khoảng 2 phút, khi người đó đăng nhập bằng email.'],
  ])}</div>
  <div class="col-f">${fig({ img: 'v162adm', w: 700, frame: 'browser' })}</div></div>` });

slide({ sec: 'PHÂN QUYỀN', acc: '#2F6B4A', title: 'Mỗi công tắc làm gì?', sub: 'Mặc định giữ đúng như trước — chỉ cần đổi khi muốn khác', body: `
  <ul class="dl" style="font-size:16px">
    <li><b>Giao việc &amp; email giao việc</b> — được giao việc cho người khác (mặc định: Director, HOD, Team Leader có quyền giao).</li>
    <li><b>Báo cáo tuần / tháng</b> — thấy tab Báo cáo tuần, Monthly Report.</li>
    <li><b>Đề xuất &amp; báo cáo công tác</b> — nút ✈️ Đề xuất công tác.</li>
    <li><b>Tạo buổi đào tạo · gửi thư mời</b> — nhấp đúp lịch ▸ Đào tạo (mặc định: từ Team Leader trở lên).</li>
    <li><b>Sửa dữ liệu Marketing Offline / Online</b> — nút ✏️ Sửa trên MMH Calendar (mặc định: Sales &amp; Marketing trừ PIC Sales).</li>
    <li><b>Xem Management</b> — chỉ tắt bớt được (máy chủ Management chỉ mở cho Director / HOD).</li>
  </ul>
  ${tip('<b>Đăng xuất khỏi mọi máy</b>: khi mất máy / nghỉ việc. Bỏ tick <b>Được dùng Report Hub</b> = khoá ngay. HOD không sửa được Admin / Director.')}` });

slide({ sec: 'EMAIL GIAO VIỆC', kick: 'BƯỚC 1', acc: '#B04F4B', title: 'Gửi từ hộp thư của bạn', sub: 'Thư nằm trong “Đã gửi” của bạn, người nhận trả lời thẳng cho bạn', body: `
  <div class="two"><div class="col-t">${steps([
    [1, 'Soạn email giao việc như trước → hàng <b>Gửi từ</b>: <b>Hộp thư của bạn</b> (Outlook cho @mani.inc, Gmail cho @manimedicalhanoi.com), <b>Ứng dụng email trên máy</b>, hoặc <b>Hộp thư hệ thống</b> như cũ.'],
    [2, 'Ngay khi soạn đã thấy <b>Theo dõi việc bạn đã giao</b> gần đây.'],
    [3, 'Bấm <b>Mở thư để gửi</b> → Outlook / Gmail mở sẵn thư (người nhận, tiêu đề có mã <b>[#A…]</b>, nội dung) → kiểm tra rồi bấm <b>Gửi</b> trong Outlook / Gmail.'],
  ])}${tip('Cần đăng nhập Report Hub bằng email để app biết địa chỉ email của bạn và người nhận. Lần đầu dùng Outlook / Gmail trên trình duyệt có thể phải đăng nhập hộp thư.')}</div>
  <div class="col-f">${fig({ img: 'v163compose', w: 420, frame: 'card', maxH: 500 })}</div></div>` });

slide({ sec: 'EMAIL GIAO VIỆC', kick: 'BƯỚC 2', acc: '#B04F4B', title: 'Theo dõi đã xem / đã xong · trao đổi gắn vào việc', sub: 'Menu tên ▸ Việc đã giao & trao đổi · Ctrl + K “viec da giao” · bấm nhãn ✉ Email từ … trên lịch', body: `
  <div class="pair">
    <div>${fig({ img: 'v163track', w: 545, frame: 'card' })}<div class="cap"><b>Trạng thái</b>: Chưa xem → <b>Đã xem trên Report Hub</b> (giờ xem) → <b>✓ Hoàn thành</b> (người giao tự nhận email). <b>Trả lời mới</b> luôn ở trên cùng.</div></div>
    <div>${fig({ img: 'v163thread', w: 545, frame: 'card' })}<div class="cap"><b>Trao đổi</b> lưu ngay trong việc — gửi là bên kia nhận email; trả lời email đó sẽ tới thẳng người viết.</div></div>
  </div>` });

writeDeck('MMH Report Hub v16.1–16.3 — Tìm nhanh · Phân quyền · Email giao việc');
