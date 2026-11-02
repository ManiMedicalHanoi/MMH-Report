/* HDSD "Báo cáo KPI FY68 theo Quy trình MMHSOP_009" — Report Hub v19.2 / CRM v34.9 (ảnh thật từ app, dữ liệu giả lập).
   Ảnh: node tools/guide/cap_kpi.js → node tools/guide/tojpg.js (+ ảnh Word / Total KPI chép vào shots/k_*.jpg)
   Dựng: node tools/guide/build_kpi.js → PDF=1 node tools/guide/render.js → docs/HDSD_Bao_cao_KPI_FY68.pdf */
const { L, a, fig, steps, slide, tip, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'Report Hub v19.2 · CRM v34.9'; KIT.app = 'Hướng dẫn KPI FY68'; KIT.foot = 'Quy trình quản lý KPI MMHSOP_009'; KIT.when = '11/2026';
const br = (img, w, crop, maxH) => fig({ img, w, frame: 'browser', crop, maxH });
const card = (img, w, crop, maxH) => fig({ img, w, frame: 'card', crop, maxH });
const CRM = 'https://manimedicalhanoi.github.io/MMH-CRM/';
const A1 = '#3A5CAA', A2 = '#2F6B4A', A3 = '#8A5A12', A4 = '#5B4A8A';

/* thành phần riêng của tài liệu này */
const CSS = `<style>
.fl{display:flex;align-items:stretch;gap:0}
.srcs{display:flex;flex-direction:column;gap:7px;width:470px}
.sr{border:1px solid #DCE4EE;border-radius:10px;padding:7px 12px;background:#fff;display:grid;grid-template-columns:150px 1fr;gap:2px 12px;font-size:12.5px;line-height:1.35}
.sr b{color:#1F3A52;font-size:13px}.sr i{font-style:normal;color:#5F7387}.sr em{font-style:normal;grid-column:2;color:#2F64A0;font-weight:700;font-size:11.5px}
.arw{width:56px;display:flex;align-items:center;justify-content:center;color:#9DB4CC;font-size:34px;font-weight:300}
.hubx{width:210px;border-radius:14px;background:#1F3A52;color:#fff;padding:18px 16px;display:flex;flex-direction:column;justify-content:center;gap:8px}
.hubx h4{font-size:17px}.hubx p{font-size:12.5px;line-height:1.5;color:#CFE0F0}
.dst{width:300px;display:flex;flex-direction:column;gap:12px;justify-content:center}
.dst div{border:2px solid #3A5CAA;border-radius:12px;padding:12px 14px;font-size:12.5px;line-height:1.5;color:#2B455C;background:#F3F7FC}
.dst div b{display:block;color:#1F3A52;font-size:14px;margin-bottom:2px}
.dst .mg{border-color:#2F6B4A;background:#F1F8F3}
.lane{display:grid;grid-template-columns:150px repeat(4,1fr);gap:8px;margin-bottom:8px}
.lane .rl{font-size:12px;font-weight:800;letter-spacing:.6px;color:#5F7387;display:flex;align-items:center}
.lane .st{border:1px solid #DCE4EE;border-radius:10px;padding:9px 11px;font-size:12.5px;line-height:1.42;color:#2B455C;background:#fff;min-height:64px}
.lane .st b{color:#1F3A52}.lane .st .d{display:inline-block;font-size:11px;font-weight:800;color:#fff;background:#3A5CAA;border-radius:6px;padding:1px 7px;margin-bottom:4px}
.lane .st.q .d{background:#2F6B4A}.lane .st.em{background:transparent;border:1px dashed #E3E8EE}
.lhd{display:grid;grid-template-columns:150px repeat(4,1fr);gap:8px;margin:2px 0 6px}
.lhd span{font-size:12px;font-weight:800;color:#1F3A52;background:#EEF3F9;border-radius:8px;padding:6px 10px}
.lhd span:first-child{background:none;padding-left:0;color:#5F7387}
.ck{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.ck>div{border:1px solid #DCE4EE;border-radius:12px;padding:14px;background:#fff;display:flex;flex-direction:column;gap:6px}
.ck h4{font-size:13px;color:#fff;background:var(--c,#3A5CAA);border-radius:7px;padding:4px 9px;align-self:flex-start}
.ck p{font-size:12.8px;line-height:1.5;color:#2B455C}.ck p b{color:#1F3A52}
.ck ul{list-style:none;display:flex;flex-direction:column;gap:6px}.ck li{font-size:12.8px;line-height:1.45;color:#2B455C;padding-left:16px;position:relative}
.ck li:before{content:"";position:absolute;left:2px;top:7px;width:7px;height:7px;border-radius:2px;background:var(--c,#3A5CAA)}
.big3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.big3>div{border:1px solid #DCE4EE;border-radius:14px;padding:18px 18px 16px;background:#fff}
.big3 .n{width:34px;height:34px;border-radius:50%;background:#FFD400;color:#1F3A52;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:16px}
.big3 h4{font-size:17px;color:#1F3A52;margin:10px 0 6px}.big3 p{font-size:13.5px;line-height:1.55;color:#2B455C}
.tbl{width:100%;border-collapse:collapse;font-size:12.8px;line-height:1.45;color:#2B455C}
.tbl th{background:#EEF3F9;color:#1F3A52;text-align:left;padding:7px 10px;font-size:12px}
.tbl td{border-bottom:1px solid #E6EBF1;padding:7px 10px;vertical-align:top}.tbl td b{color:#1F3A52}
.faq{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px}
.faq div{border:1px solid #DCE4EE;border-radius:12px;padding:12px 14px;background:#fff}
.faq h4{font-size:14px;color:#1F3A52;margin-bottom:4px}.faq p{font-size:12.8px;line-height:1.5;color:#2B455C}
.tl{display:grid;grid-template-columns:110px repeat(5,1fr);gap:8px;align-items:stretch;margin-top:10px}
.tl .h{font-size:12px;font-weight:800;color:#5F7387;letter-spacing:.6px;display:flex;align-items:center}
.tl .c{border-top:4px solid var(--c,#3A5CAA);background:#F6F8FB;border-radius:0 0 10px 10px;padding:9px 11px;font-size:12.5px;line-height:1.42;color:#2B455C}
.tl .c b{display:block;color:#1F3A52;font-size:15px;margin-bottom:1px}
.stack{display:flex;flex-direction:column;gap:14px;align-items:flex-end}
</style>`;

/* 1 · bìa */
slide({ bare: true, cls: 'cover', body: CSS + `
  <div class="cv-l">
    <div class="cv-tag">HƯỚNG DẪN · KPI FY68 · MMHSOP_009</div>
    <h1>Báo cáo KPI<br>tháng &amp; quý<span>Gửi – nhận – phê duyệt trên Report Hub / CRM</span></h1>
    <p class="cv-p">FY68: mọi KPI tự liên kết từ file hoạt động của từng nhóm. Nhân viên giữ file hoạt động đúng và đủ, gửi báo cáo trước ngày 05; quản lý xem và xác nhận.</p>
    <div class="cv-chips"><span>FM01 · KPI tháng</span><span>FM02 · KPI quý</span><span>Hạn ngày 05</span><span>Tự liên kết</span></div>
    <div class="cv-link">Report Hub: ${a(L.app)}<br>CRM: ${a(CRM)}</div>
    <div class="cv-by">Product Team · MANI Medical Hanoi · 11/2026 · hình minh hoạ dùng dữ liệu giả lập</div>
  </div>
  <div class="cv-r">${br('k_fm01', 720)}</div>` });

/* 2 · 3 điều cần nhớ */
slide({ sec: 'TÓM TẮT', acc: A1, title: '3 điều cần nhớ', sub: 'Áp dụng cho mọi nhân viên MMH từ 01/10/2026 (Quy trình quản lý KPI MMHSOP_009)', body: `
  <div class="big3">
    <div><span class="n">1</span><h4>KPI tự liên kết</h4><p>FY68: KPI được tính trên <b>file hoạt động của từng nhóm</b> (CRM, file MKT, Training, Back Office, Turnover) và tự đẩy sang file <b>MMH KPI FY68</b>. Không ai gõ tay số KPI.</p></div>
    <div><span class="n">2</span><h4>Hạn ngày 05</h4><p><b>Ngày 05</b> mỗi tháng: Báo cáo KPI tháng (FM01) cho tháng trước.<br><b>Ngày 05 tháng đầu quý</b>: Báo cáo KPI quý (FM02). App nhắc đúng ngày.</p></div>
    <div><span class="n">3</span><h4>Gửi trên app</h4><p>Report Hub / CRM ▸ <b>Gửi báo cáo</b> ▸ Báo cáo KPI tháng / quý. Email tự gửi <b>To Trưởng bộ phận + Tổng Giám đốc, CC Kế toán</b>, kèm file Word đúng biểu mẫu.</p></div>
  </div>
  <div class="two" style="margin-top:18px;height:auto;gap:16px">
    ${tip('<b>Nhân viên</b>: cập nhật file hoạt động hằng ngày → kiểm tra KPI trên app → ghi lý do từng chỉ tiêu → gửi. <b>Quản lý</b>: xem số liệu, phản hồi email trong 02 ngày làm việc, ký báo cáo quý.')}
    ${tip('Nhóm Việt Nam (Sales, Marketing, Back Office…) dùng biểu mẫu <b>tiếng Việt</b>. Nhóm Thái Lan dùng biểu mẫu <b>tiếng Anh</b> — app tự chọn.', 'pur')}
  </div>
  <div class="tl"><div class="h">THÁNG</div>
    <div class="c"><b>Ngày 01 – 04</b>Xem KPI tháng trước trên app, sửa file nguồn nếu số chưa đúng.</div>
    <div class="c" style="--c:#C0504D"><b>Ngày 05</b>Hạn gửi FM01 (T7 / CN ⇒ app nhắc thứ Sáu trước).</div>
    <div class="c"><b>+ 02 ngày làm việc</b>Trưởng bộ phận phản hồi qua email.</div>
    <div class="c" style="--c:#C8D3DF"><b>Không cần ký</b>Báo cáo tháng chỉ cần email phản hồi.</div>
    <div class="c" style="--c:#C8D3DF"><b>Kế toán</b>Ghi nhận đúng hạn / muộn theo giờ gửi.</div></div>
  <div class="tl"><div class="h">QUÝ</div>
    <div class="c" style="--c:#2F6B4A"><b>Ngày 05</b>Tháng đầu quý kế tiếp: gửi FM02 (+ FM01 tháng cuối quý).</div>
    <div class="c" style="--c:#2F6B4A"><b>Ngày 10</b>Trưởng bộ phận + Kế toán kiểm tra xong.</div>
    <div class="c" style="--c:#2F6B4A"><b>Ngày 14</b>Trưởng bộ phận và Tổng Giám đốc ký xong.</div>
    <div class="c" style="--c:#2F6B4A"><b>≤ 10 ngày</b>Trả bản đã ký cho nhân viên.</div>
    <div class="c" style="--c:#2F6B4A"><b>Trong tháng</b>Kế toán lưu hồ sơ, trình tính thưởng quý.</div></div>` });

/* 3 · FY68 tự liên kết */
slide({ sec: 'THAY ĐỔI FY68', acc: A2, title: 'KPI lấy từ file hoạt động của từng nhóm', sub: 'Sửa đúng ở file nguồn ⇒ file KPI công ty tự cập nhật (vài phút, đọc lại toàn bộ 15 phút / lần)', body: `
  <div class="fl">
    <div class="srcs">
      <div class="sr"><b>Sales · CRM nhóm</b><i>Mở mới, viếng thăm, đơn hàng, thuyết trình, T&amp;E</i><em>tab 9. TARGET &amp; KPI · C1–C7, C10</em></div>
      <div class="sr"><b>Doanh số · Turnover</b><i>Doanh số NPP theo mảng / thị trường, sản phẩm mới</i><em>F0–F6 (theo tháng kế toán chốt)</em></div>
      <div class="sr"><b>MKT Offline</b><i>Sự kiện, người tham dự đủ điều kiện, hỗ trợ bán hàng</i><em>tab KPI MKT Offline · C8, C9, C12, C15</em></div>
      <div class="sr"><b>MKT Online (Digital)</b><i>Bài đăng, thiết kế, quảng cáo</i><em>tab KPI MKT Online · C17</em></div>
      <div class="sr"><b>Đào tạo · Training Master</b><i>Buổi đào tạo nội bộ, Coaching, đào tạo khách hàng</i><em>tab KPI TRAINING FY68 · L1, L2, C3-10/11</em></div>
      <div class="sr"><b>Back Office Tracking</b><i>Chứng từ, đơn hàng, tồn kho, dự án, tài chính</i><em>tab KPI Back Office · P1–P5</em></div>
      <div class="sr"><b>KBI report</b><i>Điểm hành vi (100 + điểm cộng / trừ)</i><em>Detail report · L3</em></div>
    </div>
    <div class="arw">›</div>
    <div class="hubx"><h4>KPI Sync Center</h4><p>Tự đọc các file nguồn, tính Actual theo 4. Rule, ghi vào <b>3. Detail KPI</b> và <b>5. Member KPI Monthly</b>.</p><p>Không nhập tay. Không sửa công thức.</p></div>
    <div class="arw">›</div>
    <div class="dst">
      <div><b>MMH KPI FY68</b>Target · Actual · % · trọng số của từng người, từng tháng / quý.</div>
      <div><b>Report Hub / CRM ▸ KPI</b>Nhân viên xem KPI của mình, tạo báo cáo FM01 / FM02 từ đúng số này.</div>
      <div class="mg"><b>Quản lý: chỉ XEM và XÁC NHẬN</b>Số sai ⇒ báo nhóm sửa ở file hoạt động, không gõ đè trên file KPI công ty.</div>
    </div>
  </div>` });

/* 4 · quy trình tổng */
slide({ sec: 'QUY TRÌNH', acc: A1, title: 'Quy trình tổng: gửi – nhận – phê duyệt', sub: 'Ai làm gì, khi nào — báo cáo tháng (xanh dương) và báo cáo quý (xanh lá)', body: `
  <div class="lhd"><span></span><span>Ngày 01 – 05</span><span>Trong 02 ngày làm việc</span><span>Ngày 06 – 14</span><span>Sau khi ký</span></div>
  <div class="lane"><div class="rl">NHÂN VIÊN</div>
    <div class="st"><span class="d">THÁNG</span><br><b>Gửi FM01</b> tháng trước trên app (lý do từng chỉ tiêu, hành động tháng tới).</div>
    <div class="st">Trả lời / bổ sung khi Trưởng bộ phận hỏi (gửi lại bản sửa).</div>
    <div class="st q"><span class="d">QUÝ</span><br>Ngày 05 tháng đầu quý: <b>gửi FM02</b> (tự đánh giá năng lực + mức EE/AE/PA/NA).</div>
    <div class="st">Nhận bản FM02 đã ký. <b>Xác nhận bảng tổng hợp nộp báo cáo</b> của Kế toán.</div></div>
  <div class="lane"><div class="rl">TRƯỞNG BỘ PHẬN</div>
    <div class="st em"></div>
    <div class="st"><b>Phản hồi email</b> FM01 / FM02 (kể cả bản sửa). Báo cáo tháng không cần ký.</div>
    <div class="st q"><span class="d">QUÝ</span><br>Kiểm tra số cùng Kế toán (<b>xong ngày 10</b>), chấm năng lực, <b>ký</b> rồi chuyển Tổng Giám đốc.</div>
    <div class="st">Trả FM02 đã ký cho nhân viên trong <b>10 ngày</b>.</div></div>
  <div class="lane"><div class="rl">TỔNG GIÁM ĐỐC</div>
    <div class="st em"></div>
    <div class="st">Nhận email (To). Xem KPI toàn công ty trên Total KPI.</div>
    <div class="st q"><span class="d">QUÝ</span><br><b>Ký</b> trong 02 ngày làm việc sau khi nhận — mọi báo cáo quý xong <b>trước ngày 14</b>.</div>
    <div class="st">Duyệt thưởng quý.</div></div>
  <div class="lane"><div class="rl">KẾ TOÁN</div>
    <div class="st">Nhận bản CC mọi báo cáo.</div>
    <div class="st">Đối chiếu số với file KPI và file nguồn.</div>
    <div class="st q"><span class="d">QUÝ</span><br>Tính <b>tỉ lệ nộp trễ / thiếu</b> (tuần, công tác, KPI) — app Thống kê gửi báo cáo.</div>
    <div class="st">Gửi kết quả cho Tổng Giám đốc tính thưởng. <b>Lưu hồ sơ</b> trong tháng.</div></div>
  ${tip('Tháng cuối quý gửi <b>cả</b> FM01 (tháng) và FM02 (quý). Thưởng quý chỉ tính khi FM02 đã được Trưởng bộ phận và Tổng Giám đốc ký đủ.')}` });

/* 5 · việc của nhân viên */
slide({ sec: 'NGƯỜI THỰC HIỆN', acc: A3, title: 'Việc của bạn để theo kịp quy trình', sub: 'Mỗi tháng 5 việc — phần lớn đã có sẵn trên app', body: `
  <div class="ck">
    <div style="--c:#3A5CAA"><h4>Hằng ngày / tuần</h4><ul>
      <li>Cập nhật <b>file hoạt động</b> của nhóm: CRM (đi địa bàn có ảnh, đơn hàng có chứng từ, Mở mới, thuyết trình), file MKT, Training Hub, Back Office.</li>
      <li>Gửi báo cáo tuần đúng hạn.</li></ul></div>
    <div style="--c:#2F6B4A"><h4>Cuối tháng</h4><ul>
      <li>Mở <b>KPI</b> trên app, xem Target · Actual · % từng chỉ tiêu.</li>
      <li>Số chưa đúng ⇒ sửa ở file nguồn (hoặc báo người phụ trách file), đợi vài phút.</li></ul></div>
    <div style="--c:#8A5A12"><h4>Trước ngày 05</h4><ul>
      <li><b>Gửi báo cáo ▸ Báo cáo KPI tháng (FM01)</b>.</li>
      <li>Ghi lý do đạt / chưa đạt từng chỉ tiêu, hành động tháng tới, điểm nổi bật, khó khăn, hỗ trợ cần thiết.</li>
      <li>Gửi thử cho mình → Gửi chính thức.</li></ul></div>
    <div style="--c:#5B4A8A"><h4>Đầu quý (ngày 05)</h4><ul>
      <li><b>Báo cáo KPI quý (FM02)</b>: A. KPI tự điền (tối đa 130%, trừ KPI doanh số).</li>
      <li>B. tự chấm 5 năng lực (1–5) · C. tự đánh giá EE / AE / PA / NA.</li></ul></div>
    <div style="--c:#5F7387"><h4>Sau khi gửi</h4><ul>
      <li>Trả lời email của Trưởng bộ phận, gửi bản sửa nếu được yêu cầu.</li>
      <li>Nhận FM02 đã ký; xác nhận bảng tổng hợp nộp báo cáo của Kế toán.</li></ul></div>
  </div>
  ${tip('Báo cáo nộp trễ / thiếu (tuần, công tác, KPI) &gt; 10% số báo cáo phải nộp trong quý ⇒ chỉ nhận 80% thưởng; &gt; 50% ⇒ không có thưởng quý.', 'red')}
  <div class="tl" style="grid-template-columns:110px repeat(4,1fr)"><div class="h">VÍ DỤ · Q1 FY68</div>
    <div class="c"><b>05/10/2026</b>FM01 tháng 09/2026.</div>
    <div class="c"><b>05/11/2026</b>FM01 tháng 10/2026.</div>
    <div class="c" style="--c:#2F6B4A"><b>04/12/2026 (thứ Sáu)</b>App nhắc trước vì 05/12 là thứ Bảy.</div>
    <div class="c" style="--c:#2F6B4A"><b>05/12/2026</b>FM01 tháng 11/2026 <u>và</u> FM02 quý 1 FY68 (09 – 11/2026).</div></div>` });

/* 6 · xem KPI */
slide({ sec: 'BƯỚC 1', kick: 'NHÂN VIÊN', acc: A2, title: 'Xem KPI của bạn trước khi báo cáo', sub: 'Report Hub ▸ menu Tổng quan ▸ KPI (CRM: menu KPI)', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Chọn kỳ <b>Tháng · Quý · Năm</b> và tháng cần xem.'],
    [2, '<b>Số liệu lúc …</b>: giờ file KPI cập nhật gần nhất. Bấm ↻ để tải lại.'],
    [3, '<b>Báo cáo KPI tháng</b>: mở biểu mẫu FM01 với số của tháng đang chọn.'],
    [4, '<b>Báo cáo KPI quý</b>: mở biểu mẫu FM02.'],
    [5, 'Quản lý / Tổng Giám đốc có thêm <b>Total KPI công ty</b>.'],
  ])}${tip('Màu % theo file KPI: &lt; 90% xám · 90–&lt;100% xanh · 100–120% vàng · &gt; 120% xanh lá. Tháng kế toán chưa chốt doanh số ghi <b>Chưa chốt</b>.')}</div>
  <div class="col-f">${br('k_kpi', 760, [0, 0, 1, 0.9])}</div></div>` });

/* 7 · mở báo cáo */
slide({ sec: 'BƯỚC 2', kick: 'NHÂN VIÊN', acc: A1, title: 'Mở Báo cáo KPI', sub: 'Có 3 lối vào — chọn lối nào cũng ra cùng một biểu mẫu', body: `
  <div class="two"><div class="col-t" style="max-width:420px">${steps([
    [1, 'Lịch làm việc ▸ <b>Gửi báo cáo</b> ▸ <b>Báo cáo KPI tháng (FM01)</b>.'],
    [2, 'Hoặc <b>Báo cáo KPI quý (FM02)</b> ở cùng menu.'],
    ['★', 'Ngày 05 (rơi vào T7 / CN ⇒ thứ Sáu trước) app <b>tự nhắc</b> khi đăng nhập ▸ bấm <b>Mở báo cáo KPI tháng</b>. Đã gửi thì không nhắc nữa.'],
    ['⌘', 'Ctrl / ⌘ + K ▸ gõ “kpi” ▸ chọn báo cáo.'],
  ])}${tip('CRM: <b>Gửi báo cáo</b> ▸ KPI ▸ Báo cáo KPI tháng · Báo cáo KPI quý.')}</div>
  <div class="col-f"><div class="stack">${card('k_menu', 560)}${card('k_popup', 470)}</div></div></div>` });

/* 8 · FM01 */
slide({ sec: 'BƯỚC 3', kick: 'FM01 · KPI THÁNG', acc: A3, title: 'Điền Báo cáo KPI tháng', sub: 'Bên trái: nội dung · bên phải: đúng bản email sẽ gửi (cập nhật khi gõ)', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Chọn <b>người báo cáo</b> và <b>tháng</b>; xem hạn gửi.'],
    [2, '<b>Gửi tới / CC</b> đã điền sẵn theo quy trình: Trưởng bộ phận + Tổng Giám đốc, CC Kế toán.'],
    [3, 'Xem trước email: bảng <b>1. Tổng hợp kết quả KPI</b> lấy từ file KPI.'],
    [4, '<b>Gửi thử cho tôi</b>: email về hộp thư của bạn để kiểm tra.'],
    [5, '<b>Gửi báo cáo KPI tháng</b>: gửi chính thức (kèm file Word FM01).'],
  ])}</div>
  <div class="col-f">${br('k_fm01', 780)}</div></div>` });

