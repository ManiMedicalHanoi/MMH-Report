/* MẪU file nội dung HDSD — copy thành build_vX.Y.js rồi sửa.
   Chạy: node tools/guide/cap.js <cảnh…> → node tools/guide/tojpg.js → node tools/guide/build_vX.Y.js → PDF=1 node tools/guide/render.js
         → copy tools/guide/out.pdf thành docs/HDSD_<Tên>_vX.Y.pdf, đặt guide:"docs/…pdf" trong updates/notes.js */
const { L, a, fig, steps, tip, two, slide, writeDeck, KIT } = require('./deckkit');
KIT.app = 'Tên App'; KIT.ver = 'v1.0'; KIT.when = '01/2026'; KIT.url = 'org.github.io/app'; KIT.title = 'Hướng dẫn sử dụng';
L.app = 'https://org.github.io/app/';
L.sheet = 'https://docs.google.com/spreadsheets/d/…';      /* link nguồn dữ liệu — luôn đưa hyperlink vào HDSD */

/* 1. Bìa */
slide({ bare: true, cls: 'cover', body: `
  <div class="cv-l">
    <div class="cv-tag">THÔNG BÁO CẬP NHẬT · ${KIT.ver}</div>
    <h1>Tên tính năng<br><span>Một dòng lợi ích chính cho người dùng</span></h1>
    <p class="cv-p">2–3 câu: tính năng giải quyết việc gì, ai dùng, kết quả ra sao.</p>
    <div class="cv-chips"><span>✓ Điểm 1</span><span>✓ Điểm 2</span><span>✓ Điểm 3</span></div>
    <div class="cv-link">Mở app: ${a(L.app)}</div>
  </div>
  <div class="cv-r">${fig({ img: 'main', w: 760, frame: 'browser', crop: [0, 0, 1, 0.86], map: {} })}</div>` });

/* 2. Một bước thao tác: chữ bên trái, ảnh có số chú thích bên phải (số trong steps khớp số trên ảnh) */
slide({ sec: 'TÍNH NĂNG', kick: 'BƯỚC 1 / 2', title: 'Làm việc X', sub: 'Ai dùng · khi nào dùng', body: two(
  steps([[1, 'Bấm <b>…</b> ở góc trên.'], [2, 'Điền <b>…</b> rồi bấm <b>Lưu</b>.'], [3, 'Kết quả hiện ngay trên lịch; dữ liệu ghi vào ' + a(L.sheet, 'file nguồn') + '.']])
  + tip('Mẹo / lưu ý quan trọng.'),
  fig({ img: 'main', w: 560, frame: 'card', maxH: 470 })) });

/* 3. Câu hỏi thường gặp */
slide({ sec: 'HỎI ĐÁP', title: 'Câu hỏi thường gặp', body: `<div class="qag">
  <div class="qa"><h4>Bấm lưu xong có cần chờ không?</h4><p>Không. Thay đổi hiện ngay; góc phải dưới báo “Đang lưu…” rồi “✓ Đã lưu”.</p></div>
  <div class="qa"><h4>Mạng yếu thì sao?</h4><p>App tự thử lại. Đóng app khi chưa lưu xong thì lần mở sau tự gửi tiếp.</p></div>
  <div class="qa"><h4>Thấy nút đỏ “chưa lưu được”?</h4><p>Bấm vào để xem lý do, chọn Thử lại hoặc Bỏ.</p></div></div>` });

writeDeck('HDSD Tên tính năng ' + KIT.ver);
