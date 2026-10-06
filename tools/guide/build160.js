/* HDSD v16.0 — Đăng nhập bằng email công ty + mã 6 số
   Chạy: node tools/guide/cap.js v160gate v160nudge v160menu → node tools/guide/tojpg.js → node tools/guide/build160.js
         → PDF=1 node tools/guide/render.js → copy tools/guide/out.pdf vào docs/ */
const { L, a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v16.0';

/* 1. Bìa */
slide({
  bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">THÔNG BÁO CẬP NHẬT · REPORT HUB v16.0</div>
    <h1>Đăng nhập bằng email công ty<br><span>Mỗi người một tài khoản · Mã 6 số gửi qua email</span></h1>
    <p class="cv-p">Không ai còn vào được Report Hub dưới tên người khác. Nhập email công ty, nhận mã 6 số, nhập mã: xong. Máy của bạn được ghi nhớ 30 ngày.</p>
    <div class="cv-chips"><span>✉ @mani.inc</span><span>✉ @manimedicalhanoi.com</span><span>🔢 Mã 6 số</span><span>🔒 Ghi nhớ 30 ngày</span></div>
    <div class="cv-link">Mở app: ${a(L.app)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 10/2026</div>
  </div>
  <div class="cv-r">${fig({ img: 'v160gate', w: 760, frame: 'browser', crop: [0.3, 0.2, 0.4, 0.78], map: {}, maxH: 560 })}</div>`
});

/* 2. Bước 1 — nhập email */
slide({
  sec: 'ĐĂNG NHẬP', kick: 'BƯỚC 1 / 2', acc: '#3A5CAA', title: 'Nhập email công ty', sub: 'Lần đầu dùng trên máy mới, hoặc sau khi bấm Đăng xuất', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, 'Gõ email công ty: <b>…@mani.inc</b> hoặc <b>…@manimedicalhanoi.com</b>. Chỉ gõ phần trước @ cũng được, app tự thêm <b>@mani.inc</b>.'],
    [2, 'Bấm <b>Gửi mã đăng nhập</b>. Mã 6 số được gửi tới <b>đúng địa chỉ bạn vừa gõ</b>.'],
    [3, 'Chưa đăng nhập được (vd. chưa nhận được email)? Bấm <b>Chọn tên như trước</b>, chỉ dùng tạm đến hết <b>13/10</b>.'],
  ])}
    ${tip('Email báo <b>chưa được cấp quyền</b>: nhắn Admin (Giang – mmh.product) để được thêm vào danh sách.')}</div>
    <div class="col-f">${fig({ img: 'v160gate', w: 520, frame: 'browser', crop: [0.32, 0.26, 0.36, 0.72], maxH: 500 })}</div>
  </div>`
});

/* 3. Bước 2 — nhập mã */
slide({
  sec: 'ĐĂNG NHẬP', kick: 'BƯỚC 2 / 2', acc: '#3A5CAA', title: 'Nhập mã 6 số trong email', sub: 'Mã có hiệu lực 10 phút, mỗi mã chỉ dùng được một lần', body: `
  <div class="two w3">
    <div class="col-t">${steps([
    [1, 'Mở email <b>“Mã đăng nhập MMH Report: ……”</b> → gõ 6 số. Gõ đủ 6 số là app tự đăng nhập, không cần bấm nút.'],
    [2, 'Chưa thấy email sau 1 phút? Xem thư mục <b>Junk / Spam</b> (Outlook: <b>Thư rác</b>), rồi bấm <b>Gửi lại mã</b> (sau 45 giây).'],
  ])}
    ${tip('Sai 5 lần thì mã bị huỷ, bấm Gửi lại mã để nhận mã mới. Không phải bạn yêu cầu mã? Cứ bỏ qua email: không ai vào được nếu không có mã.')}
    ${tip('Đăng nhập xong, máy này được <b>ghi nhớ 30 ngày</b>: mở app là vào thẳng, không phải nhập lại.', 'g')}</div>
    <div class="col-f">${fig({ img: 'v160code', w: 520, frame: 'browser', crop: [0.32, 0.26, 0.36, 0.72], maxH: 500 })}</div>
  </div>`
});

/* 4. Người đang dùng — xác thực trong app */
slide({
  sec: 'ĐANG DÙNG APP', kick: 'MỘT LẦN', acc: '#2F6B4A', title: 'Đang dùng bằng cách chọn tên? Xác thực một lần', sub: 'Không bị đăng xuất. Làm trong khoảng 1 phút, trước ngày 13/10', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, 'Cuối màn hình hiện lời nhắc <b>Xác thực email đăng nhập</b> → bấm <b>Xác thực ngay</b> (hoặc menu tên của bạn → <b>Chưa xác thực email</b>).'],
    [2, 'Nhập email → nhận mã → nhập mã như 2 bước trước. Bạn vẫn ở nguyên màn hình đang làm.'],
    [3, '<b>Để sau</b>: ẩn lời nhắc đến ngày mai.'],
  ])}
    ${tip('Sau ngày <b>13/10</b> Report Hub chỉ còn đăng nhập bằng email. Xác thực sớm để không bị gián đoạn.')}</div>
    <div class="col-f">${fig({ img: 'v160nudge', w: 700, frame: 'browser', crop: [0.2, 0.55, 0.6, 0.45] })}</div>
  </div>`
});

/* 5. Menu + đăng xuất */
slide({
  sec: 'TÀI KHOẢN', acc: '#3A5CAA', title: 'Biết mình đã đăng nhập bằng email nào', sub: 'Bấm vào tên / ảnh đại diện ở góc phải', body: `
  <div class="two">
    <div class="col-t">${steps([
    [1, 'Dòng xanh lá có biểu tượng khiên = <b>đã đăng nhập</b> bằng email này.'],
    [2, '<b>Đăng xuất</b> (trước đây là “Đổi người dùng”): dùng khi trả máy / dùng máy chung. Lần sau phải nhập email và mã lại.'],
  ])}
    <h4 class="h4" style="margin-top:16px">Dành cho Admin (Giang)</h4>
    <ul class="dl"><li>Danh sách người được dùng: sheet <b>RH_Users</b> trong ${a(L.trnSheet, 'file MMH - Training Master')}.</li>
      <li>Thêm người: thêm dòng <b>Email</b> · <b>Pic</b> (đúng tên trong Report Hub) · <b>Level</b>.</li>
      <li>Khoá: bỏ tick <b>Active</b>. Đăng xuất một người khỏi mọi máy: tăng <b>Session</b> thêm 1. Có hiệu lực sau tối đa 2 phút.</li>
      <li>Cột <b>LastLogin</b> cho biết ai đã chuyển sang đăng nhập email.</li></ul></div>
    <div class="col-f">${fig({ img: 'v160menu', w: 480, frame: 'browser', crop: [0.68, 0.0, 0.32, 0.5], maxH: 480 })}</div>
  </div>`
});

writeDeck('MMH Report Hub v16.0 — Đăng nhập bằng email công ty');
