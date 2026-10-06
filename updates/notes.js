/* ══════ THÔNG BÁO CẬP NHẬT — MMH Report Hub ══════
   Mỗi lần sửa / thêm tính năng: thêm 1 mục MỚI LÊN ĐẦU mảng (quy trình chi tiết: CLAUDE.md).
   · id      : duy nhất, không đổi sau khi phát hành (PIC tick "Không hiển thị lại" sẽ ẩn theo id)
   · date    : YYYY-MM-DD — thông báo tự hiện khi đăng nhập trong 7 ngày kể từ ngày này
   · type    : "new" (tính năng mới) · "imp" (cải tiến) · "fix" (sửa lỗi)
   · img     : ảnh trong updates/<version>/ (đường dẫn tương đối từ index.html)
   · guide   : file PDF hướng dẫn chi tiết (docs/…) — tuỳ chọn
   · title   : chữ thuần (viết & bình thường, KHÔNG dùng &amp;) · summary / text: được phép dùng thẻ HTML đơn giản (<b>, <i>, <br>) */
window.MMH_UPDATES = [
  {
    id: "2026-10-06-v15.5",
    version: "v15.5",
    date: "2026-10-06",
    title: "Giao việc rõ người giao, tự báo hoàn thành & sửa dữ liệu Marketing trên lịch",
    summary: "Việc được giao hiện popup cho người nhận và được cắm cờ trên lịch; hoàn thành là người giao tự nhận email. Sự kiện offline và bài đăng sửa / thêm / xoá thẳng từ MMH Calendar.",
    guide: "docs/HDSD_Giao_viec_va_du_lieu_MKT_v15.5.pdf",
    folder: "https://drive.google.com/drive/folders/1qrY9IGdSRSOUZnIkJSvjLaEXYJceBfY6",
    items: [
      { type: "new", icon: "⚑", title: "Việc mới được giao — popup khi đăng nhập",
        text: "Khi Team Leader / Manager giao việc cho bạn, lần đăng nhập kế tiếp sẽ hiện popup ghi rõ <b>người giao</b>, Key task và <b>hạn</b> (mỗi việc chỉ hiện 1 lần). Bấm <b>Mở công việc</b> để cập nhật ngay.",
        img: "updates/v15.5/viec-duoc-giao.jpg" },
      { type: "new", icon: "🚩", title: "Cờ “⚑ … giao” trên Lịch làm việc & Cập nhật công việc",
        text: "Việc được giao luôn có nhãn đỏ nhạt <b>⚑ Tên người giao</b> (đánh dấu quan trọng); hoàn thành xong chuyển xám <b>✓</b>.",
        img: "updates/v15.5/co-giao-viec.jpg" },
      { type: "new", icon: "📨", title: "Hoàn thành ⇒ người giao tự nhận email",
        text: "Chỉ cần chuyển việc sang <b>Completed</b> — hệ thống tự gửi email cho người giao (CC người làm) kèm kết quả và link Report Hub. Email giao việc nay cũng có <b>link MMH Report Hub</b>.",
        img: "updates/v15.5/email-hoan-thanh.jpg" },
      { type: "new", icon: "✏️", title: "Sửa / xoá sự kiện offline & bài đăng ngay trên lịch",
        text: "Nhóm Marketing: bấm vào sự kiện / bài đăng trên MMH Calendar → <b>✏️ Sửa</b>. Ghi thẳng vào file Marketing FY68; các ô chọn lấy đúng danh mục trên sheet, cột công thức giữ nguyên.",
        img: "updates/v15.5/sua-du-lieu-mkt.jpg" },
      { type: "new", icon: "＋", title: "Thêm sự kiện / bài đăng mới từ lịch",
        text: "Nhấp đúp vào ngày → <b>Sự kiện offline</b>, <b>Bài đăng sự kiện</b> hoặc <b>Bài đăng sản phẩm</b> ⇒ thêm dòng mới vào đúng sheet.",
        img: "updates/v15.5/them-moi-mkt.jpg" },
      { type: "fix", icon: "👥", title: "Bộ lọc Nhân sự đủ người (có Minh Trang)",
        text: "Bộ lọc Nhân sự ở Cập nhật công việc / Tiến độ / Báo cáo / Monthly / Hoạt động nay hiện đủ nhân sự của phòng ban, kể cả người chưa có task." }
    ]
  },
  {
    id: "2026-10-06-v15.4",
    version: "v15.4",
    date: "2026-10-06",
    title: "Nhắc hạn nộp chứng từ chi phí & lịch rõ màu hơn",
    summary: "Popup nhắc hạn nộp Phiếu công tác / Bảng kê mua hàng theo thông báo của Bộ phận Kế toán; màu MMH Calendar đậm hơn, dễ phân biệt.",
    items: [
      { type: "new", icon: "🧾", title: "Nhắc hạn nộp Phiếu công tác & Bảng kê mua hàng",
        text: "Tự hiện khi đăng nhập vào ngày <b>14, 15, 28, 29</b> hàng tháng (và đúng ngày hạn): hạn Lần 1 (17:00 ngày 15), Lần 2 (17:00 ngày làm việc liền trước ngày làm việc cuối tháng), hồ sơ cần nộp và quy định trừ điểm Behaviour. Bấm <b>Tắt thông báo</b> để không hiện lại trong đợt đó.",
        img: "updates/v15.4/nhac-han-chung-tu.jpg" },
      { type: "imp", icon: "📅", title: "MMH Calendar rõ màu hơn",
        text: "Thẻ lịch tô nền nhẹ theo từng loại, vạch màu đậm hơn; nút bật/tắt và thẻ số liệu dùng đúng màu của loại lịch để dễ phân biệt.",
        img: "updates/v15.4/lich-ro-mau.jpg" }
    ]
  },
  {
    id: "2026-10-06-v15.3",
    version: "v15.3",
    date: "2026-10-06",
    title: "Giao diện MMH Calendar & thông báo gọn gàng, nhã nhặn hơn",
    summary: "Màu sắc dịu theo nhận diện MMH, bớt biểu tượng và nền đậm — dễ nhìn, dễ đọc hơn khi làm việc cả ngày.",
    items: [
      { type: "imp", icon: "📅", title: "Lịch dịu mắt hơn",
        text: "Mỗi loại lịch chỉ còn <b>một vạch màu nhạt</b> bên trái thẻ; nền trắng, bỏ biểu tượng màu trong ô lịch. Nút bật/tắt và thẻ số liệu dùng chung một tông xanh MMH.",
        img: "updates/v15.3/lich-nha-nhan.jpg" },
      { type: "imp", icon: "📮", title: "Thư nhắc việc & thông báo dạng thẻ trắng",
        text: "Bỏ viền thư sọc, tem và nền đậm; toàn bộ chữ trong thông báo dùng font <b>Aptos</b>. Hạn &amp; quá hạn vẫn được đánh dấu bằng nhãn màu nhạt.",
        img: "updates/v15.3/thu-nhac-viec.jpg" },
      { type: "imp", icon: "🗂️", title: "Bảng chi tiết & nhãn trạng thái tinh gọn",
        text: "Nhãn trạng thái nền nhạt, chữ trầm; biểu tượng chuyển xám nhẹ. Thông báo nhỏ (toast) đổi sang thẻ trắng thay cho nền xanh đậm.",
        img: "updates/v15.3/bang-chi-tiet.jpg" }
    ]
  },
  {
    id: "2026-10-06-v15.2",
    version: "v15.2",
    date: "2026-10-06",
    title: "MMH Calendar — Công tác · Đào tạo · Sự kiện · Bài đăng trong một lịch",
    summary: "Đề xuất &amp; báo cáo công tác, tạo buổi đào tạo, gửi thư mời, chia sẻ tài liệu và nhắc việc tự động — ngay trên Report Hub. Bấm vào ảnh để phóng to.",
    guide: "docs/HDSD_MMH_Calendar_v15.2.pdf",
    folder: "https://drive.google.com/drive/folders/1qrY9IGdSRSOUZnIkJSvjLaEXYJceBfY6",
    items: [
      { type: "new", icon: "📅", title: "MMH Calendar — lịch chung của cả công ty",
        text: "Bấm nút <b>📅 MMH Calendar</b> trên thanh công cụ. Công tác, đào tạo, sự kiện offline, bài đăng online trên cùng một lịch; xem Tháng / Tuần / Danh sách, lọc theo loại, trạng thái, người.",
        img: "updates/v15.2/mmh-calendar.jpg" },
      { type: "new", icon: "🎓", title: "Tạo buổi đào tạo ngay trên lịch",
        text: "Team Leader / Manager / Director: <b>nhấp đúp vào ngày</b> → <b>Tạo kế hoạch đào tạo</b>. Chọn đối tượng theo nhóm hoặc từng người — ghi thẳng vào Training Hub.",
        img: "updates/v15.2/dao-tao-tao-buoi.jpg" },
      { type: "new", icon: "✉️", title: "Gửi thư mời — thư mục tài liệu tự tạo",
        text: "Bấm <b>📨 Gửi email</b>: hệ thống tạo thư mục tài liệu trên Drive, ghi link vào Training Hub và gửi thư kèm dòng <i>“Vui lòng truy cập và tham khảo tài liệu đào tạo tại đây”</i>.",
        img: "updates/v15.2/dao-tao-thu-moi.jpg" },
      { type: "new", icon: "📚", title: "Kéo thả tài liệu — ai cũng Xem / Tải về được",
        text: "Người tạo / trainer kéo thả file vào buổi học. Mọi người bấm <b>👁 Xem</b> hoặc <b>⬇️ Tải về</b> (Docs/Slides/Sheets tự thành .docx/.pptx/.xlsx).",
        img: "updates/v15.2/tai-lieu-xem-tai-ve.jpg" },
      { type: "new", icon: "🧳", title: "Đề xuất & báo cáo công tác trên lịch",
        text: "Đề xuất chuyến đi (ghi file Business Trip + email xin duyệt). Bấm vào chuyến để xem <b>toàn bộ nội dung báo cáo</b>; PIC bấm <b>📋 Cập nhật báo cáo công tác</b> để nộp báo cáo.",
        img: "updates/v15.2/cong-tac-bao-cao.jpg" },
      { type: "new", icon: "📮", title: "Thư nhắc việc khi đăng nhập",
        text: "Nhắc báo cáo công tác chưa nộp (hạn <b>3 ngày</b> sau ngày về) và thư mục đào tạo còn trống (hạn <b>1 ngày</b> sau buổi học) — hiện mỗi lần đăng nhập đến khi hoàn thành.",
        img: "updates/v15.2/thu-nhac-viec.jpg" },
      { type: "new", icon: "🆕", title: "Thông báo cập nhật (chính là hộp này)",
        text: "Mỗi lần Report Hub có tính năng mới / sửa lỗi, thông báo tự hiện khi đăng nhập trong <b>7 ngày</b>. Tick <b>Không hiển thị lại</b> để ẩn; bấm vào số phiên bản <b>v15.2</b> cạnh chữ MMH Report để xem lại bất cứ lúc nào." }
    ]
  }
];
