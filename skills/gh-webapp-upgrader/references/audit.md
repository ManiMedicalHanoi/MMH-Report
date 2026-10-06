# Đánh giá tổng thể một webapp (audit)

Dùng khi người dùng hỏi "đánh giá hệ thống", "nên cải tiến gì", hoặc trước khi nhận một repo lạ.

## Thu thập số liệu (≈ 5 phút, không đọc cả file)
```bash
wc -c index.html; wc -l index.html
grep -c "<script" index.html; grep -c "<style" index.html; grep -c "!important" index.html
grep -o "window\.[A-Za-z0-9_]*\s*=\s*function" index.html | sort | uniq -c | sort -rn | head   # hàm bị bọc nhiều lớp
grep -o "https://script.google.com/macros/s/[A-Za-z0-9_-]*" index.html | sort -u             # số backend
grep -o "localStorage\.\(get\|set\)Item(\"[a-z_0-9]*" index.html | sort -u                    # khoá lưu trên máy
grep -n "Đang tải\|Loading\|overlay(true" index.html | head                                   # màn hình chờ còn lại
grep -n "setInterval" index.html                                                              # polling
git log --oneline | wc -l; ls docs updates
```
Đọc thêm: cách đăng nhập (có xác thực thật không), khoá/bí mật trong JS, repo public hay private, code backend có trong repo
không, có test/CI không.

## Thang chấm (1–10) và câu hỏi chính
| Mảng | Câu hỏi |
|---|---|
| Giao diện | Có hệ token màu / font thống nhất? Nhất quán giữa các màn hình, hộp thoại? Đọc được trên điện thoại? |
| Thao tác & tốc độ | Còn màn hình chờ trong luồng chính? Thêm/sửa/xoá hiện ngay? Mở app từ cache? |
| Tính năng | Đúng nghiệp vụ người dùng? Thiếu gì hay bị dùng vòng (copy tay sang sheet khác)? |
| Kết nối dữ liệu | Bao nhiêu nguồn? Ghi có chống trùng, khoá đúng dòng, thử lại? Biết khi backend lệch phiên bản? |
| Độ tin cậy dữ liệu | Có thể mất thao tác không (đóng tab, mạng yếu)? Có nhật ký ghi? |
| Bảo mật & quyền | Xác thực thật hay chọn tên? Bí mật lộ trong repo public? Quyền sửa kiểm ở đâu (client hay server)? |
| Kiến trúc & bảo trì | Kích thước file, số lớp vá chồng nhau, CSS `!important`, code chết; backend có version control? |
| Kiểm thử & phát hành | Có test tự động / CI? Quy trình phiên bản + thông báo + HDSD? |
| Quan sát (monitoring) | Lỗi phía người dùng có được ghi lại? Biết ai đang dùng bản cũ? |

## Mẫu báo cáo (ngắn, cho người không chuyên)
1. **Tóm tắt 3 dòng**: hệ thống làm tốt gì, rủi ro lớn nhất, việc nên làm ngay.
2. **Bảng điểm** theo các mảng trên, mỗi mảng 1 câu lý do.
3. **Điểm mạnh** (giữ nguyên, đừng phá).
4. **Rủi ro** xếp theo mức độ (dữ liệu / bảo mật trước, thẩm mỹ sau), mỗi rủi ro: biểu hiện người dùng thấy + hậu quả.
5. **Lộ trình** 3 nhóm: *Làm ngay (1–2 tuần)* · *Tiếp theo (1–2 tháng)* · *Dài hạn* — mỗi mục: lợi ích, công sức (S/M/L),
   ai phải làm gì (ví dụ "quản trị Google Workspace đổi quyền web app").
6. Hỏi người dùng muốn bắt đầu từ mục nào.

## Các khuyến nghị hay gặp (kiểm xem áp dụng được không)
- Xác thực thật: web app "Anyone within domain" + `Session.getActiveUser()`; hoặc Google Sign-In + kiểm token ở backend.
- Đưa code `.gs` vào version control (thư mục `backend/` hoặc repo private) + `clasp`; đánh số phiên bản backend, client kiểm.
- Cột ID cố định thay cho số thứ tự dòng; `expect` khi sửa/xoá.
- Tách file: `index.html` → `css/`, `js/` theo module (vẫn GitHub Pages, không cần build) khi file > ~500 KB hoặc > 50 lớp vá.
  Gộp các lớp vá đã ổn định vào hàm gốc theo đợt, kèm test.
- CI: GitHub Actions chạy `check_scripts.py` + bài Playwright với mock trên mỗi PR.
- Ghi lỗi phía client (`window.onerror`, lệnh ghi thất bại) về 1 sheet `_client_log` theo lô.
- PWA nhẹ (manifest + service worker cache tĩnh) để mở trên điện thoại như app, chạy được khi mạng chập chờn.
- Giảm polling: `version` đọc từ `CacheService`, giãn nhịp khi tab ẩn.
- Truy cập: tương phản màu, phím tắt, nhãn cho nút chỉ có icon.