/* 9 · lý do + hành động */
slide({ sec: 'BƯỚC 3', kick: 'FM01 · KPI THÁNG', acc: A3, title: 'Ghi lý do và hành động tháng tới', sub: 'Các ô bắt buộc — thiếu thì app không cho gửi', body: `
  <div class="two w3"><div class="col-t">${steps([
    ['A', '<b>Lý do đạt / chưa đạt</b> cho TỪNG chỉ tiêu có số thực tế (ô dưới mỗi KPI).'],
    [1, '<b>Hành động tháng tới</b>: việc cụ thể để cải thiện / giữ kết quả.'],
    [2, '<b>Điểm nổi bật</b> trong tháng.'],
    [3, '<b>Khó khăn</b> và chỉ tiêu bị ảnh hưởng.'],
    [4, '<b>Hỗ trợ cần thiết</b> + bộ phận có thể hỗ trợ. Để trống = “Không có”.'],
  ])}${tip('Nháp tự lưu trên máy. Đóng hộp rồi mở lại vẫn còn nội dung đã gõ.')}</div>
  <div class="col-f">${card('k_fm01b', 450, [0, 0.12, 1, 0.85])}</div></div>` });

/* 10 · xác nhận gửi */
slide({ sec: 'BƯỚC 4', kick: 'GỬI CHÍNH THỨC', acc: A1, title: 'Xác nhận gửi và kiểm tra đã gửi', sub: 'Thanh xác nhận hiện ngay trên khung — không còn hộp hỏi của trình duyệt', body: `
  <div class="two"><div class="col-t" style="max-width:380px">${steps([
    [1, 'Bấm <b>Gửi báo cáo KPI tháng</b> ▸ thanh dưới cùng hiện danh sách người nhận ▸ <b>Xác nhận gửi</b>.'],
    ['✓', 'Gửi xong: dòng xanh <b>Đã gửi lúc … tới …</b> ngay dưới hạn gửi. Kế toán ghi nhận đúng hạn / muộn theo giờ gửi.'],
    ['↺', 'Gửi lại bản sửa: mở lại, sửa, gửi lại — lần gửi gần nhất được tính.'],
  ])}</div>
  <div class="col-f"><div class="stack">${card('k_ask', 640)}${card('k_sent', 470)}</div></div></div>` });

