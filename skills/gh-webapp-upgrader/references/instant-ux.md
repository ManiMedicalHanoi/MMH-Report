# Thao tác "không chờ"

## Mục lục
1. Ngân sách thời gian
2. Mẫu "lạc quan" (optimistic) cho thêm / sửa / xoá
3. Số tạm và phụ thuộc (thêm cha rồi thêm con ngay)
4. Sổ ghi nhớ chống dữ liệu cũ (ledger / overlay)
5. Danh mục lưu sẵn — form mở tức thì
6. Mở app tức thì từ cache
7. Làm mới nền mà không giật
8. Danh sách kiểm tra

## 1. Ngân sách thời gian
- Phản hồi thị giác cho mọi cú bấm: < 100 ms (thẻ hiện, form đóng, nút đổi trạng thái).
- Form / ngăn chi tiết mở: < 150 ms, **không** có màn hình "Đang tải danh mục…".
- Ghi xuống Google Sheet: 2–15 s (Apps Script khởi động nguội, LockService) — người dùng không được phải chờ khoảng này.
Đo bằng Playwright: bọc lời gọi trong `{ }` để `evaluate` không chờ Promise, rồi kiểm tra DOM ngay sau đó.

## 2. Mẫu lạc quan
```js
function doAddItem(o){
  var tmp = "tmp-" + Date.now().toString(36) + "-" + (++seq);
  var item = { no: tmp, __tmp: true, __pending: true, name: o.name, /* … */ };
  S.items.push(item); render(); flash(tmp);                 // 1. hiện ngay, nhãn nhỏ "⏳ đang lưu"
  toast("✓ Đã thêm “" + o.name + "” — đang lưu…");
  return apiPost({ action: "addItem", name: o.name, __tmp: tmp })   // 2. hàng đợi ghi (outbox.md)
    .then(function(r){ item.no = String(r.no); item.__tmp = item.__pending = false; render(); });
  // Lỗi thật: hàng đợi giữ thay đổi + chip đỏ (Thử lại / Bỏ). "Bỏ" ⇒ promise reject ⇒ gỡ item khỏi giao diện.
}
```
- Sửa: vá trường trên object tại chỗ → vẽ lại → gửi. Lỗi khi đang mở form ⇒ mở lại form **với giá trị đã gõ** + dòng lỗi.
- Xoá: gỡ khỏi giao diện ngay → gửi; lỗi thật ⇒ trả lại.
- Nút bấm 2 lần: khoá nút ngay khi bấm (`btn.disabled=true`) — trước đây chính việc chờ lâu khiến người dùng bấm lại và sheet
  có 2–3 dòng trùng.

## 3. Số tạm và phụ thuộc
Người dùng hay "thêm Key task rồi thêm Sub-task ngay". Đừng để thao tác con **chờ** cha rồi mới gọi `apiPost` (vì lúc đó biến
URL backend có thể đã đổi, và nếu cha trả về không chắc thì con bị huỷ). Thay vào đó: xếp hàng con **ngay** với số tạm của cha
(`keyNo: "tmp-…"`); hàng đợi chạy tuần tự nên cha luôn được ghi trước, và tự thay số tạm bằng số thật lúc gửi con. Các thao tác
khác trên đối tượng còn mang số tạm (sửa, đổi trạng thái) cũng xếp hàng ngay theo cách đó. Lưu bảng `tmp → số thật` vào
`localStorage` (2 ngày) để còn dùng sau khi tải lại trang.

## 4. Sổ ghi nhớ chống dữ liệu cũ
Sau khi ghi, lần đọc nền kế tiếp có thể trả dữ liệu **chưa có** dòng vừa thêm (hoặc vẫn còn dòng vừa xoá). Nếu thay thẳng
dữ liệu ⇒ thẻ "nhảy". Cách chữa (hai lớp):
- **Ledger trong phiên** (3 phút): ghi `{kind:"add"|"del", obj|no+name, t}` khi thao tác; mỗi lần dữ liệu máy chủ về
  (bọc hàm `setItems`) thì chèn lại các mục "add" chưa thấy trên máy chủ và gỡ các mục "del" máy chủ còn trả. Mục được xác
  nhận (máy chủ đã có / đã mất) thì xoá khỏi ledger.
