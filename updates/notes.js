/* ══════ THÔNG BÁO CẬP NHẬT — MMH Report Hub ══════
   Mỗi lần sửa / thêm tính năng: thêm 1 mục MỚI LÊN ĐẦU mảng (quy trình chi tiết: CLAUDE.md).
   · id      : duy nhất, không đổi sau khi phát hành (PIC tick "Không hiển thị lại" sẽ ẩn theo id)
   · date    : YYYY-MM-DD — thông báo tự hiện khi đăng nhập trong 7 ngày kể từ ngày này
   · type    : "new" (tính năng mới) · "imp" (cải tiến) · "fix" (sửa lỗi)
   · img     : ảnh trong updates/<version>/ (đường dẫn tương đối từ index.html)
   · guide   : file PDF hướng dẫn chi tiết (docs/…) — tuỳ chọn
   · text    : được phép dùng thẻ HTML đơn giản (<b>, <i>, <br>) */
window.MMH_UPDATES = [
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
      { type: "new", icon: "🧳", title: "Đề xuất &amp; báo cáo công tác trên lịch",
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
