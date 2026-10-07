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
    id: "2026-10-07-v16.4",
    version: "v16.4",
    date: "2026-10-07",
    title: "Tab KPI real time · tải tài liệu đào tạo chạy nền",
    summary: "Tab <b>KPI</b> mới: xem KPI tháng / quý / năm của bạn và đội nhóm, cập nhật liên tục từ file MMH KPI FY68. Tải tài liệu đào tạo giờ <b>chạy nền</b> — đóng khung vẫn tải tiếp.",
    items: [
      { type: "new", icon: "📊", title: "Tab KPI",
        text: "Bấm tab <b>KPI</b> → chọn Tháng / Quý / Năm FY68: thẻ tổng % của từng người, bảng chi tiết từng KPI (tên dễ hiểu, trọng số, target, actual, % đạt, tiến độ). Director thấy tất cả, HOD cả phòng, Team Leader nhóm mình, PIC chỉ mình. Cần đăng nhập bằng email." },
      { type: "imp", icon: "⬆️", title: "Tải tài liệu đào tạo chạy nền",
        text: "Thả file vào nhiều buổi đào tạo liên tiếp, đóng khung chi tiết vẫn tải tiếp — tiến độ hiện ở góc trái dưới, lỗi thì bấm <b>Thử lại</b>. Tải song song, nhanh hơn." },
      { type: "fix", icon: "📁", title: "Nút Tạo thư mục tài liệu",
        text: "Buổi đào tạo cũ chưa có thư mục: mở buổi trên MMH Calendar → <b>📁 Tạo thư mục tài liệu</b>." }
    ]
  },
  {
    id: "2026-10-06-v16.3",
    version: "v16.3",
    date: "2026-10-06",
    title: "Email giao việc từ hộp thư của bạn · theo dõi & trao đổi",
    summary: "Email giao việc giờ gửi được từ <b>chính hộp thư của bạn</b> (Outlook / Gmail). Bạn thấy người nhận <b>đã xem</b> trên Report Hub chưa, <b>đã hoàn thành</b> chưa, và trao đổi được ngay trong việc.",
    guide: "docs/HDSD_Tim_nhanh_Phan_quyen_Email_giao_viec_v16.3.pdf",
    items: [
      { type: "new", icon: "✉️", title: "Gửi từ hộp thư của bạn",
        text: "Soạn email giao việc → hàng <b>Gửi từ</b> chọn <b>Hộp thư của bạn</b> → <b>Mở thư để gửi</b>: Outlook / Gmail mở sẵn thư đã điền đủ, bạn bấm Gửi. Thư nằm trong “Đã gửi” của bạn, người nhận trả lời thẳng cho bạn.",
        img: "updates/v16.3/gui-tu-hop-thu.jpg" },
      { type: "new", icon: "📬", title: "Theo dõi: đã xem chưa, xong chưa",
        text: "Menu tên của bạn → <b>Việc đã giao &amp; trao đổi</b> (hoặc Ctrl + K → <i>viec da giao</i>): từng việc hiện <b>Chưa xem</b> / <b>Đã xem trên Report Hub</b> (kèm giờ) / <b>✓ Hoàn thành</b>.",
        img: "updates/v16.3/theo-doi.jpg" },
      { type: "new", icon: "💬", title: "Trao đổi gắn vào việc",
        text: "Bấm vào việc trong danh sách, hoặc bấm nhãn <b>✉ Email từ …</b> trên lịch → đọc và viết trả lời. Bên kia nhận email ngay; mở app sẽ báo khi có trả lời mới.",
        img: "updates/v16.3/trao-doi.jpg" },
      { type: "fix", icon: "🔧", title: "“Việc mới được giao” chạy thật",
        text: "Popup <b>Việc mới được giao</b>, nhãn <b>✉ Email từ …</b> và email tự báo khi hoàn thành nay được máy chủ ghi nhận đầy đủ (trước đây máy chủ chưa có phần này nên có lúc không hiện)." }
    ]
  },
  {
    id: "2026-10-06-v16.2",
    version: "v16.2",
    date: "2026-10-06",
    title: "Trang Phân quyền người dùng",
    summary: "Admin, Director và HOD tự thêm người, đặt phòng ban, vai trò và bật / tắt từng chức năng ngay trên Report Hub — không cần sửa code. Thấy luôn ai <b>chưa từng đăng nhập</b> để nhắc.",
    items: [
      { type: "new", icon: "👥", title: "Mở trang Phân quyền",
        text: "Bấm <b>tên của bạn</b> ở góc phải → <b>Phân quyền người dùng</b> (hoặc <b>Ctrl + K</b> → gõ <i>phan quyen</i>). Chỉ hiện với Admin / Director / HOD đã đăng nhập bằng email.",
        img: "updates/v16.2/menu-phan-quyen.jpg" },
      { type: "new", icon: "🔐", title: "Chọn người → đặt phòng ban, vai trò, bật / tắt chức năng",
        text: "<b>＋ Thêm người</b> hoặc bấm một dòng → sửa email, tên PIC, phòng ban, vai trò → bật / tắt Giao việc, Báo cáo tuần / tháng, Đề xuất công tác, Tạo buổi đào tạo, Sửa dữ liệu MKT, Xem Management → <b>Lưu quyền</b>. Công tắc viền vàng = khác mặc định của vai trò.",
        img: "updates/v16.2/phan-quyen.jpg" },
      { type: "new", icon: "🕒", title: "Biết ai chưa từng đăng nhập · đăng xuất từ xa",
        text: "Cột <b>Đăng nhập gần nhất</b> báo đỏ <b>Chưa đăng nhập</b> để nhắc. Mất máy hoặc nghỉ việc: chọn người → <b>Đăng xuất khỏi mọi máy</b>, hoặc bỏ tick <b>Được dùng Report Hub</b>." }
    ]
  },
  {
    id: "2026-10-06-v16.1",
    version: "v16.1",
    date: "2026-10-06",
    title: "Tìm nhanh mọi thứ: Ctrl + K",
    summary: "Một ô tìm cho việc ở cả 3 phòng ban, sự kiện, bài đăng, công tác và đào tạo — <b>không cần gõ dấu</b>. Bấm <b>Ctrl + K</b> (máy Mac: <b>⌘ K</b>) hoặc nút <b>Tìm nhanh</b> trên thanh trên cùng.",
    items: [
      { type: "new", icon: "🔎", title: "Gõ vài chữ, ra ngay kết quả",
        text: "Bấm <b>Ctrl + K</b> → gõ vài chữ, ví dụ <b>jizai</b> → kết quả xếp theo nhóm: Việc · Sự kiện & bài đăng · Công tác · Đào tạo. Dùng <b>↑ ↓</b> để chọn, <b>Enter</b> để mở đúng chỗ, <b>Tab</b> để sang nhóm kế.",
        img: "updates/v16.1/tim-nhanh.jpg" },
      { type: "new", icon: "☑️", title: "Mở thẳng công việc, kể cả ở phòng ban khác",
        text: "Chọn một việc → mở ngay khung cập nhật của việc đó; việc ở phòng ban khác thì app tự chuyển phòng rồi mở. PIC thấy việc của mình; quản lý thấy cả nhóm.",
        img: "updates/v16.1/tim-viec.jpg" },
      { type: "new", icon: "⚡", title: "Lệnh nhanh",
        text: "Không có việc nào khớp? Bấm <b>Enter</b> ở dòng <b>Thêm việc mới “…”</b> để tạo việc với đúng tên vừa gõ. Gõ <b>bao cao</b>, <b>tien do</b>, <b>doi mau</b>… để mở nhanh Báo cáo tuần, Tiến độ, Màu giao diện." }
    ]
  },
  {
    id: "2026-10-06-v16.0",
    version: "v16.0",
    date: "2026-10-06",
    title: "Đăng nhập bằng email công ty + mã 6 số",
    summary: "Mỗi người một tài khoản: nhập email công ty, nhận <b>mã 6 số</b> qua email, nhập mã là vào. Máy được ghi nhớ <b>30 ngày</b>. Cách chọn tên chỉ còn dùng tạm đến hết <b>13/10</b>.",
    guide: "docs/HDSD_Dang_nhap_email_v16.0.pdf",
    items: [
      { type: "new", icon: "✉️", title: "Nhập email công ty để đăng nhập",
        text: "Màn đăng nhập: gõ email <b>@mani.inc</b> hoặc <b>@manimedicalhanoi.com</b> → <b>Gửi mã đăng nhập</b>. Mã được gửi tới đúng địa chỉ bạn vừa gõ.",
        img: "updates/v16.0/dang-nhap-email.jpg" },
      { type: "new", icon: "🔢", title: "Nhập mã 6 số — xong",
        text: "Mở email <b>“Mã đăng nhập MMH Report”</b> → gõ 6 số, app tự đăng nhập. Chưa thấy email: xem thư mục <b>Junk / Thư rác</b>, hoặc bấm <b>Gửi lại mã</b>.",
        img: "updates/v16.0/nhap-ma.jpg" },
      { type: "imp", icon: "🛡️", title: "Đang dùng bằng cách chọn tên? Xác thực một lần",
        text: "Bấm <b>Xác thực ngay</b> ở lời nhắc cuối màn hình (hoặc menu tên của bạn) → nhập email và mã. Không bị đăng xuất, không mất việc đang làm. Nên làm trước ngày <b>13/10</b>.",
        img: "updates/v16.0/xac-thuc-trong-app.jpg" },
      { type: "imp", icon: "👤", title: "“Đổi người dùng” giờ là “Đăng xuất”",
        text: "Menu tên của bạn hiện email đang đăng nhập. Dùng máy chung thì bấm <b>Đăng xuất</b> khi xong việc.",
        img: "updates/v16.0/menu-da-xac-thuc.jpg" }
    ]
  },
  {
    id: "2026-10-06-v15.9",
    version: "v15.9",
    date: "2026-10-06",
    title: "Giao diện gọn hơn: thanh trên cùng một dòng & menu tên của bạn",
    summary: "Thanh trên cùng thấp và gọn, nhường chỗ cho lịch làm việc. Các nút ít dùng được gom vào <b>menu tên của bạn</b> ở góc phải.",
    items: [
      { type: "imp", icon: "🧭", title: "Thanh trên cùng chỉ còn một dòng",
        text: "Thanh trên cùng giờ chỉ có logo, <b>MMH Calendar</b> và tên của bạn — thấp hơn khoảng một nửa nên lịch và danh sách việc hiện được nhiều hơn mà không phải cuộn.",
        img: "updates/v15.9/truoc-sau.jpg" },
      { type: "new", icon: "👤", title: "Menu tên của bạn",
        text: "Bấm vào <b>tên / ảnh đại diện</b> ở góc phải → chọn <b>Màu giao diện</b>, đổi <b>VN / EN</b>, xem <b>Có gì mới?</b> hoặc <b>Đổi người dùng</b>. Bấm ra ngoài hoặc phím Esc để đóng.",
        img: "updates/v15.9/menu-nguoi-dung.jpg" },
      { type: "imp", icon: "🔄", title: "Không cần bấm “Đồng bộ Sales tasks” nữa",
        text: "Hệ thống tự cập nhật Customer visiting & Working at office từ Field Report của Sales <b>mỗi 10 phút</b>, nên nút đồng bộ bằng tay đã được bỏ." },
      { type: "imp", icon: "✨", title: "Nút bấm nhẹ nhàng, đều nhau",
        text: "Các nút trên Lịch làm việc cùng một cỡ, chữ bớt đậm cho dễ nhìn; bỏ vệt mờ thừa ở mép phải màn hình." }
    ]
  },
  {
    id: "2026-10-06-v15.8",
    version: "v15.8",
    date: "2026-10-06",
    title: "Lưu chắc chắn xuống Google Sheet & Đề xuất công tác không phải chờ",
    summary: "Mọi thao tác hiện ngay trên app và được xếp hàng để ghi xuống Google Sheet. Mạng chậm thì tự thử lại, đóng app thì lần mở sau gửi tiếp, không mất dữ liệu.",
    items: [
      { type: "fix", icon: "✅", title: "Thêm Key task rồi Sub-task ngay, chuyển tab: không còn báo “không ghi được”",
        text: "Thêm Key task, thêm Sub-task ngay sau đó rồi sang tab / phòng ban khác: app vẫn ghi đúng vào file của phòng ban lúc bạn bấm, Sub-task tự gắn vào Key task vừa tạo." },
      { type: "imp", icon: "🔁", title: "Tự thử lại đến khi sheet xác nhận",
        text: "Mạng chập chờn hoặc Google bận: góc phải dưới báo <b>Mạng chậm — đang tự thử lại</b>, bạn cứ làm tiếp. Không lo trùng dòng vì mỗi lần ghi có mã riêng. Đóng hoặc tải lại trang khi chưa lưu xong: lần mở sau app tự gửi tiếp." },
      { type: "new", icon: "⚠️", title: "Báo rõ khi có thay đổi chưa lưu được",
        text: "Nếu sheet từ chối (ví dụ task đã bị xoá trên sheet), góc phải dưới hiện nút đỏ <b>… chưa lưu được — bấm để xem</b>. Bấm vào để xem lý do, chọn <b>Thử lại</b> hoặc <b>Bỏ</b>.",
        img: "updates/v15.8/chua-luu-duoc.jpg" },
      { type: "imp", icon: "✈️", title: "Đề xuất công tác mở ngay, gửi là xong",
        text: "Form đề xuất mở tức thì vì danh mục điểm đến, người đi cùng, thiết bị đã lưu sẵn và tự cập nhật ngầm. Bấm <b>Gửi đề xuất</b>: form đóng ngay, chuyến đi hiện “Chờ duyệt” trên lịch, email xin duyệt gửi ở phía sau. Bấm xem chuyến đi cũng hiện ngay." }
    ]
  },
  {
    id: "2026-10-06-v15.7",
    version: "v15.7",
    date: "2026-10-06",
    title: "Thao tác tức thì, chi tiết Marketing gọn đẹp & 10 tông màu giao diện",
    summary: "Thêm / xoá Key task, Sub-task và sửa dữ liệu Marketing hiện kết quả ngay, không còn màn hình chờ “Đang tải”. Chọn màu giao diện theo ý bạn bằng nút 🎨 trên thanh trên cùng.",
    items: [
      { type: "imp", icon: "⚡", title: "Thêm / xoá task hiển thị ngay lập tức",
        text: "Thêm Key task / Sub-task (trên Lịch làm việc hoặc Tiến độ công việc) là thẻ hiện <b>ngay</b>; xoá là biến mất ngay. Hệ thống lưu lên Google Sheet ở phía sau và không còn “nhảy lại” khi dữ liệu đang đồng bộ." },
      { type: "imp", icon: "📋", title: "Chi tiết sự kiện offline / bài đăng rõ ràng hơn",
        text: "Bấm vào sự kiện / bài đăng trên MMH Calendar → thông tin chia thành các ô: thời gian, địa điểm, đối tác, mục tiêu & doanh số (có thanh tiến độ), lịch on-air, link tài liệu.",
        img: "updates/v15.7/chi-tiet-mkt.jpg" },
      { type: "imp", icon: "✏️", title: "Sửa ngay trong khung chi tiết — không chờ tải",
        text: "Bấm nút nhỏ <b>✏️ Sửa</b> ở góc trên → biểu mẫu mở ngay trong khung, danh mục chọn có sẵn. Bấm <b>Lưu</b>: lịch đổi ngay, góc trên báo “Đang lưu…” → “✓ Đã lưu”; nếu lỗi, dữ liệu cũ được trả lại và giữ nguyên chữ bạn đã gõ.",
        img: "updates/v15.7/sua-mkt.jpg" },
      { type: "new", icon: "🎨", title: "10 tông màu giao diện nhã nhặn",
        text: "Bấm biểu tượng <b>bảng màu</b> cạnh nút VN / EN → chọn MMH Navy, Biển sâu, Ngọc bích, Lá xô thơm, Than chì, Oải hương, Hồng phấn, Be cát, Đất nung hoặc Rừng thông. Đổi tức thì, nhớ riêng trên máy của bạn.",
        img: "updates/v15.7/chon-mau.jpg" },
      { type: "new", icon: "🖼️", title: "Xem trước một số tông màu",
        text: "Màu theo loại lịch (công tác, đào tạo, sự kiện…) và màu trạng thái giữ nguyên ở mọi tông để dễ nhận biết.",
        img: "updates/v15.7/cac-tong-mau.jpg" }
    ]
  },
  {
    id: "2026-10-06-v15.6",
    version: "v15.6",
    date: "2026-10-06",
    title: "Nhãn việc được giao: “✉ Email từ …”",
    summary: "Việc được giao nay ghi rõ nguồn: “✉ Email từ Thuong” thay cho “Thuong giao”.",
    items: [
      { type: "imp", icon: "✉", title: "“✉ Email từ <người giao>” trên thẻ việc và popup",
        text: "Trên Lịch làm việc, Cập nhật công việc và popup việc mới, nhãn hiển thị <b>✉ Email từ Thuong</b> (nền đỏ nhạt = quan trọng); hoàn thành xong chuyển xám <b>✓ Email từ Thuong</b>.",
        img: "updates/v15.6/email-tu.jpg" }
    ]
  },
  {
    id: "2026-10-06-v15.5",
    version: "v15.5",
    date: "2026-10-06",
    title: "Giao việc rõ người giao, tự báo hoàn thành & sửa dữ liệu Marketing trên lịch",
    summary: "Việc được giao hiện popup cho người nhận và được cắm cờ trên lịch; hoàn thành là người giao tự nhận email. Sự kiện offline và bài đăng sửa / thêm / xoá thẳng từ MMH Calendar.",
    guide: "docs/HDSD_Giao_viec_va_du_lieu_MKT_v15.5.pdf",
    folder: "https://drive.google.com/drive/folders/1qrY9IGdSRSOUZnIkJSvjLaEXYJceBfY6",
    items: [
      { type: "new", icon: "✉", title: "Việc mới được giao — popup khi đăng nhập",
        text: "Khi Team Leader / Manager giao việc cho bạn, lần đăng nhập kế tiếp sẽ hiện popup ghi rõ <b>người giao</b>, Key task và <b>hạn</b> (mỗi việc chỉ hiện 1 lần). Bấm <b>Mở công việc</b> để cập nhật ngay.",
        img: "updates/v15.5/viec-duoc-giao.jpg" },
      { type: "new", icon: "✉", title: "Nhãn “✉ Email từ …” trên Lịch làm việc & Cập nhật công việc",
        text: "Việc được giao luôn có nhãn đỏ nhạt <b>✉ Email từ &lt;người giao&gt;</b> (đánh dấu quan trọng); hoàn thành xong chuyển xám <b>✓</b>.",
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