/* 11 · người nhận thấy gì */
slide({ sec: 'NGƯỜI NHẬN', kick: 'TRƯỞNG BỘ PHẬN · TGĐ · KẾ TOÁN', acc: A2, title: 'Email và file Word theo đúng biểu mẫu FM01', sub: 'Email trình bày như thư thường; file Word đính kèm để lưu hồ sơ', body: `
  <div class="two" style="gap:24px"><div class="col-f" style="justify-content:flex-start">${card('k_mail', 520, [0, 0, 1, 0.63])}</div>
  <div class="col-t">${card('k_word1', 600)}
  ${tip('Lời chào tự điền theo chức danh (chị Tuyên · chị Hòa · sếp Hà; nhóm Thái “… san”), sửa được trước khi gửi. Trưởng bộ phận trả lời email trong <b>02 ngày làm việc</b>; báo cáo tháng không cần ký.')}</div></div>` });

/* 12 · FM02 */
slide({ sec: 'BÁO CÁO QUÝ', kick: 'FM02', acc: A4, title: 'Báo cáo KPI quý — thiết lập mục tiêu và đánh giá', sub: 'Gửi báo cáo ▸ Báo cáo KPI quý (FM02) · hạn ngày 05 tháng đầu quý kế tiếp', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>A. Mục tiêu</b>: KPI của quý tự điền từ file KPI (kết quả tối đa 130%, trừ KPI doanh số).'],
    [2, '<b>Tải file Word</b> đúng mẫu FM02 để ký.'],
    [3, '<b>Gửi báo cáo KPI quý</b> ▸ Xác nhận gửi: email + file Word tới Trưởng bộ phận, Tổng Giám đốc, CC Kế toán.'],
  ])}${tip('Đầu quý: ghi mục tiêu và kế hoạch. Cuối quý: đối chiếu kết quả, chấm năng lực, tự đánh giá.')}</div>
  <div class="col-f">${br('k_fm02', 780)}</div></div>` });

/* 13 · FM02 B + C */
slide({ sec: 'BÁO CÁO QUÝ', kick: 'FM02', acc: A4, title: 'Tự chấm năng lực và tự đánh giá', sub: 'Phần B và C của FM02 — Trưởng bộ phận và Tổng Giám đốc đánh giá lại', body: `
  <div class="two" style="gap:22px"><div class="col-t" style="max-width:330px">${steps([
    [1, '<b>B. Năng lực</b>: 5 mục (mục tiêu, kế hoạch hành động, cải tiến, phát triển đội nhóm, thực hiện và đạt kết quả), mỗi mục chấm 1–5.'],
    [2, '<b>C. Tổng kết</b>: điểm tốt, cần cải thiện, chọn mức <b>EE · AE · PA · NA</b>.'],
  ])}${tip('Mức đánh giá chung không có công thức — Trưởng bộ phận và Tổng Giám đốc quyết định dựa trên mục tiêu và năng lực.')}</div>
  <div class="col-f" style="gap:18px;align-items:flex-start">${card('k_fm02b', 470, [0, 0.3, 1, 0.7])}${card('k_word2', 400)}</div></div>` });

/* 14 · nhóm Thái */
slide({ sec: 'NHÓM THÁI LAN', kick: 'ENGLISH', acc: A1, title: 'Nhóm Thái: biểu mẫu tiếng Anh', sub: 'App tự nhận nhóm Thái ⇒ email, file Word FM01 / FM02 bằng tiếng Anh', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, 'Lời chào theo tên: “Dear … san, Ha san,” — sửa được.'],
    [2, 'Email “Monthly KPI Report (MMHSOP_009-FM01)”, bảng KPI Results Summary, cột Reason for achievement / non-achievement.'],
    ['★', 'CRM nhóm Thái: Gửi báo cáo ▸ KPI ▸ Monthly KPI report · Quarterly KPI report.'],
  ])}${tip('Cùng hạn ngày 05, cùng người nhận: Trưởng bộ phận + Tổng Giám đốc, CC Kế toán.')}</div>
  <div class="col-f">${br('k_th', 780)}</div></div>` });

