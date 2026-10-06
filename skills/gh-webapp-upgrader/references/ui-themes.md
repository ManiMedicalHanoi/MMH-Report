# Giao diện nhã nhặn & chủ đề màu

## Mục lục
1. Nguyên tắc "bình tĩnh"
2. Token màu (biến CSS)
3. Hệ chủ đề màu (theme) — cách cài
4. Chuyển màu viết cứng sang biến
5. Hộp thoại / thông báo / popup xếp hàng
6. Phản hồi thực tế của người dùng (để không lặp lại)

## 1. Nguyên tắc "bình tĩnh"
Người dùng văn phòng nhìn app cả ngày. Màu đậm, gradient, viền sọc, bóng đổ nặng, emoji màu dày đặc làm mỏi mắt và khó tìm
thông tin chính. Mặc định:
- Nền trang xám rất nhạt (`--gray`), thẻ trắng, viền mảnh `#E6EAEF`, bo góc 10–14 px, bóng rất nhẹ hoặc không có.
- Một màu nhấn chính (`--t-pri`) cho nút chính, tiêu đề dùng màu mực đậm (`--t-ink`), chữ phụ xám `#6B7B8C`.
- Một font cho toàn app — kể cả hộp thoại/thông báo (hay bị quên vì chúng được tạo bằng JS và có CSS riêng). Ví dụ
  `font-family: Aptos, 'Aptos Display', 'Segoe UI', Calibri, Arial, sans-serif`.
- Màu mang nghĩa (loại lịch, trạng thái, mức ưu tiên): **vạch đậm + nền tô nhẹ ~13%**. Quá nhạt (~6–8%) người dùng phàn nàn
  khó nhìn; tô đặc thì rối. Ví dụ `background: color-mix(in srgb, var(--c) 13%, #fff); border-left: 3px solid var(--c)`.
- Chip trạng thái thay cho overlay: góc phải dưới, nhỏ, có spinner khi đang lưu, xanh "✓ Đã lưu" 1,4 s, đỏ khi lỗi (bấm được).
  Tránh để nút nổi (FAB) che chip.

## 2. Token màu
Đặt ở `:root`, mọi CSS mới dùng biến — không viết cứng màu brand:

| Biến | Vai trò |
|---|---|
| `--t-pri` / `--t-pri2` | nút chính / hover |
| `--t-ink` | tiêu đề, chữ đậm |
| `--t-soft` / `--t-line` | nền nhấn rất nhạt / viền nhấn nhạt |
| `--t-bg` | nền khu vực lớn (lịch, bảng) |
| `--brand-blue`, `--brand-navy`, `--lb1..3`, `--pale`, `--gray` | các token cũ của app — map vào theme luôn |

Tô nhạt theo biến: `color-mix(in srgb, var(--t-pri) 12%, transparent)` thay cho `rgba(r,g,b,.12)` viết cứng.

## 3. Hệ chủ đề màu
Mẫu đầy đủ ở `assets/theme-kit.html` (10 tông: mặc định, Biển sâu, Ngọc bích, Lá xô thơm, Than chì, Oải hương, Hồng phấn,
Be cát, Đất nung, Rừng thông). Cách hoạt động — và vì sao nó không làm chậm app:
- Mỗi tông là 1 khối `html[data-theme="x"]{--t-pri:…;…}` (độ ưu tiên 0,1,1 > `:root`). Đổi tông = đổi 1 thuộc tính trên
  `<html>` ⇒ trình duyệt chỉ tính lại style (~5–10 ms), không render lại DOM, không gọi mạng.
- Một đoạn `<script>` nhỏ **trong `<head>`** đọc `localStorage` và đặt `data-theme` trước khi trang vẽ ⇒ không nháy màu.
- Nút bảng màu (icon SVG, không emoji) cạnh công tắc ngôn ngữ, mở popover lưới 2 cột: ô 2×2 màu + tên + mô tả, dấu ✓ ở tông
  đang dùng; bấm là đổi ngay, popover vẫn mở để thử tiếp; Esc / bấm ngoài để đóng. Lưu riêng từng máy.
- Ghi chú dưới popover: "màu theo loại lịch / trạng thái giữ nguyên để dễ nhận biết".
Kiểm thử: chụp ảnh mỗi tông (Playwright) và xem lại bằng mắt; đo `THEME.set()` < 20 ms; reload giữ đúng tông.

## 4. Chuyển màu viết cứng sang biến
`python3 scripts/recolor_css.py index.html --map '#3A5CAA=--t-pri' '#003047=--t-ink' …` — chỉ thay **bên trong khối `<style>`**,
bỏ qua phần khai báo `:root{…}`, và đổi `rgba()` của màu nhấn sang `color-mix`. Không thay màu trong chuỗi JS: đó thường là
màu dữ liệu (biểu đồ, avatar, loại việc) hoặc CSS inline của email — phải giữ cố định. Sau khi thay, chụp lại vài màn hình
ở 2 tông khác nhau để chắc không sót chỗ "xanh cứng" (thường là ô "hôm nay" trên lịch, hover, focus ring).

## 5. Hộp thoại, thông báo, popup
- Thông báo = thẻ trắng, viền mảnh, tiêu đề màu mực, không header gradient.
- Form sửa nhanh nên mở **tại chỗ** (trong ngăn chi tiết đang mở) thay vì modal mới: nút nhỏ "✏️ Sửa" ở góc trên, form có
  chân dính (sticky footer) với "Xoá" (chữ đỏ, bên trái), "Huỷ", "Lưu".
- Khung chi tiết nên chia ô thông tin (thời gian, địa điểm, đối tác…), chỉ số có thanh tiến độ, link thành nút — thay vì một
  bảng key/value dài và tiêu đề to kiểu "Sửa bài đăng …".
- Nhiều popup khi đăng nhập phải **xếp hàng**, không chồng nhau. Thứ tự gợi ý: Thông báo cập nhật → Nhắc hạn → Việc mới được
  giao → Thư nhắc việc. Cách làm: popup sau bọc hàm `open` của popup cuối chuỗi; nếu popup trước còn mở thì đặt cờ
  `pending` + callback `after` để mở khi popup trước đóng.

## 6. Phản hồi thực tế đã nhận
- "Quá màu mè, rối mắt" ⇒ giảm nền màu, bỏ gradient, chữ Aptos.
- Ngay sau đó "màu lịch nhạt quá, khó nhìn" ⇒ tăng lên vạch đậm + nền ~13%. Bài học: thay đổi màu theo bước nhỏ, gửi ảnh
  chụp trước/sau cho người dùng duyệt.
- "Chữ to kiểu 'Sửa bài đăng…' xấu" ⇒ nút nhỏ ở header, tiêu đề vẫn là tên đối tượng.