- **Overlay từ hàng đợi ghi**: các lệnh còn trong outbox (kể cả sau khi tải lại trang) được áp lại lên dữ liệu mới: thêm ⇒ chèn
  bản tạm; sửa ⇒ vá trường; xoá ⇒ gỡ (chỉ khi tên khớp `expect`).
- Khi còn lệnh ghi đang chờ cho nguồn hiện tại ⇒ hoãn "làm mới nhẹ" (đếm `S._inflight`), vì giao diện đang đúng hơn máy chủ.
So khớp theo tên đã chuẩn hoá (bỏ dấu, chữ thường, gộp khoảng trắng) + PIC, không chỉ theo số.

## 5. Danh mục lưu sẵn
Dropdown lấy từ sheet (Data validation, danh sách điểm đến, danh bạ…) thường là nguyên nhân của màn hình chờ khi mở form.
```js
function opts(kind){ return merge(lsGet("app_opts_"+kind), uniqueValuesFromCurrentData(kind)); }   // có ngay
function loadOpts(kind, force){ if(!force && fresh(kind, 6*3600e3)) return; jsonp({action:"options",kind:kind})
  .then(function(r){ lsSet("app_opts_"+kind, r.options); refreshOpenForm(kind); }); }        // làm mới ngầm
```
- Mở form bằng `opts()` ngay; khi bản mới về, chỉ cập nhật `<datalist>`/`<select>` và giữ nguyên lựa chọn đang gõ.
- Chưa từng có cache ⇒ dùng giá trị suy ra từ dữ liệu đang có + danh bạ; vẫn mở form ngay, ghi chú nhỏ nếu tải lỗi.
- Tải trước 3–5 s sau đăng nhập (sau khi màn hình chính đã vẽ).
- Xem chi tiết một bản ghi phải gọi máy chủ: vẽ ngay từ lần xem trước (`localStorage`, ≤ 40 mục) hoặc từ dữ liệu lịch đang
  có, đánh dấu phần chưa chắc ("⏳ đang lấy chi phí & báo cáo mới nhất…"), rồi thay bằng bản mới nếu người dùng chưa gõ gì.

## 6. Mở app tức thì
Lưu bản rút gọn của lần tải trước (`localStorage`, nhớ giới hạn ~5 MB/tên miền — cắt bớt trường dài) ⇒ mở app vẽ ngay < 0,3 s,
đồng thời tải bản mới rồi cập nhật âm thầm. Nhớ nguồn/phòng ban lần trước để không phải tải 2 lượt. Tải sẵn các nguồn khác
sau đăng nhập để chuyển tab là hiện liền.

## 7. Làm mới nền không giật
- Hỏi "vân tay dữ liệu" rất nhẹ (`action=version`) mỗi 12–20 s và khi quay lại tab; chỉ khi đổi mới tải danh sách.
- Đang gõ chữ / đang mở hộp thoại ⇒ nạp dữ liệu nhưng **hoãn vẽ lại**; vẽ khi người dùng rời ô nhập (sau ~2,5 s).
- Vẽ lại giữ vị trí cuộn, bộ lọc, tab, mục đang mở.
- Gộp nhiều lần làm mới trong 1–3 s thành 1.

## 8. Danh sách kiểm tra trước khi push
- [ ] Thêm/sửa/xoá hiện ngay (< 150 ms) ở mọi màn hình liên quan (lịch, bảng, danh sách).
- [ ] Backend chậm 4 s + dữ liệu cũ 15 s: không nhảy, không trùng.
- [ ] Lỗi ghi: dữ liệu cũ được trả lại hoặc giữ kèm chip đỏ; chữ đã gõ không mất.
- [ ] Không còn chuỗi "Đang tải…" trong luồng thao tác chính (grep để kiểm).
