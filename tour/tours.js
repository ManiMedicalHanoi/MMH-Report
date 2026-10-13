/* ════════════════════════════════════════════════════════════════════════════════════════
   BÀI HƯỚNG DẪN — MMH REPORT HUB (bộ máy: tour/tour.js)
   QUY TẮC (CLAUDE.md): mỗi lần sửa / thêm chức năng người dùng nhìn thấy ⇒ sửa / thêm bài ở đây trong CÙNG PR,
   tăng `v` của bài bị đổi và đặt `d` = ngày sửa (bài hiện nhãn "Cập nhật" 14 ngày, nút Hướng dẫn có chấm vàng).
   Kiểm tra trước khi push: NODE_PATH=$(npm root -g) node tools/tour_check.js  (mọi bước phải tìm thấy phần tử).
   ════════════════════════════════════════════════════════════════════════════════════════ */
(function(){
/* điện thoại: số phiên bản ẩn ⇒ chỉ vào nút Thông báo cập nhật (mở được cả lịch sử); chọn ngôn ngữ chỉ có trên máy tính */
function ver(){ return TOUR.find("#ver-badge") || TOUR.find("#tt-news"); }
function wide(){ return window.innerWidth>720; }
function q(s){ return document.querySelector(s); }
function cal(){ try{ if(window.switchTab) switchTab("calendar"); }catch(_){} }
function today(){ var d=new Date(); return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2); }
function me(){ try{ return window.AUTH && AUTH.user && AUTH.user(); }catch(_){ return null; } }
TOUR.add([
 { id:"start", v:3, d:"2026-10-13", g:"Bắt đầu", ic:"start", t:"Làm quen Report Hub", x:"Các khu vực chính trên màn hình và chỗ tìm mọi chức năng.",
   steps:[
    { el:ver, t:"Số phiên bản", x:"Bấm số phiên bản để xem lại mọi <b>thông báo cập nhật</b> từ trước tới nay." },
    { el:".src-tab", do:cal, t:"Chọn phòng ban", x:"Đổi giữa <b>Marketing &amp; Sales</b>, <b>Back Office</b> và <b>Management</b>. Mỗi phòng ban có danh sách việc riêng." },
    { el:function(){ var b=q(".tabbtn"); return b&&b.parentElement; }, t:"Các chức năng — 4 nhóm", x:"<b>Tổng quan</b> (Tổng quan · Tiến độ · KPI) · <b>Cập nhật</b> (Lịch làm việc · Cập nhật công việc · Biên bản họp) · <b>Báo cáo</b> (tuần · tháng) · <b>Liên kết</b> (MMH Calendar, app khác). Bấm 1 chức năng ⇒ xem <b>toàn màn hình</b>; nhấn <b>Esc</b> hoặc <b>‹ Chức năng</b> để quay lại chọn chức năng khác." },
    { el:"#qs-btn", t:"Tìm nhanh", x:"Bấm hoặc nhấn <b>Ctrl + K</b> để tìm việc, sự kiện, bài đăng, chuyến công tác, buổi đào tạo." },
    { el:"#tb-tools", t:"Thanh công cụ", x:"Hướng dẫn, Thông báo cập nhật, Việc đã giao, Màu giao diện và đổi ngôn ngữ VN / EN." },
    { el:".tb-user", t:"Tài khoản", x:"Bấm tên của bạn để xem tài khoản hoặc đăng xuất." }
   ] },
 { id:"addtask", v:2, d:"2026-10-13", g:"Công việc", ic:"task", t:"Thêm Key task và Sub-task", x:"Tạo đầu việc chính, thêm việc phụ, chọn người làm và hạn.",
   steps:[
    { el:".c10-btn.pri", do:cal, t:"Nút Thêm việc", x:"Ở <b>Lịch làm việc</b>, bấm <b>＋ Thêm việc</b>. Có thể bấm thẳng vào một ngày trên lịch để thêm việc cho ngày đó." },
    { el:"#ksm-key", do:function(){ try{ c10Add(today()); }catch(_){} }, t:"Key task mới", x:"Chọn <b>Key task mới</b> khi đây là một đầu việc chính (vd. một dự án, một chương trình)." },
    { el:"#ksm-sub", t:"Hoặc Sub-task", x:"Chọn <b>Sub-task</b> để thêm việc phụ vào một Key task có sẵn." },
    { el:"#c10a-name", t:"Tên công việc", x:"Viết ngắn, rõ việc cần làm. Ví dụ: <b>Chốt danh mục Key SKUs Dental FY68</b>. Gõ tên trùng / gần giống key có sẵn ⇒ app gợi ý ngay để thêm thành sub-task." },
    { el:"#c10a-type", t:"Loại việc", x:"Chọn trong danh sách hoặc gõ để lọc." },
    { el:"#c10a-pic", t:"Người làm (PIC)", x:"Chọn người phụ trách. Trưởng nhóm giao cho người khác thì người đó nhận thông báo." },
    { el:"#c10a-start", t:"Ngày bắt đầu và hạn", x:"Điền ngày bắt đầu và hạn hoàn thành. Việc quá hạn sẽ hiện màu đỏ trên lịch." },
    { el:"#c10a-save", t:"Lưu", x:"Bấm <b>Thêm</b>: việc hiện ngay trên lịch, hệ thống lưu vào Google Sheet ở nền — không phải chờ." }
   ] },
 { id:"evsync", v:2, d:"2026-10-13", g:"Công việc", ic:"task", t:"Sự kiện MKT & Key task họp chung", x:"Sự kiện offline tự thành Key task (có link Folder), gõ tên key trùng là app gợi ý thêm sub-task.",
   steps:[
    { el:".kt-panel .v-sync-chip.ev", do:function(){ try{ switchTab("detail"); setDetailTime("all"); S.detailPics=[]; renderDetail(); }catch(_){} }, wait:500, t:"Key task sự kiện", x:"Mỗi sự kiện ở file <b>MKT Offline</b> (REPORT_EVENT / PLAN_EVENT) tự thành 1 Key task loại <b>Marketing-Event</b>, nhãn <b>📅 SỰ KIỆN</b>. Task Result chỉ ghi thông tin sự kiện (loại, đối tác, địa điểm, ngày, kế hoạch, tham dự, link folder)." },
    { el:".kt-panel .v-sync-chip.evf", t:"Mở folder sự kiện", x:"Bấm <b>📁 Folder</b> để mở thư mục sự kiện trên Google Drive (link lấy từ cột Detail event folder link)." },
    { el:function(){ var a=document.querySelectorAll(".kt-panel"); for(var i=0;i<a.length;i++){ if(/Internal Meeting|MMH Monthly Meeting/.test(a[i].textContent)) return a[i].querySelector(".kt-head")||a[i]; } return null; }, t:"Key task họp chung", x:"Họp nội bộ tháng chỉ có 3 nhóm: <b>Internal Meeting MMYYYY · Dental Sales / Surgical Sales / Marketing</b>. Họp toàn công ty: 1 key <b>MMH Monthly Meeting FYxx</b> cho cả kỳ, mỗi tháng 1 sub-task (vd. <b>202610</b>)." },
    { el:"#sd-pan-ak-name .sd-it", do:function(){ try{ openAddKey(); var i=document.getElementById("ak-name"); if(i){ i.value="Họp tháng"; i.dispatchEvent(new Event("input",{bubbles:true})); } }catch(_){} }, wait:400, t:"Gõ tên là thấy key trùng", x:"Đang gõ tên Key task mới, app hiện ngay các key có tên gần giống. Bấm 1 key ⇒ việc của bạn thành <b>sub-task</b> của key đó (tên giữ nguyên). Bấm <b>Tạo key mới</b> nếu thật sự là việc khác." }
   ] },
 { id:"update", v:2, d:"2026-10-13", g:"Công việc", ic:"task", t:"Cập nhật tiến độ việc", x:"Đổi trạng thái, % hoàn thành, kết quả và file đính kèm.",
   steps:[
    { el:".c10-card", do:function(){ cal(); for(var i=0;i<6 && !q(".c10-card");i++){ try{ c10Nav(-1); }catch(_){ break; } } }, wait:400, t:"Thẻ công việc", x:"Mỗi thẻ là một việc. Viền đỏ = quá hạn. Bấm vào thẻ (hoặc biểu tượng bút) để cập nhật." },
    { el:"#q10-st", do:function(){ var b=q(".c10-ebtn"); if(b) b.click(); }, t:"Trạng thái", x:"Chọn <b>To Do</b>, <b>Đang làm</b>, <b>Xong</b> hoặc <b>Huỷ</b>." },
    { el:"#q10-steps", t:"Phần trăm hoàn thành", x:"Bấm nhanh 0 – 25 – 50 – 75 – 100% hoặc kéo thanh trượt phía trên." },
    { el:"#q10-due", t:"Hạn", x:"Đổi hạn nếu kế hoạch thay đổi. Báo cáo tuần ghi nhận hạn mới." },
    { el:"#q10-res", t:"Kết quả", x:"Ghi kết quả, ghi chú hoặc dán link tài liệu." },
    { el:".ref-btn", t:"File tham chiếu", x:"Đính kèm file (báo giá, slide, ảnh…) để người khác mở ngay từ thẻ việc." },
    { el:"#q10-save", t:"Lưu", x:"Bấm <b>Lưu</b>. Thẻ cập nhật ngay, mạng yếu thì app tự gửi lại." }
   ] },
 { id:"calendar", v:1, d:"2026-10-11", g:"Công việc", ic:"cal", t:"Lịch làm việc", x:"Xem việc theo tuần / tháng, lọc người, xem việc quá hạn.",
   steps:[
    { el:function(){ var b=q("[onclick=\"c10Face('cal')\"]"); return b&&b.parentElement; }, do:cal, t:"Hôm nay và Pending", x:"<b>Today task</b> = việc theo lịch. <b>Pending</b> = việc còn tồn, chưa xong." },
    { el:"[onclick=\"c10Nav(0)\"]", t:"Chuyển tuần", x:"Dùng ‹ › để lùi / tới, bấm <b>Hôm nay</b> để quay về tuần hiện tại." },
    { el:".c10-pbtn", t:"Xem của ai", x:"Chọn <b>Chỉ tôi</b> hoặc thêm người khác để xem lịch cả nhóm (theo quyền của bạn)." },
    { el:function(){ var b=q("[onclick=\"c10View('month')\"]"); return b&&b.parentElement; }, t:"Kiểu xem", x:"Đổi giữa <b>Tháng</b>, <b>Tuần</b> và <b>Danh sách</b>." },
    { el:".c10-odbtn", t:"Việc quá hạn", x:"Việc quá hạn không rải trên lịch mà gom ở nút đỏ này. Bấm để xem và xử lý." },
    { el:".c10-wadd", t:"Thêm việc vào ngày", x:"Bấm <b>＋ Thêm việc</b> dưới một ngày để tạo việc đúng ngày đó." }
   ] },
 { id:"mmhcal", v:1, d:"2026-10-11", g:"Lịch & sự kiện", ic:"cal", t:"MMH Calendar", x:"Lịch chung: công tác, đào tạo, sự kiện offline, bài đăng.",
   steps:[
    { el:".cal-launch", t:"Mở MMH Calendar", x:"Nút <b>MMH Calendar</b> trên thanh trên cùng mở lịch chung của công ty." },
    { el:"#mc-src", do:function(){ try{ openMMHCalendar(); }catch(_){} }, wait:700, t:"Nguồn dữ liệu", x:"Lịch gom từ Công tác, Đào tạo, Sự kiện offline và Bài đăng." },
    { el:"#mc-seg", t:"Kiểu xem", x:"Tháng, Tuần hoặc Danh sách." },
    { el:"#mc-q", t:"Tìm trong lịch", x:"Gõ tên sự kiện, địa điểm, KOL, trainer hoặc PIC." },
    { el:".mc-tg", t:"Bật / tắt loại", x:"Bấm từng loại ở cột trái để ẩn / hiện trên lịch." },
    { el:".mc-kpi", t:"Tóm tắt nhanh", x:"Số chuyến công tác, buổi đào tạo, sự kiện, bài đăng trong khoảng đang xem. Bấm để chỉ xem loại đó." },
    { el:".mc-new", t:"Tạo mới", x:"Tạo buổi đào tạo, sự kiện… ngay trên lịch. Buổi đào tạo tự có thư mục tài liệu." }
   ] },
 { id:"search", v:1, d:"2026-10-11", g:"Lịch & sự kiện", ic:"search", t:"Tìm nhanh (Ctrl + K)", x:"Tìm mọi thứ trong app, không cần gõ dấu.",
   steps:[
    { el:"#qs-btn", t:"Mở Tìm nhanh", x:"Bấm nút này hoặc nhấn <b>Ctrl + K</b> (máy Mac: ⌘ + K) ở bất kỳ màn hình nào." },
    { el:".qs-in", do:function(){ try{ QS.open(); }catch(_){} }, t:"Gõ để tìm", x:"Gõ vài chữ, không cần dấu: tên việc, sự kiện, bài đăng, chuyến công tác. Dùng ↑ ↓ và Enter để mở." }
   ] },
 { id:"assign", v:1, d:"2026-10-11", g:"Giao việc", ic:"mail", t:"Việc đã giao & trao đổi", x:"Theo dõi việc mình giao, việc được giao và trả lời trong app.",
   steps:[
    { el:"#tt-at", t:"Việc đã giao", x:"Mở danh sách việc bạn giao cho người khác và việc người khác giao cho bạn." },
    { el:function(){ var b=q("#at button.on"); return b&&b.parentElement; }, do:function(){ try{ AT.open(); }catch(_){} }, t:"Hai danh sách", x:"<b>Tôi đã giao</b>: xem người nhận đã xem / đã xong chưa. <b>Giao cho tôi</b>: việc người khác giao cho bạn." },
    { el:"#at h3", t:"Trao đổi", x:"Bấm nhãn trên mỗi việc để đọc và trả lời. Bên kia nhận email ngay." }
   ] },
 { id:"trip", v:1, d:"2026-10-11", g:"Công tác", ic:"trip", t:"Đề xuất công tác", x:"Điền đề xuất, hệ thống gửi email xin duyệt tới Giám đốc.",
   steps:[
    { el:"[onclick=\"tripProposeOpen()\"]", do:cal, t:"Nút Đề xuất công tác", x:"Ở <b>Lịch làm việc</b>, bấm <b>Đề xuất công tác</b>." },
    { el:"#tp-start", do:function(){ try{ tripProposeOpen(); }catch(_){} }, wait:700, t:"Ngày đi và ngày về", x:"Số ngày công tác tự tính." },
    { el:"#ms-dest", t:"Điểm đến và người đi cùng", x:"Gõ để tìm tỉnh / thành. Chọn được nhiều điểm đến và nhiều người đi cùng." },
    { el:"#tp-purpose", t:"Mục đích và kết quả mong đợi", x:"Viết rõ đi để làm gì và mong đạt được gì." },
    { el:"#tp-costs", t:"Chi phí dự kiến", x:"Mỗi khoản 1 dòng (công tác phí, vé máy bay, khách sạn…). Tổng tự cộng." },
    { el:"#tp-sched", t:"Lịch trình", x:"Ghi theo từng ngày, ví dụ <b>24/9: HN – HP – HN</b>." },
    { el:"#ms-eq", t:"Thiết bị mang theo", x:"Chọn thiết bị (Laptop, hàng mẫu…). Email đề xuất kèm cam kết bảo quản thiết bị." },
    { el:"#tp-send", t:"Gửi đề xuất", x:"Email theo mẫu <b>Business Trip Approval Request</b> gửi tới Giám đốc, CC trưởng phòng và bạn. Duyệt xong bạn nhận email phê duyệt." }
   ] },
 { id:"report", v:1, d:"2026-10-11", g:"Báo cáo", ic:"report", t:"Gửi báo cáo tuần / tháng", x:"Gửi báo cáo bằng email ngay từ lịch.",
   steps:[
    { el:"[onclick^=\"c10RepMenu\"]", do:cal, t:"Gửi báo cáo", x:"Bấm <b>Gửi báo cáo</b> để chọn báo cáo tuần hoặc tháng. Báo cáo lấy đúng việc trên lịch của bạn." },
    { el:"[onclick=\"switchTab('report')\"]", t:"Xem trước báo cáo tuần", x:"Mục <b>Báo cáo tuần</b> ở cột trái cho xem toàn bộ nội dung trước khi gửi." }
   ] },
 { id:"kpi", v:1, d:"2026-10-11", g:"Báo cáo", ic:"kpi", t:"KPI của tôi", x:"Xem KPI theo tháng / quý / năm, báo cáo KPI, Setting Expectation.",
   steps:[
    { el:"#kp-m", do:function(){ try{ switchTab("kpi"); }catch(_){} }, wait:900, t:"Chọn kỳ", x:"Chọn <b>Tháng</b>, <b>Quý</b> hoặc <b>Năm FY</b>, rồi chọn tháng cần xem." },
    { el:"#kp-person", t:"Người đang xem", x:"Quản lý chọn được từng thành viên; nhân viên xem KPI của mình. Màu %: xám &lt; 90% · xanh 90–100% · vàng 100–120% · xanh lá &gt; 120%." },
    { el:"[onclick=\"KR.open()\"]", t:"Báo cáo KPI tháng", x:"Gửi báo cáo KPI tháng trước (hạn ngày 02, 16:00)." },
    { el:"[onclick=\"SE.open()\"]", t:"Setting Expectation", x:"Điền tự đánh giá quý (hạn ngày 09 tháng đầu quý, trước 17:00) và tải file Word." }
   ] },
 { id:"meet", v:1, d:"2026-10-11", g:"Báo cáo", ic:"people", t:"Biên bản họp", x:"Ghi, lưu và gửi email biên bản họp.",
   steps:[
    { el:"[onclick=\"switchTab('meet')\"]", t:"Mục Biên bản họp", x:"Mở ở cột trái." },
    { el:"#tab-meet", do:function(){ try{ switchTab("meet"); }catch(_){} }, wait:700, t:"Soạn biên bản", x:"Ghi nội dung, người tham dự, việc cần làm. Lưu xong có thể gửi email cho người tham dự." }
   ] },
 { id:"news", v:2, d:"2026-10-11", g:"Cá nhân hoá", ic:"help", t:"Thông báo cập nhật", x:"Xem app vừa có gì mới.",
   steps:[
    { el:"#tt-news", t:"Thông báo cập nhật", x:"Mỗi lần app cập nhật, thông báo tự hiện trong 7 ngày. Bấm đây để xem lại bất cứ lúc nào." },
    { el:ver, when:wide, t:"Lịch sử phiên bản", x:"Bấm số phiên bản để xem mọi bản cập nhật trước đây." }
   ] },
 { id:"theme", v:2, d:"2026-10-11", g:"Cá nhân hoá", ic:"gear", t:"Màu giao diện & ngôn ngữ", x:"Chọn 1 trong 10 tông màu, đổi VN / EN.",
   steps:[
    { el:"#th-btn", t:"Màu giao diện", x:"Chọn tông màu bạn thích. Lựa chọn lưu trên máy này." },
    { el:"#lang-switch", when:wide, t:"Ngôn ngữ", x:"Đổi giữa tiếng Việt và tiếng Anh." }
   ] },
 { id:"admin", v:1, d:"2026-10-11", g:"Quản trị", ic:"user", t:"Phân quyền người dùng", x:"Dành cho Admin: bật / tắt chức năng cho từng người.",
   when:function(){ var u=me(); return !!u && (u.admin || u.level==="director" || u.level==="hod"); },
   steps:[
    { el:".tb-user", t:"Mở menu tên", x:"Bấm tên của bạn ▸ <b>Phân quyền người dùng</b>." },
    { el:"#adm", do:function(){ try{ if(window.ADM&&ADM.open) ADM.open(); }catch(_){} }, wait:1000, t:"Danh sách người dùng", x:"Bấm một người để sửa email, phòng ban, vai trò. Cột đăng nhập gần nhất màu đỏ = chưa từng đăng nhập." },
    { el:"#adm .tg", do:function(){ var r=q("#adm tr.r"); if(r && !q("#adm .tg")) r.click(); }, wait:500, t:"Bật / tắt chức năng", x:"Công tắc viền vàng = khác quyền mặc định của vai trò." },
    { el:"#af-save", t:"Lưu", x:"Lưu quyền. Có nút <b>Đăng xuất khỏi mọi máy</b> cho từng người." }
   ] },
 { id:"testmode", v:1, d:"2026-10-13", g:"Quản trị", ic:"gear", t:"Chế độ TEST · Luồng dữ liệu", x:"Admin thử mọi chức năng dưới tên TEST, ghi thật, xem dữ liệu đi đâu.",
   when:function(){ var u=me(); return !!u && u.admin && !!window.TESTFLOW; },
   steps:[
    { el:".tb-user", when:function(){ return !TESTFLOW.on(); }, t:"Mở menu tên", x:"Bấm tên của bạn ▸ <b>Chế độ TEST · luồng dữ liệu</b> (hoặc Ctrl+K gõ \"test\"). Chỉ Admin thấy." },
    { el:"#tf-pk .tf-scopes", do:function(){ try{ TESTFLOW.pick(); }catch(_){} }, wait:500, when:function(){ return !TESTFLOW.on(); }, t:"Chọn phòng", x:"File công việc của phòng nào nhận dữ liệu TEST (Sales & Marketing hoặc Back Office)." },
    { el:"#tf-pk .tf-roles", when:function(){ return !TESTFLOW.on(); }, t:"Chọn vai", x:"<b>Nhân viên</b>: việc, báo cáo, công tác, KPI · <b>Quản lý</b>: giao việc · <b>Giám đốc</b>: duyệt công tác — chỉ hồ sơ TEST." },
    { el:"#tf-pk [data-go]", when:function(){ return !TESTFLOW.on(); }, t:"Bắt đầu", x:"Dữ liệu lưu thật dưới tên TEST, email chỉ về Admin, người khác không thấy, không tính KPI." },
    { el:"#tf-fab", when:function(){ return TESTFLOW.on(); }, t:"Nút TEST", x:"Góc trái dưới: vai đang dùng + số thao tác. Bấm để mở bảng Luồng dữ liệu." },
    { el:"#tf-pn .tf-roles", do:function(){ try{ TESTFLOW.open(); }catch(_){} }, wait:400, when:function(){ return TESTFLOW.on(); }, t:"Đổi vai", x:"Đổi sang <b>Giám đốc</b> để duyệt công tác của TEST." },
    { el:"#tf-pn .tf-tl", when:function(){ return TESTFLOW.on(); }, t:"Luồng dữ liệu", x:"Mỗi lần lưu: ① thao tác → ② backend → ③ file ▸ tab ▸ dòng → ④ email lẽ ra gửi tới ai. Xong thì bấm <b>Xoá dữ liệu test</b>." }
   ] }
]);
/* lệnh nhanh trong Ctrl+K: mở danh mục hướng dẫn */
try{ (window.QS_EXTRA_CMDS=window.QS_EXTRA_CMDS||[]).push({ ic:"❓", title:"Hướng dẫn sử dụng (tour từng bước)", hay:"huong dan tutorial tour cach dung "+TOUR.list().map(function(t){ return t.t; }).join(" "),
  run:function(){ try{ QS.close(); }catch(_){} setTimeout(function(){ TOUR.open(); },120); } }); }catch(_){}
})();