/* 15 · quản lý */
slide({ sec: 'QUẢN LÝ', kick: 'TRƯỞNG BỘ PHẬN · TỔNG GIÁM ĐỐC', acc: A2, title: 'Quản lý: xem và xác nhận', sub: 'KPI ▸ Total KPI công ty — số đã tự liên kết, không cần nhập', body: `
  <div class="two w3"><div class="col-t">${steps([
    [1, '<b>Tổng quan</b>: doanh số và 4 nhóm mục tiêu; <b>Thành viên</b>: % từng người theo tháng / quý.'],
    [2, 'Nhận email FM01 ⇒ đối chiếu với KPI trên app ⇒ <b>trả lời trong 02 ngày làm việc</b> (đồng ý / yêu cầu giải trình).'],
    [3, 'Quý: chấm năng lực, mức đánh giá; <b>ký FM02</b> trước ngày 14, trả bản ký trong 10 ngày.'],
    ['!', 'Số sai ⇒ yêu cầu nhóm sửa ở <b>file hoạt động</b>; không gõ đè trên file MMH KPI FY68.'],
  ])}</div>
  <div class="col-f">${br('k_total', 760)}</div></div>` });

/* 16 · kế toán */
slide({ sec: 'KẾ TOÁN', kick: 'THEO DÕI NỘP BÁO CÁO', acc: A3, title: 'Thống kê gửi báo cáo', sub: 'Thanh trên cùng ▸ Thống kê báo cáo (Admin · Director · HOD · người được cấp quyền)', body: `
  <div class="two"><div class="col-t" style="max-width:400px">${steps([
    [1, 'Chọn <b>Từ tháng – Đến tháng</b> ▸ <b>Xem số liệu</b>.'],
    [2, 'Bảng tóm tắt: cần gửi · đã gửi · đúng hạn · muộn · chưa gửi cho báo cáo tuần, KPI tháng, KPI quý.'],
    [3, '<b>Xuất Excel</b>: chi tiết từng người theo tháng / quý ⇒ bảng tổng hợp gửi nhân viên xác nhận, rồi trình Tổng Giám đốc tính thưởng.'],
  ])}${tip('Hạn tính tự động: tuần = 23:59 ngày làm việc cuối tuần (lịch MMH VN / TH) · KPI tháng = ngày 05 · KPI quý = ngày 05 tháng đầu quý kế tiếp. Lấy lần gửi gần nhất.')}</div>
  <div class="col-f">${card('k_stat', 640)}</div></div>` });

