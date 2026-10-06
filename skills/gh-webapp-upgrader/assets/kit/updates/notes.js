/* ══════ THÔNG BÁO CẬP NHẬT ══════
   Mỗi lần sửa / thêm tính năng (người dùng nhìn thấy được): thêm 1 mục MỚI LÊN ĐẦU mảng.
   · id      : duy nhất, KHÔNG đổi sau khi phát hành (người dùng tick "Không hiển thị lại" sẽ ẩn theo id) — dạng YYYY-MM-DD-vX.Y
   · date    : YYYY-MM-DD — thông báo tự hiện khi đăng nhập trong 7 ngày kể từ ngày này
   · type    : "new" (tính năng mới) · "imp" (cải tiến) · "fix" (sửa lỗi)
   · img     : ảnh trong updates/<version>/ (đường dẫn tương đối từ index.html), JPEG ≤ 1300px, < 200 KB
   · guide   : file PDF hướng dẫn (docs/…) — tuỳ chọn · folder: link thư mục HDSD (Drive) — tuỳ chọn
   · title   : CHỮ THUẦN (viết & bình thường, KHÔNG dùng &amp;) · summary / text: được dùng thẻ HTML đơn giản (<b>, <i>, <br>)
   Văn phong: ngắn, cho người không rành kỹ thuật, kiểu "bấm vào đâu → làm gì → kết quả", tối đa 2–3 câu mỗi mục. */
window.APP_UPDATES = [
  {
    id: "2026-01-01-v1.0",
    version: "v1.0",
    date: "2026-01-01",
    title: "Có thông báo cập nhật ngay trong app",
    summary: "Từ nay mỗi lần app được cải tiến, bạn sẽ thấy thông báo này khi đăng nhập (trong 7 ngày).",
    items: [
      { type: "new", icon: "🆕", title: "Bấm số phiên bản để xem lại lịch sử",
        text: "Bấm vào <b>số phiên bản</b> cạnh tên app để xem lại mọi bản cập nhật. Tick <b>Không hiển thị lại</b> nếu bạn đã đọc." }
    ]
  }
];