/* 17 · hỏi đáp */
slide({ sec: 'HỎI ĐÁP', acc: A1, title: 'Câu hỏi thường gặp', body: `
  <div class="faq">
    <div><h4>Số KPI trên app sai?</h4><p>Kiểm tra file hoạt động của nhóm (vd. lượt đi địa bàn chưa Completed, thiếu ảnh, đơn chưa duyệt). Sửa ở đó, đợi vài phút rồi bấm ↻. Vẫn sai ⇒ báo Admin.</p></div>
    <div><h4>Tháng chưa có số doanh số?</h4><p>Kế toán chưa chốt doanh số tháng ⇒ app ghi “Chưa chốt”. Vẫn gửi đúng hạn, ghi lý do theo số hiện có.</p></div>
    <div><h4>Bấm Gửi không thấy gì?</h4><p>Từ v19.2 / CRM v34.9 thanh <b>Xác nhận gửi</b> hiện ở cuối khung. Còn chỉ tiêu chưa ghi lý do ⇒ app báo mã KPI còn thiếu và đưa con trỏ tới ô đó — điền đủ rồi gửi lại.</p></div>
    <div><h4>Gửi nhầm / cần sửa?</h4><p>Mở lại báo cáo, sửa, gửi lại. Lần gửi gần nhất được tính; nộp sau hạn là muộn.</p></div>
    <div><h4>Vì sao KPI tối đa 130%?</h4><p>Theo FM02: mỗi KPI ghi nhận tối đa 130%, <b>trừ KPI doanh số</b>. App tự áp dụng.</p></div>
    <div><h4>Ai nhận email?</h4><p>To: Trưởng bộ phận (không có ⇒ Team Leader) + Tổng Giám đốc. CC: Kế toán. Thêm người CC nếu cần (chỉ email công ty).</p></div>
  </div>` });

/* 18 · tài liệu */
slide({ sec: 'TÀI LIỆU', acc: A1, title: 'Tài liệu và đường dẫn', body: `
  <table class="tbl"><tr><th style="width:220px">Mục</th><th>Dùng để</th><th style="width:380px">Ở đâu</th></tr>
    <tr><td><b>MMHSOP_009</b></td><td>Quy trình quản lý KPI: vai trò, 5 bước, hạn nộp, điều kiện thưởng quý</td><td>Bộ quy trình MMH</td></tr>
    <tr><td><b>MMHSOP_009-FM01 / FM02</b></td><td>Biểu mẫu báo cáo KPI tháng / quý (VN + EN)</td><td>App tự tạo file Word khi gửi</td></tr>
    <tr><td><b>MMH Report Hub</b></td><td>Xem KPI, gửi FM01 / FM02, Total KPI, Thống kê báo cáo</td><td>${a(L.app)}</td></tr>
    <tr><td><b>MMH CRM</b></td><td>Sales: file hoạt động + gửi báo cáo KPI</td><td>${a(CRM)}</td></tr>
    <tr><td><b>MMH KPI FY68</b></td><td>Target · Actual của công ty và từng người (chỉ xem, xác nhận)</td><td>Google Drive nội bộ</td></tr>
    <tr><td><b>Thư mục HDSD</b></td><td>Hướng dẫn sử dụng các app</td><td>${a(L.guide, 'Google Drive · HDSD')}</td></tr>
  </table>
  ${tip('Cần hỗ trợ: Product Team (Admin Report Hub / CRM).')}` });

writeDeck('HDSD Báo cáo KPI FY68 · MMHSOP_009');
