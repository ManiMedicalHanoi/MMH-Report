/* ═══════════════════════════════════════════════════════════════════════════
 * kpisop.js — v1.2 (09/11/2026 · CHỈ gửi bản soạn sẵn về email của chính mình · nhắc hạn ngày 01–05, quá hạn 06–10) · v1.1 (02/11/2026 · lời chào theo chức danh) · GIỐNG HỆT ở MMH-Report và MMH-CRM (sửa 1 nơi ⇒ chép sang nơi kia)
 *
 * BÁO CÁO KPI THEO QUY TRÌNH QUẢN LÝ KPI MMHSOP_009 (phiên bản 20260801, hiệu lực 01/10/2026)
 *  · Báo cáo KPI Tháng = Biểu mẫu MMHSOP_009-FM01 (KR.open) — chậm nhất ngày 05 hằng tháng, cho kết quả tháng trước.
 *      1. Tổng hợp kết quả KPI (lý do đạt / chưa đạt TỪNG chỉ tiêu) · 2. Hành động tháng tới · 3. Điểm nổi bật, khó khăn, hỗ trợ cần thiết.
 *      Email (backend kpi ▸ rhKpiMailSend, nội dung theo FM01) + file Word FM01 đính kèm.
 *  · Báo cáo KPI Quý = Biểu mẫu MMHSOP_009-FM02 — Thiết lập mục tiêu và đánh giá kết quả (SE.open) — chậm nhất ngày 05 tháng đầu quý kế tiếp.
 *      A. Mục tiêu (KPI quý từ file MMH KPI, kết quả tối đa 130% trừ KPI doanh số) · B. Năng lực (1–5) · C. Tự đánh giá (EE / AE / PA / NA).
 *      File Word FM02 ⇒ tải về hoặc gửi email (backend kpi ▸ rhSeSend, được ghi nhận vào thống kê gửi báo cáo).
 *  · Người nhận (backend rhKpiMail): Trưởng bộ phận + Tổng Giám đốc, CC Kế toán.
 *  · Mẫu Word: templates/kpi_fm01_vi|en.docx, kpi_fm02_vi|en.docx (dựng bằng tools/kpi_tpl/mk_tpl.py từ đúng file mẫu của quy trình).
 *    Nhóm Việt Nam (MKT, Sales, Back office…) ⇒ mẫu tiếng Việt · nhóm Thái Lan ⇒ mẫu tiếng Anh.
 *  · v1.2 (người dùng yêu cầu 09/11/2026): hệ thống KHÔNG gửi báo cáo KPI cho người khác — người dùng TỰ SOẠN VÀ GỬI email từ hộp thư của mình.
 *    Nút chính "Soạn email để gửi" (composeOpen): sao chép nội dung email (HTML) vào bộ nhớ tạm + thanh mở hộp thư Outlook / Gmail / ứng dụng mail
 *    với To · CC · Tiêu đề điền sẵn ⇒ dán nội dung, đính kèm file Word, tự gửi ⇒ bấm "Đã gửi" (thôi nhắc hạn).
 *    Phụ: "Gửi bản sao về email của tôi" (backend kpi v1.5 chỉ gửi về email người đăng nhập — bản tham khảo, có file Word), Tải file Word, Sao chép người nhận.
 *  · Hạn mặc định: ngày 05 hằng tháng (KPI tháng trước) và ngày 05 tháng đầu quý kế tiếp (KPI quý). Popup nhắc (#kpn): ngày 01–05
 *    mỗi ngày 1 lần ("còn n ngày" / "hôm nay là hạn"), ngày 06–10 "đã quá hạn" — dừng khi đã gửi bản soạn sẵn hoặc bấm "Đã gửi, không nhắc nữa".
 *
 * Cần ở app: window.KPI (khối KPI v16.5), window.KPI_H (hàm dùng chung của khối đó), AUTH, toast.
 * Cấu hình: window.KPISOP_CFG = { en:fn() (giao diện tiếng Anh?), thai:fn(pic, staff) (người này thuộc nhóm Thái?) }
 * ═══════════════════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var CFG=window.KPISOP_CFG||{};
var H=function(){ return window.KPI_H||{}; };
function $(id){ return document.getElementById(id); }
function esc(v){ return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function lsG(k){ try{ return JSON.parse(localStorage.getItem(k)||"null"); }catch(_){ return null; } }
function lsS(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(_){} }
function uiEn(){ try{ return !!(CFG.en && CFG.en()); }catch(_){ return false; } }
function T(vi,en){ return uiEn()?en:vi; }
function toast(m){ if(typeof window.toast==="function") window.toast(m); else alert(m); }
function noAcc(s){ return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D"); }
function pad(n){ return ("0"+n).slice(-2); }
function uniqJoin(a){ var o=[]; a.forEach(function(x){ x=String(x||"").trim(); if(x && o.indexOf(x)<0) o.push(x); }); return o.join(" / "); }
function today(){ var d=new Date(); return pad(d.getDate())+"/"+pad(d.getMonth()+1)+"/"+d.getFullYear(); }
function ml(ym){ return /^\d{6}$/.test(ym)?ym.slice(4)+"/"+ym.slice(0,4):String(ym||""); }
function nextYm(ym){ var y=+ym.slice(0,4), m=+ym.slice(4)+1; if(m>12){ m=1; y++; } return y+pad(m); }
function okMail(e){ return /^[^@\s]+@(mani\.inc|manimedicalhanoi\.com)$/i.test(e); }
function splitMails(x){ return String(x||"").split(/[,;\s]+/).map(function(e){ return e.trim().toLowerCase().replace(/@mani\.inc$/,"@manimedicalhanoi.com"); }).filter(Boolean); }
function st(){ return (H().st&&H().st())||{}; }
/* v1.2 — email của chính người dùng, chuẩn hoá về @manimedicalhanoi.com (máy chủ cũng chỉ gửi về địa chỉ này) */
function myMail(){ return splitMails((H().myEmail&&H().myEmail())||"")[0]||""; }
function D(){ return st().d||null; }
function staffOf(p){ return (H().staff&&H().staff(p))||{}; }
/* nhóm Thái ⇒ mẫu tiếng Anh */
function isThai(pic){
  var s=staffOf(pic);
  try{ if(CFG.thai && CFG.thai(pic, s)) return true; }catch(_){}
  return /thai/i.test([s.team,s.dept,s.title].join(" "));
}
function docLang(pic){ return isThai(pic)?"en":"vi"; }
var W={ vi:{ m:"Báo cáo KPI tháng", q:"Báo cáo KPI quý" }, en:{ m:"Monthly KPI Report", q:"Quarterly KPI Report" } };
/* hạn nộp (MMHSOP_009 · 4.2.1) */
function dueMonth(ym){ var n=nextYm(ym); return "05/"+n.slice(4)+"/"+n.slice(0,4); }
function dueQuarter(fy,q){ var y0=fy+1958, m=[[y0,12],[y0+1,3],[y0+1,6],[y0+1,9]][+String(q).slice(1)-1]; return "05/"+pad(m[1])+"/"+m[0]; }
/* tên KPI hiển thị: VN = tên rút gọn tiếng Việt (kpiShort) · EN = tên gốc trong file KPI */
function kName(r, lang){ var n=String(r&&(r.name||r.kpi)||"").replace(/\s+/g," ").trim(); if(lang==="en") return n; try{ return H().kpiShort?H().kpiShort(n):n; }catch(_){ return n; } }
/* KPI doanh số bán hàng ⇒ không giới hạn 130% (FM02 · Chú ý) */
function isSales(r){ return /^F\d/i.test(r.code||"") || /turnover|doanh số/i.test(r.group||""); }

/* ── Word (JSZip) ── */
function xw(v){ return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r?\n/g,'</w:t><w:br/><w:t xml:space="preserve">'); }
function loadZip(){
  if(window.JSZip) return Promise.resolve(window.JSZip);
  if(H().loadJsZip) return H().loadJsZip();
  return new Promise(function(res, rej){ var s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"; s.onload=function(){ res(window.JSZip); }; s.onerror=function(){ rej(new Error(T("Không tải được thư viện tạo file Word.","Cannot load the Word library."))); }; document.head.appendChild(s); });
}
/* lặp dòng bảng có chứa ô mẫu `key` */
function repeatRow(doc, key, list, fill){
  var i=doc.indexOf(key); if(i<0) return doc;
  var re=/<w:tr[ >]/g, m, st0=-1; while((m=re.exec(doc)) && m.index<i) st0=m.index;
  var en=doc.indexOf("</w:tr>", i); if(st0<0||en<0) return doc;
  en+=7; var tpl=doc.slice(st0,en);
  return doc.slice(0,st0)+list.map(function(x,k){ return fill(tpl,x,k); }).join("")+doc.slice(en);
}
function put(s, V){ Object.keys(V).sort(function(a,b){ return b.length-a.length; }).forEach(function(k){ s=s.split("{"+k+"}").join(xw(V[k])); }); return s; }
function buildDoc(path, edit){
  return Promise.all([loadZip(), fetch(path).then(function(r){ if(!r.ok) throw new Error(T("Không tải được file mẫu ","Cannot load template ")+path); return r.arrayBuffer(); })])
    .then(function(a){ return a[0].loadAsync(a[1]); })
    .then(function(z){
      var names=Object.keys(z.files).filter(function(n){ return /^word\/(document|header\d*|footer\d*)\.xml$/.test(n); });
      return Promise.all(names.map(function(n){ return z.file(n).async("string"); })).then(function(xs){
        xs.forEach(function(x,i){ z.file(names[i], edit(x, names[i])); });
        return z.generateAsync({ type:"blob", compression:"DEFLATE", compressionOptions:{ level:6 }, mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      });
    });
}
function saveBlob(blob, nm){ var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=nm; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
function b64(blob){ return new Promise(function(res, rej){ var r=new FileReader(); r.onload=function(){ res(String(r.result).split(",")[1]||""); }; r.onerror=function(){ rej(new Error("FileReader")); }; r.readAsDataURL(blob); }); }
function fileName(form, lang, per, who){ return "MMHSOP_009-"+form+"_"+(form==="FM01"?(lang==="en"?"Monthly_KPI":"KPI_Thang"):(lang==="en"?"Quarterly_KPI":"KPI_Quy"))+"_"+per+"_"+noAcc(who).replace(/[^\w]+/g,"_").replace(/^_|_$/g,"")+".docx"; }
function post(a, p){ if(!H().post) return Promise.reject(new Error("KPI")); return H().post(a, p); }
function pctS(v){ return v===null||v===undefined||v===""?"":(Math.round(v*1000)/10)+"%"; }
function num(v, unit){ if(v===null||v===undefined||v==="") return ""; if(/%/.test(unit||"")) return pctS(v); return H().fmtN?H().fmtN(v, unit==="USD"?"":"").replace(/\s+$/,""):String(v); }

/* ── chip người nhận ── */
function chips(box, arr, onChange){
  function paint(){
    box.innerHTML=arr.map(function(e,i){ return '<span class="'+(okMail(e)?"":"bad")+'">'+esc(e)+'<button type="button" data-i="'+i+'" aria-label="Bỏ">×</button></span>'; }).join("")+'<input placeholder="'+T("gõ email rồi Enter","type an e-mail, press Enter")+'">';
    var inp=box.querySelector("input");
    var add=function(){ splitMails(inp.value).forEach(function(x){ if(arr.indexOf(x)<0) arr.push(x); }); inp.value=""; paint(); box.querySelector("input").focus(); onChange&&onChange(); };
    inp.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===","||e.key===";"){ e.preventDefault(); add(); } else if(e.key==="Backspace"&&!inp.value&&arr.length){ arr.pop(); paint(); box.querySelector("input").focus(); onChange&&onChange(); } });
    inp.addEventListener("blur",function(){ if(inp.value.trim()) add(); });
  }
  box.onclick=function(e){ var b=e.target.closest("button[data-i]"); if(b){ arr.splice(+b.getAttribute("data-i"),1); paint(); onChange&&onChange(); return; } var i=box.querySelector("input"); if(i) i.focus(); };
  paint();
  return { flush:function(){ var i=box.querySelector("input"); if(i&&i.value.trim()) i.dispatchEvent(new Event("blur")); } };
}
function ov(id, title, steps){
  var o=$(id); if(o) return o;
  o=document.createElement("div"); o.id=id; o.className="kx-ov ksp";
  o.innerHTML='<div class="kx-card" role="dialog" aria-label="'+esc(title)+'"><div class="kx-hd"><h3>'+esc(title)+'</h3><div class="kx-steps">'+steps.map(function(s,i){ return '<span class="on"><i>'+(i+1)+'</i>'+esc(s)+'</span>'; }).join("")+'</div><button class="kx-x" aria-label="Đóng">✕</button></div>'
    +'<div class="kx-bd"><div class="kx-l"></div><div class="kx-r"></div></div><div class="kx-ft"></div></div>';
  document.body.appendChild(o);
  o.querySelector(".kx-x").onclick=function(){ o.classList.remove("show"); };
  return o;
}

/* ════════════════ BÁO CÁO KPI THÁNG — FM01 ════════════════ */
var M={ pic:"", month:"", to:[], cc:[], data:null, t:null, lang:"vi", ch:{} };
function mKey(){ return "mmh_kr2:"+M.pic+":"+M.month; }
function mDraft(){
  var d=lsG(mKey());
  if(!d){ var o=lsG("mmh_kr_draft:"+M.pic+":"+M.month); if(o) d={ subject:o.subject, greeting:o.greeting, intro:o.intro, sign:o.sign, next:o.analysis||"", high:o.highlights||"", showQ:o.showQ }; }
  return d||{};
}
function mRows(){ return ((M.data&&M.data.rows)||[]).slice(); }
/* ⭐ v1.1 — lời chào theo chức danh (backend rhKpiMail ▸ toHonor / toHonorEn): "Dear chị Tuyên, sếp Hà," · nhóm Thái "Dear Tuyen san, Ha san," */
function dearOf(d, en){
  d=d||{}; var h=en?d.toHonorEn:d.toHonor, names=(d.toNames&&d.toNames.length?d.toNames:(d.toName?[d.toName]:[]));
  if(h && h.length) return "Dear "+h.join(", ")+",";
  return en?"Dear "+(names.join(", ")||"all")+",":"Dear anh/chị"+(names.length?" "+names.join(", "):"")+",";
}
function oldDear(d, en){ d=d||{}; var names=(d.toNames&&d.toNames.length?d.toNames:(d.toName?[d.toName]:[])); return en?"Dear "+(names.join(", ")||"all")+",":"Dear anh/chị"+(names.length?" "+names.join(", "):"")+","; }
/* ⭐ v1.1 — xác nhận NGAY TRÊN KHUNG (không dùng confirm() của trình duyệt: trình duyệt đã chặn hộp hỏi / app trên điện thoại ⇒ bấm Gửi không có gì xảy ra) */
function askInline(ftId, text, yes){
  var ft=$(ftId); if(!ft) return;
  var old=ft.querySelector(".ksp-ask"); if(old) old.remove();
  var box=document.createElement("div"); box.className="ksp-ask";
  box.innerHTML='<span class="t">'+text+'</span><button type="button" class="kp-btn" data-a="no">'+T("Huỷ","Cancel")+'</button><button type="button" class="kp-btn pri" data-a="yes">'+T("Xác nhận gửi","Confirm & send")+'</button>';
  ft.classList.add("asking"); ft.appendChild(box);
  box.querySelector('[data-a="no"]').onclick=function(){ box.remove(); ft.classList.remove("asking"); };
  box.querySelector('[data-a="yes"]').onclick=function(){ box.remove(); ft.classList.remove("asking"); yes(); };
  try{ box.querySelector('[data-a="yes"]').focus(); }catch(_){}
}
function sentLine(info, en){
  if(!info) return "";
  if(info.mine) return '<br><span class="ksp-ok">'+T("Bạn đã đánh dấu đã gửi lúc ","You marked it as sent at ")+esc(info.at||"")+'</span>'+(info.to?' · '+T("tới ","to ")+esc(info.to):'');
  if(info.self) return '<br><span class="ksp-ok">'+T("Đã gửi bản sao về ","Copy sent to ")+esc((info.to||[]).join(", "))+T(" lúc "," at ")+esc(info.at||"")+'</span> · '+T("nhớ tự gửi email chính thức từ hộp thư của bạn","remember to send the official e-mail from your own mailbox");
  return '<br><span class="ksp-ok">'+T("Đã gửi lúc ","Sent at ")+esc(info.at||"")+'</span> · '+T("tới ","to ")+esc((info.to||[]).join(", "))+(info.cc&&info.cc.length?' · CC '+esc(info.cc.join(", ")):'');
}
function mDefaults(){
  var d=M.data||{}, en=M.lang==="en", full=d.full||(staffOf(M.pic).full)||M.pic;
  return { greeting:dearOf(d, en),
    intro:en?"Please find below my Monthly KPI Report for "+ml(M.month)+" (form MMHSOP_009-FM01). The Word file is attached.":"Em xin gửi Báo cáo KPI tháng "+ml(M.month)+" theo biểu mẫu MMHSOP_009-FM01 như sau (file Word đính kèm):",
    subject:(en?"Monthly KPI Report ":"Báo cáo KPI tháng ")+ml(M.month)+" (MMHSOP_009-FM01) · "+full,
    sign:"Best regards,\n"+full };
}
function mFields(){
  var g=function(id){ var e=$(id); return e?e.value:""; }, rs={}, nm={};
  mRows().forEach(function(r){ var t=$("kr2-why-"+r.code); if(t && t.value.trim()) rs[r.code]=t.value.trim().slice(0,1500); nm[r.code]=kName(r, M.lang); });
  return { pic:M.pic, month:M.month, subject:g("kr2-sub").trim(), greeting:g("kr2-gr"), intro:g("kr2-in"), sign:g("kr2-sg"), showQ:($("kr2-q")||{}).checked?1:0,
    reasons:rs, names:nm, next:g("kr2-next").slice(0,3000), high:g("kr2-high").slice(0,3000), chal:g("kr2-chal").slice(0,3000), supp:g("kr2-supp").slice(0,2000), lang:M.lang==="en"?"en":"" };
}
function mSave(){ var f=mFields(); lsS(mKey(), { subject:f.subject, greeting:f.greeting, intro:f.intro, sign:f.sign, showQ:!!f.showQ, reasons:f.reasons, next:f.next, high:f.high, chal:f.chal, supp:f.supp, att:($("kr2-att")||{}).checked!==false }); }
function mMissing(){ return mRows().filter(function(r){ var t=$("kr2-why-"+r.code); return r.a!==null && r.a!==undefined && !(t && t.value.trim()); }); }
function mForm(){
  var o=$("kr2"), L=o.querySelector(".kx-l"), h=H(), mem=(h.members?h.members():[]), d=M.data||{}, dr=mDraft(), def=mDefaults(), en=M.lang==="en";
  if(dr.greeting && dr.greeting===oldDear(d, en)) dr.greeting="";   /* v1.1 — lời chào mặc định cũ ⇒ đổi sang xưng hô theo chức danh */
  var ms=(h.months?h.months():[]).filter(function(m){ return m<=(h.ymNow?h.ymNow():"999999"); });
  var sent=lsG("mmh_kpi_sent:"+M.pic+":"+M.month);
  var tot=h.total?h.total(M.pic,M.month):null, tone=function(v){ return h.tone?h.tone(v):"na"; };
  var rows=mRows();
  L.innerHTML='<div class="kx-row"><div class="kx-f"><label>'+T("Người báo cáo","Reporter")+'</label><select id="kr2-pic">'+mem.map(function(m){ return '<option'+(m===M.pic?" selected":"")+'>'+esc(m)+'</option>'; }).join("")+'</select></div>'
    +'<div class="kx-f"><label>'+T("Tổng KPI tháng","Month KPI total")+'</label><div class="ksp-big g-'+tone(tot)+'">'+esc(h.pct?h.pct(tot):"")+'</div></div></div>'
    +'<div class="kx-f"><label>'+T("Tháng báo cáo","Report month")+'</label><div class="kx-months">'+ms.map(function(m){ var t=h.total?h.total(M.pic,m):null; return '<button type="button" data-m="'+m+'" class="'+(m===M.month?"on":"")+'">'+ml(m)+(t!==null&&h.hasAct&&h.hasAct(M.pic,m)?'<small class="g-'+tone(t)+'">'+Math.round(t*100)+'%</small>':'')+'</button>'; }).join("")+'</div>'
      +'<div class="ksp-due">'+T("Hạn gửi: <b>ngày "+dueMonth(M.month)+"</b> · Trưởng bộ phận phản hồi qua email trong 02 ngày làm việc. Báo cáo tháng không cần ký.","Deadline: <b>"+dueMonth(M.month)+"</b> · the Department Head replies by e-mail within 2 working days. No signature needed.")
      +(lsG("mmh_kpi_sentinfo:"+M.pic+":"+M.month)?sentLine(lsG("mmh_kpi_sentinfo:"+M.pic+":"+M.month), en):(sent?'<br><span class="ksp-ok">'+T("Máy này đã gửi lúc ","Sent from this device at ")+esc(new Date(sent).toLocaleString(en?"en-GB":"vi-VN"))+'</span>':''))+'</div></div>'
    +'<div class="ksp-self">'+T("Hệ thống <b>không gửi</b> báo cáo cho người khác. Bấm <b>Soạn email để gửi</b>: nội dung được sao chép sẵn và hộp thư của bạn mở với người nhận, tiêu đề điền sẵn ⇒ dán nội dung, đính kèm file Word và <b>tự gửi</b> từ email của bạn.","The system <b>does not send</b> the report to anyone. Click <b>Compose e-mail</b>: the content is copied and your mailbox opens with the recipients and subject filled in ⇒ paste the content, attach the Word file and <b>send it yourself</b>.")+'</div>'
    +'<div class="kx-f"><label>'+T("Người nhận — bạn tự gửi (To)","Recipients — you send it (To)")+'</label><div class="kx-chips" id="kr2-to"></div></div>'
    +'<div class="kx-f"><label>CC</label><div class="kx-chips" id="kr2-cc"></div><small>'+T("Theo quy trình MMHSOP_009: Trưởng bộ phận + Tổng Giám đốc, CC Kế toán.","Per MMHSOP_009: Department Head + General Director, CC Accounting.")+'</small></div>'
    +'<div class="kx-f"><label>'+T("Tiêu đề","Subject")+'</label><input id="kr2-sub" maxlength="200" value="'+esc(dr.subject||def.subject)+'"></div>'
    +'<div class="kx-f"><label>'+T("Lời chào","Greeting")+'</label><input id="kr2-gr" value="'+esc(dr.greeting||def.greeting)+'"></div>'
    +'<div class="kx-f"><label>'+T("Mở đầu","Opening")+'</label><textarea id="kr2-in" style="min-height:48px">'+esc(dr.intro||def.intro)+'</textarea></div>'
    +'<div class="kx-h5">'+(en?"1. KPI Results Summary":"1. Tổng hợp kết quả KPI")+' <small>'+T("ghi lý do đạt / chưa đạt cho từng chỉ tiêu","state why each target was / was not achieved")+'</small></div>'
    +(rows.length?rows.map(function(r){
        var pctU=/%/.test(r.unit||""), why=(dr.reasons||{})[r.code]||"", p=r.p;
        return '<div class="ksp-k"><div class="h"><span class="cd">'+esc(r.code)+'</span><b title="'+esc(r.kpi||"")+'">'+esc(kName(r, M.lang))+'</b><span class="pc g-'+tone(p)+'">'+esc(pctS(p)||"—")+'</span></div>'
          +'<div class="m">'+T("Mục tiêu","Target")+' '+esc(num(r.t, r.unit)||"—")+' · '+T("Thực tế","Actual")+' '+esc(r.a===null||r.a===undefined?T("chưa có số","no data"):num(r.a, r.unit))+(pctU?"":' '+esc(r.unit||""))+' · '+T("Hệ số","Weight")+' '+esc(pctS(r.w))+'</div>'
          +'<textarea id="kr2-why-'+esc(r.code)+'" placeholder="'+esc(p!==null&&p!==undefined&&p>=1?T("Lý do đạt: …","Reason achieved: …"):T("Lý do chưa đạt: …","Reason not achieved: …"))+'">'+esc(why)+'</textarea></div>';
      }).join(""):'<div class="kp-legend">'+T("Chưa có KPI có hệ số quan trọng trong tháng này.","No weighted KPI this month.")+'</div>')
    +'<div class="kx-h5">'+(en?"2. Analysis and Next Actions":"2. Phân tích và hành động tiếp theo")+'</div>'
    +'<div class="kx-f"><label>'+T("Hành động tháng tới","Actions for next month")+'</label><textarea id="kr2-next" placeholder="'+T("Mỗi dòng 1 ý — cách cải thiện / duy trì cho từng chỉ tiêu, nhất là chỉ tiêu chưa đạt","One idea per line — how to improve / maintain each target, especially those not achieved")+'">'+esc(dr.next||"")+'</textarea></div>'
    +'<div class="kx-h5">'+(en?"3. Highlights and Challenges":"3. Điểm nổi bật và khó khăn")+'</div>'
    +'<div class="kx-f"><label>'+T("Điểm nổi bật","Highlights")+'</label><textarea id="kr2-high" style="min-height:56px" placeholder="'+T("Kết quả nổi bật / điểm làm tốt trong tháng","Outstanding results / what went well")+'">'+esc(dr.high||"")+'</textarea></div>'
    +'<div class="kx-f"><label>'+T("Khó khăn","Challenges")+'</label><textarea id="kr2-chal" style="min-height:56px" placeholder="'+T("Khó khăn khi thực hiện KPI và chỉ tiêu bị ảnh hưởng","Challenges and the targets affected")+'">'+esc(dr.chal||"")+'</textarea></div>'
    +'<div class="kx-f"><label>'+T("Hỗ trợ cần thiết","Support needed")+'</label><textarea id="kr2-supp" style="min-height:48px" placeholder="'+(en?"None":"Không có")+'">'+esc(dr.supp||"")+'</textarea><small>'+T("Nội dung cần hỗ trợ + bộ phận / người có thể hỗ trợ. Để trống = \"Không có\".","What support is needed and who can help. Empty = \"None\".")+'</small></div>'
    +'<div class="kx-f"><label>'+T("Chữ ký","Signature")+'</label><textarea id="kr2-sg" style="min-height:48px">'+esc(dr.sign||def.sign)+'</textarea></div>'
    +'<label class="ksp-cb"><input type="checkbox" id="kr2-q"'+(dr.showQ===false?"":" checked")+'> '+T("Kèm KPI lũy kế quý","Include quarter-to-date KPI")+'</label>'
    +'<label class="ksp-cb"><input type="checkbox" id="kr2-att"'+(dr.att===false?"":" checked")+'> '+T("Đính kèm file Word (biểu mẫu FM01","Attach the Word file (form FM01")+(en?", English)":(uiEn()?", Vietnamese)":", tiếng Việt)"))+'</label>';
  $("kr2-pic").onchange=function(){ mOpen(this.value, M.month); };
  L.querySelectorAll(".kx-months button").forEach(function(b){ b.onclick=function(){ mOpen(M.pic, b.getAttribute("data-m")); }; });
  M.ch.to=chips($("kr2-to"), M.to, mMeta); M.ch.cc=chips($("kr2-cc"), M.cc, mMeta);
  L.querySelectorAll("input,textarea").forEach(function(x){ if(x.closest(".kx-chips")) return; x.addEventListener("input", mDirty); x.addEventListener("change", mDirty); });
  mMeta(); mPreview();
}
function mMeta(){
  var m=$("kr2-meta"); if(!m) return;
  var me=myMail();
  m.innerHTML='<div><b>'+T("Bạn tự gửi từ","You send from")+':</b> '+esc(me||T("email của bạn","your e-mail"))+'</div>'
    +'<div><b>'+T("Tới","To")+':</b> '+(M.to.length?esc(M.to.join(", ")):'<span class="g-low">'+T("chưa có người nhận","no recipient yet")+'</span>')+(M.cc.length?' · CC '+esc(M.cc.join(", ")):'')+'</div>'
    +'<div><b>'+T("Tiêu đề","Subject")+':</b> '+esc(($("kr2-sub")||{}).value||"")+'</div>'
    +(($("kr2-att")||{}).checked?'<div><b>'+T("Đính kèm","Attachment")+':</b> '+esc(mFile())+'</div>':'');
}
function mFile(){ var d=M.data||{}; return fileName("FM01", M.lang, M.month, d.full||(staffOf(M.pic).full)||M.pic); }
function mDirty(){ mSave(); mMeta(); var s=$("kr2-st"); if(s) s.textContent=T("Đang cập nhật bản xem trước…","Updating preview…"); clearTimeout(M.t); M.t=setTimeout(mPreview, 700); }
function mPreview(){
  var f=mFields(), key=M.pic+"|"+M.month; if(($("kr2-att")||{}).checked) f.attName=mFile();
  var s=$("kr2-st"); if(s) s.textContent=T("Đang dựng bản xem trước…","Building preview…");
  post("rhKpiMailPreview", f).then(function(r){
    if(M.pic+"|"+M.month!==key) return;
    $("kr2-frame").srcdoc='<!doctype html><html><head><meta charset="utf-8"><style>body{margin:14px}</style></head><body>'+(r.html||"")+'</body></html>';
    $("kr2-st").textContent=T("✓ Đúng bản sẽ gửi · cập nhật ","✓ Exactly what will be sent · updated ")+new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"});
  }).catch(function(e){ $("kr2-st").textContent="⚠ "+e.message; });
}
function mWord(){
  var f=mFields(), d=M.data||{}, rows=mRows(), full=d.full||(staffOf(M.pic).full)||M.pic, title=d.title||staffOf(M.pic).title||"", dept=d.dept||staffOf(M.pic).dept||"";
  var wsum=rows.reduce(function(a,r){ return a+(Number(r.w)||0); },0), none=M.lang==="en"?"None":"Không có";
  return buildDoc("templates/kpi_fm01_"+M.lang+".docx", function(x){
    x=repeatRow(x, "{R_CODE}", rows, function(tpl, r, k){
      var pctU=/%/.test(r.unit||"");
      return put(tpl, { R_DEPT:k?"":dept, R_STAFF:k?"":full, R_TITLE:k?"":title, R_CODE:r.code, R_NAME:kName(r, M.lang)+(r.unit&&!pctU?" ("+r.unit+")":""),
        R_T:pctU?pctS(r.t):num(r.t,""), R_A:pctU?pctS(r.a):num(r.a,""), R_W:pctS(r.w), R_P:pctS(r.p), R_PW:pctS(r.pw), R_WHY:f.reasons[r.code]||"" });
    });
    return put(x, { YM:M.month, MONTH:(M.lang==="en"?"":"Tháng ")+ml(M.month), T_WHO:full+(title?", "+title:""), T_W:pctS(wsum||d.wsum), T_PW:pctS(d.total),
      NEXT:f.next?"\n"+f.next:"", HIGH:f.high?"\n"+f.high:"", CHAL:f.chal?"\n"+f.chal:"", SUPP:f.supp||none });
  });
}
function mDownload(){
  var b=$("kr2-dl"), t0=b.textContent; b.disabled=true; b.textContent=T("Đang tạo file…","Building…");
  mWord().then(function(blob){ saveBlob(blob, mFile()); b.disabled=false; b.textContent=t0; toast(T("Đã tạo ","Created ")+mFile()); },
    function(e){ b.disabled=false; b.textContent=t0; toast("⚠ "+e.message); });
}
/* v1.2 — bản sao tham khảo về email của CHÍNH MÌNH (không phải gửi chính thức) */
function mSend(){
  M.ch.to&&M.ch.to.flush(); M.ch.cc&&M.ch.cc.flush();
  var f=mFields(), me=myMail();
  if(!me){ toast(T("Chưa có email của bạn — đăng nhập lại.","Your e-mail is unknown — sign in again.")); return; }
  var miss=mMissing();
  if(miss.length){ toast(T("Còn "+miss.length+" chỉ tiêu chưa ghi lý do đạt / chưa đạt: ","Reason missing for "+miss.length+" target(s): ")+miss.map(function(r){ return r.code; }).join(", ")); var t=$("kr2-why-"+miss[0].code); if(t){ t.focus(); t.scrollIntoView({block:"center",behavior:"smooth"}); } return; }
  if(!f.next.trim()){ toast(T("Vui lòng ghi Hành động tháng tới (mục 2).","Please fill in Actions for next month (section 2).")); $("kr2-next").focus(); return; }
  f.to=me; f.cc=""; f.fwdTo=M.to.join(","); f.fwdCc=M.cc.join(","); f.self="1";
  var b=$("kr2-send"), t0=b.textContent; b.disabled=true; b.textContent=T("Đang gửi…","Sending…");
  var att=($("kr2-att")||{}).checked;
  (att?mWord().then(b64):Promise.resolve("")).then(function(x){ if(x){ f.attB64=x; f.attName=mFile(); } return post("rhKpiMailSend", f); }).then(function(r){
    b.disabled=false; b.textContent=t0; toast(T("Đã gửi bản sao về ","Copy sent to ")+me);
    if(!lsG("mmh_kpi_sent:"+M.pic+":"+M.month)) lsS("mmh_kpi_sentinfo:"+M.pic+":"+M.month, { self:true, to:[me], at:(r.sent&&r.sent.at)||new Date().toLocaleString("vi-VN") }); mForm();
  }, function(e){ b.disabled=false; b.textContent=t0; toast(T("⚠ Chưa gửi được: ","⚠ Not sent: ")+e.message); var m=$("kr2-msg"); if(m) m.textContent=T("⚠ Chưa gửi được: ","⚠ Not sent: ")+e.message; });
}
/* ── v1.2 — TỰ SOẠN EMAIL: sao chép nội dung (HTML) + mở hộp thư với To · CC · Tiêu đề điền sẵn ── */
function rawMail(){ return String((H().myEmail&&H().myEmail())||"").trim(); }
function composeLinks(to, cc, sub, body){
  var e=encodeURIComponent, b=String(body||"");
  return { outlook:"https://outlook.office.com/mail/deeplink/compose?to="+e(to.join(";"))+(cc.length?"&cc="+e(cc.join(";")):"")+"&subject="+e(sub)+(b?"&body="+e(b):""),
           gmail:"https://mail.google.com/mail/?view=cm&fs=1&to="+e(to.join(","))+(cc.length?"&cc="+e(cc.join(",")):"")+"&su="+e(sub)+(b?"&body="+e(b):""),
           app:"mailto:"+to.map(e).join(",")+"?"+(cc.length?"cc="+cc.map(e).join(",")+"&":"")+"subject="+e(sub)+(b?"&body="+e(b):"") };
}
function copyHtml(html, text){
  var ok=function(){ return true; };
  try{ if(window.ClipboardItem && navigator.clipboard && navigator.clipboard.write)
    return navigator.clipboard.write([new ClipboardItem({ "text/html":new Blob([html],{type:"text/html"}), "text/plain":new Blob([text],{type:"text/plain"}) })]).then(ok, fb); }catch(_){}
  return Promise.resolve(fb());
  function fb(){ var d=document.createElement("div"); d.contentEditable="true"; d.style.cssText="position:fixed;left:-9999px;top:0"; d.innerHTML=html; document.body.appendChild(d);
    var r=document.createRange(); r.selectNodeContents(d); var sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); var k=false; try{ k=document.execCommand("copy"); }catch(_){} sel.removeAllRanges(); d.remove(); return k; }
}
/* thanh trong chân khung: mở hộp thư · tải Word · Đã gửi */
function composeBar(ftId, o){
  var ft=$(ftId); if(!ft) return;
  var old=ft.querySelector(".ksp-ask"); if(old) old.remove();
  var L=composeLinks(o.to, o.cc, o.sub, o.body), raw=rawMail(), pref=/@mani\.inc$/i.test(raw)?"outlook":/@manimedicalhanoi\.com$/i.test(raw)?"gmail":"app";
  var a=function(k, t){ return '<a class="kp-btn'+(k===pref?' pri':'')+'" target="_blank" rel="noopener" href="'+esc(L[k])+'">'+t+'</a>'; };
  var box=document.createElement("div"); box.className="ksp-ask ksp-compose";
  box.innerHTML='<span class="t">'+(o.copied?T("✓ Đã sao chép nội dung email. ","✓ E-mail content copied. "):"")+T("Mở hộp thư của bạn ⇒ dán nội dung (Ctrl+V) ⇒ đính kèm file Word ⇒ <b>tự gửi</b>.","Open your mailbox ⇒ paste the content (Ctrl+V) ⇒ attach the Word file ⇒ <b>send it yourself</b>.")+'</span>'
    +a("outlook","Outlook")+a("gmail","Gmail")+a("app",T("Ứng dụng mail","Mail app"))
    +'<button type="button" class="kp-btn" data-a="word">'+T("Tải file Word","Download Word")+'</button>'
    +'<button type="button" class="kp-btn" data-a="done">'+T("Đã gửi","I have sent it")+'</button>'
    +'<button type="button" class="kp-btn" data-a="x" title="'+T("Đóng","Close")+'">×</button>';
  ft.classList.add("asking"); ft.appendChild(box);
  box.querySelector('[data-a="word"]').onclick=o.word;
  box.querySelector('[data-a="done"]').onclick=function(){ box.remove(); ft.classList.remove("asking"); o.done(); };
  box.querySelector('[data-a="x"]').onclick=function(){ box.remove(); ft.classList.remove("asking"); };
}
function mCompose(){
  M.ch.to&&M.ch.to.flush(); M.ch.cc&&M.ch.cc.flush();
  var f=mFields(), miss=mMissing();
  if(miss.length){ toast(T("Còn "+miss.length+" chỉ tiêu chưa ghi lý do đạt / chưa đạt: ","Reason missing for "+miss.length+" target(s): ")+miss.map(function(r){ return r.code; }).join(", ")); var t=$("kr2-why-"+miss[0].code); if(t){ t.focus(); t.scrollIntoView({block:"center",behavior:"smooth"}); } return; }
  if(!f.next.trim()){ toast(T("Vui lòng ghi Hành động tháng tới (mục 2).","Please fill in Actions for next month (section 2).")); $("kr2-next").focus(); return; }
  if(!M.to.length){ toast(T("Chưa có người nhận (To).","No recipient (To).")); return; }
  var fr=$("kr2-frame"), doc=fr&&fr.contentDocument, html=doc&&doc.body?doc.body.innerHTML:"", text=doc&&doc.body?doc.body.innerText:"";
  if(!html){ var sd=fr?String(fr.srcdoc||""):""; var m=/<body[^>]*>([\s\S]*)<\/body>/i.exec(sd); html=m?m[1]:sd; var tmp=document.createElement("div"); tmp.innerHTML=html; text=tmp.innerText||tmp.textContent||""; }
  copyHtml(html, text).then(function(ok){
    composeBar("kr2-ft", { to:M.to.slice(), cc:M.cc.slice(), sub:f.subject, body:"", copied:ok!==false, word:mDownload,
      done:function(){ post("rhKpiSent",{ pic:M.pic, kind:"m", month:M.month, to:M.to.concat(M.cc).join(","), lang:M.lang==="en"?"en":"" }).catch(function(){}); lsS("mmh_kpi_sent:"+M.pic+":"+M.month, Date.now()); lsS("mmh_kpi_sentinfo:"+M.pic+":"+M.month, { mine:true, to:M.to.join(", "), at:new Date().toLocaleString(uiEn()?"en-GB":"vi-VN") }); mForm(); toast(T("Đã ghi nhận — thôi nhắc hạn tháng này.","Recorded — no more reminders this month.")); } });
  });
}
function qCompose(){
  Q.ch.to&&Q.ch.to.flush(); Q.ch.cc&&Q.ch.cc.flush(); qSave();
  if(!Q.to.length){ toast(T("Chưa có người nhận (To).","No recipient (To).")); return; }
  var body=($("kq-body")||{}).value||"", sub=($("kq-sub")||{}).value||"";
  var html=body.split(/\r?\n/).map(function(l){ return l?'<div>'+esc(l)+'</div>':'<div><br></div>'; }).join("");
  copyHtml(html, body).then(function(ok){
    composeBar("kq-ft", { to:Q.to.slice(), cc:Q.cc.slice(), sub:sub, body:body.length<1500?body:"", copied:ok!==false, word:qDownload,
      done:function(){ post("rhKpiSent",{ pic:Q.pic, kind:"q", fy:Q.fy, q:Q.q, to:Q.to.concat(Q.cc).join(","), lang:Q.lang==="en"?"en":"" }).catch(function(){}); var k="mmh_se_sent:"+Q.pic+":FY"+Q.fy+Q.q; try{ localStorage.setItem(k, String(Date.now())); }catch(_){} lsS("mmh_kq_sent:"+Q.pic+":FY"+Q.fy+Q.q, Date.now()); toast(T("Đã ghi nhận — thôi nhắc hạn quý này.","Recorded — no more reminders this quarter.")); } });
  });
}
/* sao chép người nhận gợi ý (To / CC) để dán vào email tự gửi */
function copyRcpt(to, cc){
  var txt="To: "+to.join("; ")+(cc.length?"\nCC: "+cc.join("; "):"");
  var done=function(){ toast(T("Đã sao chép người nhận","Recipients copied")); };
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, function(){ fb(); }); return; } }catch(_){}
  fb();
  function fb(){ var t=document.createElement("textarea"); t.value=txt; t.style.position="fixed"; t.style.opacity="0"; document.body.appendChild(t); t.select(); try{ document.execCommand("copy"); done(); }catch(_){ toast(txt); } t.remove(); }
}
function mOpen(pic, month){
  if(!(window.AUTH && AUTH.tk())){ toast(T("Báo cáo KPI cần đăng nhập bằng email.","The KPI report needs an e-mail sign-in.")); if(window.AUTH&&AUTH.open) AUTH.open(); return; }
  var o=ov("kr2", T("Báo cáo KPI tháng · MMHSOP_009-FM01","Monthly KPI Report · MMHSOP_009-FM01"), [T("Chọn tháng","Month"),T("Lý do từng chỉ tiêu","Reasons"),T("Hành động · nổi bật · khó khăn","Actions · highlights"),T("Xem trước & gửi","Preview & send")]);
  if(!$("kr2-frame")){
    o.querySelector(".kx-r").innerHTML='<div class="kx-st" id="kr2-st"></div><div class="kx-prev"><div class="meta" id="kr2-meta"></div><iframe id="kr2-frame" title="'+T("Xem trước email","E-mail preview")+'" sandbox=""></iframe></div>';
    o.querySelector(".kx-ft").id="kr2-ft"; o.querySelector(".kx-ft").innerHTML='<span class="msg" id="kr2-msg"></span><button class="kp-btn" id="kr2-dl">'+T("Tải file Word","Download Word")+'</button><button class="kp-btn" id="kr2-send">'+T("Gửi bản sao về email của tôi","Send a copy to my e-mail")+'</button><button class="kp-btn pri" id="kr2-mail">'+T("Soạn email để gửi","Compose e-mail")+'</button>';
    $("kr2-dl").onclick=mDownload; $("kr2-send").onclick=function(){ mSend(); }; $("kr2-mail").onclick=mCompose;
  }
  o.classList.add("show");
  o.querySelector(".kx-l").innerHTML='<div class="kp-skel"></div><div class="kp-skel" style="width:70%"></div>'; $("kr2-meta").innerHTML=""; $("kr2-frame").srcdoc=""; $("kr2-msg").textContent="";
  (window.KPI&&KPI.ensure?KPI.ensure():Promise.resolve()).then(function(){
    var h=H(), d=D();
    if(!d){ o.querySelector(".kx-l").innerHTML='<div class="kp-empty">'+esc(st().err||T("Chưa tải được KPI.","KPI not loaded."))+'</div>'; return; }
    var mem=h.members?h.members():[];
    M.pic=pic||M.pic||st().who||d.me; if(mem.indexOf(M.pic)<0) M.pic=mem.indexOf(d.me)>=0?d.me:(mem[0]||"");
    var ms=h.months?h.months():[], wa=h.monthsWithAct?h.monthsWithAct():[];
    M.month=month||M.month||(h.ymPrev?h.ymPrev(h.ymNow()):""); if(ms.indexOf(M.month)<0) M.month=wa[wa.length-1]||ms[0]||"";
    M.lang=docLang(M.pic);
    $("kr2-st").textContent=T("Đang lấy số liệu và người nhận…","Loading figures and recipients…");
    post("rhKpiMail",{ pic:M.pic, month:M.month }).then(function(r){
      M.data=r.data||{}; M.to.length=0; M.cc.length=0; splitMails(M.data.to).forEach(function(e){ M.to.push(e); }); splitMails(M.data.cc).forEach(function(e){ if(M.to.indexOf(e)<0) M.cc.push(e); });
      var mm=splitMails(h.myEmail?h.myEmail():"")[0]; if(mm && M.to.indexOf(mm)<0 && M.cc.indexOf(mm)<0) M.cc.push(mm);
      if(!M.data.rows) M.data.rows=fallbackRows(M.pic, M.month);
      mForm();
      if(M.data.miss && M.data.miss.length) $("kr2-msg").textContent=T("⚠ Chưa có email của: ","⚠ No e-mail for: ")+M.data.miss.join(", ")+" (KPI EMAIL DIRECTORY)";
    }).catch(function(e){ M.data={ rows:fallbackRows(M.pic, M.month) }; M.to.length=0; M.cc.length=0; mForm(); $("kr2-msg").textContent="⚠ "+e.message; });
  });
}
/* số liệu tháng từ dữ liệu KPI trên máy (khi backend chưa trả rows) */
function fallbackRows(pic, per){
  var h=H(), PI=h.PI||{t:0,a:1,w:2,p:3,pw:4}, q=h.qOf?h.qOf(per):"";
  return (h.rowsOf?h.rowsOf(pic):[]).map(function(r){ var v=h.vals(r,per)||[], vq=h.vals(r,q)||[], w=v[PI.w]!=null?v[PI.w]:vq[PI.w]; if(!w) return null;
    return { code:r.code, kpi:r.name, name:r.name, unit:r.unit, group:r.group, w:w, t:v[PI.t], a:v[PI.a], p:v[PI.p], pw:v[PI.pw] }; }).filter(Boolean);
}

/* ════════════════ BÁO CÁO KPI QUÝ — FM02 ════════════════ */
var Q={ pic:"", fy:0, q:"", to:[], cc:[], ch:{}, lang:"vi", rate:"", sc:{}, place:"" };
var RATES={ vi:[["EE","Vượt quá mong đợi"],["AE","Đạt được mong đợi"],["PA","Đạt được một phần mong đợi"],["NA","Không đạt được mong đợi"]],
            en:[["EE","Exceeds Expectations"],["AE","Achieves Expectations"],["PA","Partially Achieves Expectations"],["NA","Does Not Achieve Expectations"]] };
var BS={ vi:[["B1","Mục tiêu và định hướng",1],["B2","Kế hoạch hành động",1],["B3","Cải tiến trong công việc"],["B4","Phát triển đội nhóm và phối hợp"],["B5","Thực hiện và đạt kết quả"],["BG","Đánh giá chung về Năng lực"]],
         en:[["B1","Goals and direction",1],["B2","Action plan",1],["B3","Work improvement"],["B4","Team development and collaboration"],["B5","Execution and results delivery"],["BG","Overall competency rating"]] };
var BHINT={ B1:["Mục tiêu, định hướng liên quan đến các KPI trong kỳ.","Goals and direction related to the KPIs for the period."],
  B2:["Công việc cụ thể, thời hạn, kết quả mong đợi; liên kết với mục tiêu chung của công ty / nhóm.","Specific tasks, deadlines, expected results; how they link to company / team goals."],
  B3:["Cải tiến đã thực hiện trong kỳ và hiệu quả đối với công việc.","Improvements made during the period and their impact."],
  B4:["Thái độ làm việc nhóm, đóng góp xây dựng nhóm, phối hợp liên phòng ban (trưởng nhóm: đào tạo, hướng dẫn nhân viên).","Teamwork, contribution to the team and cross-department collaboration (leaders: coaching staff)."],
  B5:["Giải thích kết quả từng KPI đạt / chưa đạt và nguyên nhân; đóng góp cá nhân; nội dung cần cải thiện và hành động tiếp theo.","Why each KPI was / was not achieved; personal contribution; what to improve and next actions."],
  BG:["Tự nhận xét chung về năng lực trong kỳ.","Overall comment on competencies."] };
function qKey(){ return "mmh_kq:"+Q.pic+":FY"+Q.fy+Q.q; }
function qDraft(){
  var d=lsG(qKey());
  if(!d){ var o=lsG("mmh_se:"+Q.pic+":FY"+Q.fy+Q.q); if(o) d={ b:{ B1_START:o.B1_START, B1_END:o.B1_END, B2_START:o.B2_START, B2_END:o.B2_END, B3:o.B3, B4:o.B4, B5:o.B5, BG:o.BG }, sc:{ B1:o.B1_S, B2:o.B2_S, B3:o.B3_S, B4:o.B4_S, B5:o.B5_S, BG:o.BG_S }, good:o.GOOD, imp:o.IMPROVE, rate:o.RATE }; }
  return d||{};
}
function qPeople(){
  var O=(D()&&D().org)||[], s=staffOf(Q.pic), mine=O.filter(function(x){ return x.key===Q.pic; })[0]||s;
  var isHOD=/hod/i.test(mine.role||"");
  var hod=O.filter(function(x){ return x.key!==Q.pic && x.dept && x.dept===mine.dept && /hod/i.test(x.role||""); })[0];
  var tl=mine.team?O.filter(function(x){ return x.key!==Q.pic && x.team===mine.team && /team leader/i.test(x.role||""); })[0]:null;
  var dir=O.filter(function(x){ return /director/i.test(x.level||"")||/director/i.test(x.role||""); })[0]||{full:"Nguyễn Thị Thu Hà"};
  var head=isHOD?null:(hod||tl||null);
  return { me:mine, s:s, head:head, dir:dir };
}
function qRows(){
  var h=H(), PI=h.PI||{t:0,a:1,w:2,p:3,pw:4}, qm=h.qMonths?h.qMonths(Q.fy,Q.q):[], wa=qm.filter(function(m){ return h.hasAct&&h.hasAct(Q.pic,m); }), upd=wa[wa.length-1];
  var dr=qDraft().det||{};
  return (h.rowsOf?h.rowsOf(Q.pic):[]).filter(function(r){ var v=h.vals(r,Q.q); return v && v[PI.w]; }).map(function(r,i){
    var v=h.vals(r,Q.q), p=v[PI.p], cap=!isSales(r) && p!==null && p>1.3, pr=cap?1.3:p, w=v[PI.w], pctU=/%/.test(r.unit||"");
    var en=Q.lang==="en", t=pctU?pctS(v[PI.t]):num(v[PI.t],""), a=v[PI.a]===null?"":(pctU?pctS(v[PI.a]):num(v[PI.a],""));
    var auto=(en?"Target: ":"Mục tiêu: ")+(t||"—")+(pctU?"":" "+(r.unit||""))+" · "+(en?"Actual: ":"Thực tế: ")+(a||(en?"no data yet":"chưa có số"))+(a&&!pctU?" "+(r.unit||""):"")
      +(upd?(en?" (to "+ml(upd)+")":" (đến tháng "+ml(upd)+")"):"")+(cap?(en?" · capped at 130%":" · ghi nhận tối đa 130%"):"");
    return { r:r, no:String(i+1), code:r.code, name:kName(r, Q.lang), w:w, p:p, pr:pr, wr:(pr===null||pr===undefined||w===null)?null:pr*w, cap:cap, auto:auto, det:dr[r.code]!=null?dr[r.code]:auto };
  });
}
function qSave(){
  var b={}, L=$("kq")&&$("kq").querySelector(".kx-l"); if(!L) return;
  BS.vi.forEach(function(x){ if(x[2]){ b[x[0]+"_START"]=($("kq-"+x[0]+"a")||{}).value||""; b[x[0]+"_END"]=($("kq-"+x[0]+"b")||{}).value||""; } else b[x[0]]=($("kq-"+x[0])||{}).value||""; });
  var det={}; qRows().forEach(function(x){ var t=$("kq-det-"+x.code); if(t && t.value!==x.auto) det[x.code]=t.value; });
  var old=qDraft();
  lsS(qKey(), { b:b, sc:Q.sc, good:($("kq-good")||{}).value||"", imp:($("kq-imp")||{}).value||"", rate:Q.rate, det:Object.keys(det).length?det:(old.det||{}),
    sub:($("kq-sub")||{}).value||"", body:($("kq-body")||{}).value||"" });
  if(($("kq-place")||{}).value!==undefined) lsS("mmh_kq_place:"+Q.pic, $("kq-place").value);
}
function qForm(){
  var o=$("kq"), L=o.querySelector(".kx-l"), h=H(), dr=qDraft(), en=Q.lang==="en", B=BS[Q.lang], R=RATES[Q.lang], P=qPeople();
  Q.rate=dr.rate||""; Q.sc=Object.assign({}, dr.sc||{}); var bb=dr.b||{};
  var full=P.s.full||Q.pic, per="FY"+Q.fy+" "+Q.q;
  var sent=lsG("mmh_se_sent:"+Q.pic+":FY"+Q.fy+Q.q)||lsG("mmh_kq_sent:"+Q.pic+":FY"+Q.fy+Q.q);
  var sc=function(k){ return '<div class="kx-sc" data-k="'+k+'">'+[1,2,3,4,5].map(function(n){ return '<button type="button" data-n="'+n+'" class="'+(String(Q.sc[k])===String(n)?"on":"")+'">'+n+'</button>'; }).join("")+'</div>'; };
  var names=[P.head&&(P.head.key||P.head.full), P.dir&&(P.dir.key||P.dir.full)].filter(Boolean);
  var defSub=(en?"Quarterly KPI Report ":"Báo cáo KPI Quý ")+per+" (MMHSOP_009-FM02) · "+full;
  var defBody=en?"Dear "+(names.join(", ")||"all")+",\n\nPlease find attached my Quarterly KPI Report "+per+" (form MMHSOP_009-FM02 – Setting Expectations and Performance Assessment) for your comments, approval and signature.\n\nBest regards,\n"+full
                :"Dear anh/chị"+(names.length?" "+names.join(", "):"")+",\n\nEm gửi Báo cáo KPI Quý "+per+" (biểu mẫu MMHSOP_009-FM02 – Thiết lập mục tiêu và đánh giá kết quả) trong file Word đính kèm để anh/chị nhận xét, phê duyệt và ký.\n\nBest regards,\n"+full;
  var fys=[Q.fy], qs=["Q1","Q2","Q3","Q4"];
  L.innerHTML='<div class="kx-row"><div class="kx-f"><label>'+T("Người được đánh giá","Employee")+'</label><select id="kq-pic">'+(h.members?h.members():[]).map(function(m){ return '<option'+(m===Q.pic?" selected":"")+'>'+esc(m)+'</option>'; }).join("")+'</select></div>'
    +'<div class="kx-f"><label>'+T("Kỳ đánh giá","Period")+'</label><select id="kq-q">'+fys.map(function(fy){ return qs.map(function(q){ return '<option value="'+fy+'|'+q+'"'+(fy===Q.fy&&q===Q.q?" selected":"")+'>'+q+' FY'+fy+'</option>'; }).join(""); }).join("")+'</select></div></div>'
    +'<div class="ksp-due">'+T("Hạn nộp: <b>ngày "+dueQuarter(Q.fy,Q.q)+"</b> (ngày 05 tháng đầu quý kế tiếp). KPI quý ghi ngay đầu quý; mục 1, 2 điền đầu quý, cuối quý đối chiếu; mục 3–5 điền cuối quý.","Deadline: <b>"+dueQuarter(Q.fy,Q.q)+"</b> (day 05 of the first month of the next quarter). Items 1–2 at the start of the quarter, reviewed at the end; items 3–5 at the end.")
      +(sent?'<br><span class="ksp-ok">'+T("Máy này đã gửi lúc ","Sent from this device at ")+esc(new Date(sent).toLocaleString(en?"en-GB":"vi-VN"))+'</span>':'')+'</div>'
    +'<div class="kx-f"><label>'+(en?"Work location":"Nơi làm việc")+'</label><input id="kq-place" value="'+esc(lsG("mmh_kq_place:"+Q.pic)||"")+'" placeholder="'+(en?"e.g. Bangkok":"VD: Hà Nội")+'"></div>'
    +'<div class="kx-h5">'+(en?"B. Competencies":"B. Năng lực")+' <small>'+T("điểm 1–5 có thể để trống để Trưởng bộ phận đánh giá","score 1–5 may be left for the Department Head")+'</small></div>'
    +B.map(function(x,i){
      var hint=BHINT[x[0]][en?1:0];
      return '<div class="kx-f"><label>'+(x[0]==="BG"?"":(i+1)+". ")+esc(x[1])+'</label>'
        +(x[2]?'<textarea id="kq-'+x[0]+'a" placeholder="'+esc((en?"Beginning of quarter: ":"Đầu quý: ")+hint)+'" style="min-height:52px">'+esc(bb[x[0]+"_START"]||"")+'</textarea><textarea id="kq-'+x[0]+'b" placeholder="'+(en?"End-of-quarter review: …":"Đối chiếu cuối quý: …")+'" style="min-height:52px;margin-top:5px">'+esc(bb[x[0]+"_END"]||"")+'</textarea>'
              :'<textarea id="kq-'+x[0]+'" placeholder="'+esc(hint)+'" style="min-height:58px">'+esc(bb[x[0]]||"")+'</textarea>')
        +'<div class="ksp-sc"><small>'+T("Đánh giá (1–5)","Rating (1–5)")+'</small>'+sc(x[0])+'</div></div>';
    }).join("")
    +'<div class="kx-h5">'+(en?"C. Summary — Self-assessment":"C. Tổng kết — Tự đánh giá")+'</div>'
    +'<div class="kx-f"><label>'+(en?"Strengths":"Điểm tốt")+'</label><textarea id="kq-good">'+esc(dr.good||"")+'</textarea></div>'
    +'<div class="kx-f"><label>'+(en?"Areas for improvement and next actions":"Cần cải thiện và hành động tiếp theo")+'</label><textarea id="kq-imp">'+esc(dr.imp||"")+'</textarea></div>'
    +'<div class="kx-f"><label>'+T("Mức tự đánh giá","Self-rating")+'</label><div class="kx-rate">'+R.map(function(r){ return '<button type="button" data-r="'+r[0]+'" class="'+(Q.rate===r[0]?"on":"")+'"><b>'+r[0]+'</b>'+esc(r[1])+'</button>'; }).join("")+'</div>'
      +'<small>'+T("Nhận xét của Trưởng bộ phận, đánh giá của Tổng Giám đốc và chữ ký: để trống trong file Word.","Department Head comments, General Director rating and signatures stay blank in the Word file.")+'</small></div>'
    +'<div class="kx-h5">'+T("Email soạn sẵn","Prepared e-mail")+' <small>'+T("bạn tự gửi từ email của mình — file Word đính kèm","you send it from your own e-mail — Word file attached")+'</small></div>'
    +'<div class="ksp-self">'+T("Hệ thống <b>không gửi</b> báo cáo cho người khác. Bấm <b>Soạn email để gửi</b> ⇒ hộp thư của bạn mở với người nhận, tiêu đề, nội dung điền sẵn ⇒ đính kèm file Word và <b>tự gửi</b> tới Trưởng bộ phận + Tổng Giám đốc, CC Kế toán.","The system <b>does not send</b> the report to anyone. Click <b>Compose e-mail</b> ⇒ your mailbox opens with the recipients, subject and message filled in ⇒ attach the Word file and <b>send it yourself</b> to the Department Head + General Director, CC Accounting.")+'</div>'
    +'<div class="kx-f"><label>'+T("Người nhận — bạn tự gửi (To)","Recipients — you send it (To)")+'</label><div class="kx-chips" id="kq-to"></div></div>'
    +'<div class="kx-f"><label>CC</label><div class="kx-chips" id="kq-cc"></div></div>'
    +'<div class="kx-f"><label>'+T("Tiêu đề","Subject")+'</label><input id="kq-sub" maxlength="200" value="'+esc(dr.sub||defSub)+'"></div>'
    +'<div class="kx-f"><label>'+T("Nội dung","Message")+'</label><textarea id="kq-body" style="min-height:120px">'+esc(dr.body||defBody)+'</textarea></div>';
  $("kq-pic").onchange=function(){ qSave(); qOpen(this.value, Q.fy, Q.q); };
  $("kq-q").onchange=function(){ qSave(); var p=this.value.split("|"); qOpen(Q.pic, +p[0], p[1]); };
  L.querySelectorAll("textarea,input").forEach(function(t){ if(t.closest(".kx-chips")) return; t.addEventListener("input", qSave); });
  L.querySelectorAll(".kx-sc button").forEach(function(b){ b.onclick=function(){ var k=b.parentNode.getAttribute("data-k"), n=b.getAttribute("data-n"); Q.sc[k]=String(Q.sc[k])===n?"":n; b.parentNode.querySelectorAll("button").forEach(function(x){ x.classList.toggle("on", String(Q.sc[k])===x.getAttribute("data-n")); }); qSave(); }; });
  L.querySelectorAll(".kx-rate button").forEach(function(b){ b.onclick=function(){ Q.rate=Q.rate===b.getAttribute("data-r")?"":b.getAttribute("data-r"); L.querySelectorAll(".kx-rate button").forEach(function(x){ x.classList.toggle("on", Q.rate===x.getAttribute("data-r")); }); qSave(); }; });
  Q.ch.to=chips($("kq-to"), Q.to); Q.ch.cc=chips($("kq-cc"), Q.cc);
  qRight();
}
function qRight(){
  var R=qRows(), P=qPeople(), en=Q.lang==="en", h=H(), tone=function(v){ return h.tone?h.tone(v):"na"; };
  var tw=R.reduce(function(a,r){ return a+(r.w||0); },0), tr=R.reduce(function(a,r){ return a+(r.wr||0); },0), qm=h.qMonths?h.qMonths(Q.fy,Q.q):[];
  var head=[[en?"Full name":"Họ tên",P.s.full||Q.pic],[en?"Department":"Bộ phận",uniqJoin([P.me.dept||P.s.dept,P.me.team||P.s.team])],[en?"Job title":"Chức danh",P.s.title||""],
    [en?"Department Head":"Trưởng bộ phận",P.head?P.head.full||P.head.key:"—"],[en?"General Director":"Tổng Giám đốc",P.dir.full||""],[en?"Evaluation period":"Kỳ đánh giá",Q.q+"/FY"+Q.fy+(qm.length?" ("+ml(qm[0])+" – "+ml(qm[2])+")":"")]];
  var r=$("kq").querySelector(".kx-r");
  if(en) head.forEach(function(x){ x[1]=noAcc(x[1]); });
  r.innerHTML='<div class="kx-st">'+T("Phần tự điền vào file Word (biểu mẫu ","Filled into the Word file (form ")+'MMHSOP_009-FM02, '+(en?"English":T("tiếng Việt","Vietnamese"))+')</div>'
    +'<div class="kp-box" style="margin-bottom:12px"><table class="kx-tbl"><tbody>'+head.map(function(x){ return '<tr><td style="width:160px;color:#5E738C">'+esc(x[0])+'</td><td><b>'+esc(x[1]||"—")+'</b></td></tr>'; }).join("")+'</tbody></table></div>'
    +'<div class="kp-box"><h4>'+(en?"A. Goals":"A. Mục tiêu")+' — KPI '+esc(Q.q+" FY"+Q.fy)+' <small>'+T("số từ file MMH KPI · sửa được phần chi tiết kết quả","figures from the MMH KPI file · result details editable")+'</small></h4>'
    +(R.length?'<table class="kx-tbl ksp-a"><thead><tr><th>KPI</th><th>'+(en?"KPI description":"Nội dung KPI")+'</th><th>'+(en?"Results achieved vs target":"Chi tiết kết quả đạt được so với mục tiêu")+'</th><th>'+(en?"Weight":"Hệ số quan trọng")+'</th><th>'+(en?"Result":"Kết quả")+'</th><th>'+(en?"Weight × Result":"Hệ số × Kết quả")+'</th></tr></thead><tbody>'
      +R.map(function(x){ return '<tr><td><b>'+x.no+'</b></td><td><span class="cd">'+esc(x.code)+'</span> '+esc(x.name)+'</td><td><textarea id="kq-det-'+esc(x.code)+'" class="ksp-det">'+esc(x.det)+'</textarea></td><td class="n">'+esc(pctS(x.w))+'</td>'
        +'<td class="n g-'+tone(x.pr)+'"><b>'+esc(pctS(x.pr)||"—")+'</b>'+(x.cap?'<small class="ksp-cap" title="'+esc(T("Thực tế ","Actual ")+pctS(x.p))+'">'+T("tối đa 130%","capped 130%")+'</small>':'')+'</td><td class="n">'+esc(pctS(x.wr)||"—")+'</td></tr>'; }).join("")
      +'<tr><td></td><td colspan="2"><b>'+(en?"Total KPI Score":"Tổng điểm KPI")+'</b></td><td class="n"><b>'+esc(pctS(tw))+'</b></td><td></td><td class="n"><b class="g-'+tone(tr)+'">'+esc(pctS(tr))+'</b></td></tr></tbody></table>'
      +'<div class="kp-legend">'+(en?"*Except for sales KPIs, the recognized result of other KPIs is capped at 130%.":"*Ngoại trừ KPI doanh số bán hàng, các KPI khác kết quả ghi nhận tối đa không quá 130%.")+'</div>'
      :'<div class="kp-legend">'+T("Chưa có KPI có hệ số quan trọng trong ","No weighted KPI in ")+esc(Q.q)+'.</div>')+'</div>';
  r.querySelectorAll(".ksp-det").forEach(function(t){ t.addEventListener("input", qSave); });
}
function qFile(){ var P=qPeople(); return fileName("FM02", Q.lang, "FY"+Q.fy+"_"+Q.q, P.s.full||Q.pic); }
function qWord(){
  qSave();
  var R=qRows(), P=qPeople(), dr=qDraft(), en=Q.lang==="en", bb=dr.b||{}, h=H(), qm=h.qMonths?h.qMonths(Q.fy,Q.q):[];
  var nm=function(s){ return en?noAcc(s):s; };
  var tw=R.reduce(function(a,r){ return a+(r.w||0); },0), tr=R.reduce(function(a,r){ return a+(r.wr||0); },0);
  var V={ NAME:nm(P.s.full||Q.pic), DEPT:uniqJoin([P.me.dept||P.s.dept,P.me.team||P.s.team]), TITLE:P.s.title||"", MANAGER:nm(P.head?(P.head.full||P.head.key):""),
    PLACE:lsG("mmh_kq_place:"+Q.pic)||"", DIRECTOR:nm(P.dir.full||""), DATE:today(), PERIOD:Q.q+"/FY"+Q.fy+(qm.length?" ("+ml(qm[0])+" – "+ml(qm[2])+")":""),
    T_W:pctS(tw), T_R:pctS(tr), GOOD:dr.good||"", IMPROVE:dr.imp||"", SIGN_DATE:"" };
  BS.vi.forEach(function(x){ if(x[2]){ V[x[0]+"_START"]=bb[x[0]+"_START"]||""; V[x[0]+"_END"]=bb[x[0]+"_END"]||""; } else V[x[0]]=bb[x[0]]||""; V[x[0]+"_S"]=(dr.sc||{})[x[0]]||""; });
  ["EE","AE","PA","NA"].forEach(function(k){ V["SE_"+k]=dr.rate===k?"✓":""; });
  return buildDoc("templates/kpi_fm02_"+Q.lang+".docx", function(x){
    x=repeatRow(x, "{K_NO}", R, function(tpl, r){ return put(tpl, { K_NO:r.no, K_DESC:r.code+" · "+r.name, K_DET:r.det, K_W:pctS(r.w), K_R:pctS(r.pr)+(r.cap?"*":""), K_WR:pctS(r.wr) }); });
    return put(x, V);
  });
}
function qDownload(){
  var b=$("kq-dl"), t0=b.textContent; b.disabled=true; b.textContent=T("Đang tạo file…","Building…");
  qWord().then(function(blob){ saveBlob(blob, qFile()); b.disabled=false; b.textContent=t0; toast(T("Đã tạo ","Created ")+qFile()); lsS("mmh_se_done:"+Q.pic+":FY"+Q.fy+Q.q, Date.now());
    try{ if(window.TESTFLOW && TESTFLOW.on()) TESTFLOW.add({ action:"seWord", title:T("Báo cáo KPI quý (FM02)","Quarterly KPI report (FM02)"), bk:{ key:"local", name:"—" }, st:"ok", body:{ pic:Q.pic, term:"FY"+Q.fy+" "+Q.q, file:qFile() }, res:{ ok:true }, tab:T("File Word tải về máy","Word file downloaded"), next:[] }); }catch(_){}
  }, function(e){ b.disabled=false; b.textContent=t0; toast("⚠ "+e.message); });
}
function qSend(){
  Q.ch.to&&Q.ch.to.flush(); Q.ch.cc&&Q.ch.cc.flush(); qSave();
  var me=myMail();
  if(!me){ toast(T("Chưa có email của bạn — đăng nhập lại.","Your e-mail is unknown — sign in again.")); return; }
  var b=$("kq-send"), t0=b.textContent; b.disabled=true; b.textContent=T("Đang gửi…","Sending…");
  qWord().then(b64).then(function(d){
    return post("rhSeSend", { pic:Q.pic, fy:Q.fy, q:Q.q, to:me, cc:"", fwdTo:Q.to.join(","), fwdCc:Q.cc.join(","), self:"1", subject:$("kq-sub").value, body:$("kq-body").value, name:qFile(), b64:d, lang:Q.lang==="en"?"en":"" });
  }).then(function(r){ b.disabled=false; b.textContent=t0; toast(T("Đã gửi bản sao về ","Copy sent to ")+me); },
    function(e){ b.disabled=false; b.textContent=t0; toast(T("⚠ Chưa gửi được: ","⚠ Not sent: ")+e.message); var m=$("kq-msg"); if(m) m.textContent=T("⚠ Chưa gửi được: ","⚠ Not sent: ")+e.message; });
}
/* quý mặc định: tháng đầu quý (đến ngày 15) ⇒ quý vừa kết thúc (đang đến hạn); còn lại ⇒ quý hiện tại */
function qDefault(){
  var h=H(), now=new Date(), ym=h.ymNow?h.ymNow():"", fyD=+String(h.fyPer?h.fyPer():"FY68").slice(2), m=now.getMonth()+1;
  if([12,3,6,9].indexOf(m)>=0 && now.getDate()<=15){ var p=h.ymPrev(ym); if(h.fyOf(p)===fyD) return { fy:fyD, q:h.qOf(p) }; }
  return { fy:fyD, q:h.fyOf&&h.fyOf(ym)===fyD?h.qOf(ym):"Q1" };
}
function qOpen(pic, fy, q){
  if(!(window.AUTH && AUTH.tk())){ toast(T("Báo cáo KPI quý cần đăng nhập bằng email.","The quarterly KPI report needs an e-mail sign-in.")); if(window.AUTH&&AUTH.open) AUTH.open(); return; }
  var o=ov("kq", T("Báo cáo KPI quý · MMHSOP_009-FM02","Quarterly KPI Report · MMHSOP_009-FM02"), [T("Chọn quý","Quarter"),T("KPI tự điền","KPI filled in"),T("Năng lực · tự đánh giá","Competencies · self-assessment"),T("Tải Word / gửi email","Download / e-mail")]);
  if(!$("kq-send")){
    o.querySelector(".kx-ft").id="kq-ft"; o.querySelector(".kx-ft").innerHTML='<span class="msg" id="kq-msg">'+T("Bản nháp tự lưu trên máy này.","Draft is saved on this device.")+'</span><button class="kp-btn" id="kq-dl">'+T("Tải file Word","Download Word")+'</button><button class="kp-btn" id="kq-send">'+T("Gửi bản sao về email của tôi","Send a copy to my e-mail")+'</button><button class="kp-btn pri" id="kq-mail">'+T("Soạn email để gửi","Compose e-mail")+'</button>';
    $("kq-dl").onclick=qDownload; $("kq-send").onclick=function(){ qSend(); }; $("kq-mail").onclick=qCompose;
  }
  o.classList.add("show"); o.querySelector(".kx-l").innerHTML='<div class="kp-skel"></div><div class="kp-skel" style="width:70%"></div>'; o.querySelector(".kx-r").innerHTML="";
  (window.KPI&&KPI.ensure?KPI.ensure():Promise.resolve()).then(function(){
    var h=H(), d=D();
    if(!d){ o.querySelector(".kx-l").innerHTML='<div class="kp-empty">'+esc(st().err||T("Chưa tải được KPI.","KPI not loaded."))+'</div>'; return; }
    var mem=h.members?h.members():[];
    Q.pic=pic||Q.pic||st().who||d.me; if(mem.indexOf(Q.pic)<0) Q.pic=mem.indexOf(d.me)>=0?d.me:(mem[0]||"");
    var df=qDefault(); Q.fy=df.fy; Q.q=(fy===df.fy&&/^Q[1-4]$/.test(q||""))?q:df.q;
    Q.lang=docLang(Q.pic); Q.to.length=0; Q.cc.length=0;
    qForm();
    var qm=h.qMonths(Q.fy,Q.q), mo=qm[2]<=h.ymNow()?qm[2]:h.ymPrev(h.ymNow()), key=Q.pic+"|"+Q.fy+Q.q;
    post("rhKpiMail",{ pic:Q.pic, month:(h.months().indexOf(mo)>=0?mo:qm[0]) }).then(function(r){
      if(Q.pic+"|"+Q.fy+Q.q!==key) return; var d2=r.data||{};
      splitMails(d2.to).forEach(function(e){ if(Q.to.indexOf(e)<0) Q.to.push(e); }); splitMails(d2.cc).forEach(function(e){ if(Q.to.indexOf(e)<0&&Q.cc.indexOf(e)<0) Q.cc.push(e); });
      var mm=splitMails(h.myEmail?h.myEmail():"")[0]; if(mm && Q.to.indexOf(mm)<0 && Q.cc.indexOf(mm)<0) Q.cc.push(mm);
      Q.ch.to=chips($("kq-to"), Q.to); Q.ch.cc=chips($("kq-cc"), Q.cc);
      var bd=$("kq-body"), dear=dearOf(d2, Q.lang==="en");
      if(bd && !qDraft().body && /^Dear [^\n]*,/.test(bd.value)) bd.value=bd.value.replace(/^Dear [^\n]*,/, dear);
      if(d2.miss && d2.miss.length) $("kq-msg").textContent=T("⚠ Chưa có email của: ","⚠ No e-mail for: ")+d2.miss.join(", ");
    }).catch(function(e){ $("kq-msg").textContent="⚠ "+e.message; });
  });
}

/* ════════════════ NHẮC HẠN (#kpn của khối KPI) ════════════════ */
/* v1.2 — hạn mặc định NGÀY 05 hằng tháng (KPI tháng trước) · ngày 05 tháng đầu quý kế tiếp (KPI quý trước).
   Nhắc ngày 01–05 mỗi ngày 1 lần (còn n ngày / hôm nay là hạn), ngày 06–10 "đã quá hạn"; dừng khi người dùng bấm "Đã gửi" trong khung báo cáo
   (mmh_kpi_sent / mmh_se_sent / mmh_kq_sent) hoặc "Đã gửi, không nhắc nữa" trên popup (mmh_kpn_<kq>). Bản sao gửi về email KHÔNG tính là đã gửi. */
var DUE_DAY=5, LATE_TO=10;
function remindDay(){ return DUE_DAY; }          /* giữ tên cũ cho mã khác gọi tới */
window.KPI_NOTICE=function(){
  var h=H(), now=new Date(), y=now.getFullYear(), mo=now.getMonth()+1, day=now.getDate(), td=y+"-"+pad(mo)+"-"+pad(day), list=[], me=(h.me&&h.me())||"";
  if(!h.ymNow || day>LATE_TO) return list;
  var pm=h.ymPrev(h.ymNow()), d5=pad(DUE_DAY)+"/"+pad(mo)+"/"+y, left=DUE_DAY-day, late=left<0;
  var who=(D()&&D().me)||me;
  var when=late?T("đã quá hạn ngày "+d5,"overdue since "+d5):left===0?T("hôm nay là hạn ("+d5+")","due today ("+d5+")"):T("hạn "+d5+" — còn "+left+" ngày","due "+d5+" — "+left+" day(s) left");
  var how=T("Hệ thống soạn sẵn nội dung + file Word; bạn <b>tự gửi email</b> từ hộp thư của mình tới Trưởng bộ phận và Tổng Giám đốc, CC Kế toán, rồi bấm <b>Đã gửi</b>.",
            "The system prepares the content + Word file; you <b>send the e-mail yourself</b> from your mailbox to your Department Head and the General Director, CC Accounting, then click <b>I have sent it</b>.");
  var mk="m:"+pm;
  if(!lsG("mmh_kpn_"+mk) && !lsG("mmh_kpn_"+mk+":"+td) && !lsG("mmh_kpi_sent:"+who+":"+pm) && !lsG("mmh_kpi_sent:"+me+":"+pm))
    list.push({ k:mk+":"+td, kq:mk, kick:T("BÁO CÁO KPI THÁNG · MMHSOP_009-FM01","MONTHLY KPI REPORT · MMHSOP_009-FM01")+(late?T(" · QUÁ HẠN"," · OVERDUE"):""),
      title:T("Báo cáo KPI tháng "+ml(pm)+": ","Monthly KPI Report "+ml(pm)+": ")+when,
      text:T("Hạn gửi Báo cáo KPI tháng là <b>ngày 05</b> hằng tháng. Ghi lý do đạt / chưa đạt cho từng chỉ tiêu, hành động tháng tới, điểm nổi bật và khó khăn. ","The Monthly KPI Report is due on <b>day 05</b> of every month: reason for each target, next-month actions, highlights and challenges. ")+how,
      btn:T("Mở báo cáo KPI tháng","Open monthly KPI report"), go:function(){ mOpen(null, pm); } });
  if([12,3,6,9].indexOf(mo)>=0){
    var fy=h.fyOf(pm), q=h.qOf(pm), key="q:FY"+fy+q;
    if(!lsG("mmh_kpn_"+key) && !lsG("mmh_kpn_"+key+":"+td) && !lsG("mmh_se_sent:"+who+":FY"+fy+q) && !lsG("mmh_kq_sent:"+who+":FY"+fy+q))
      list.push({ k:key+":"+td, kq:key, kick:T("BÁO CÁO KPI QUÝ · MMHSOP_009-FM02","QUARTERLY KPI REPORT · MMHSOP_009-FM02")+(late?T(" · QUÁ HẠN"," · OVERDUE"):""),
        title:T("Báo cáo KPI quý "+q+" FY"+fy+" (tự đánh giá): ","Quarterly KPI Report "+q+" FY"+fy+" (self-assessment): ")+when,
        text:T("Hạn nộp Báo cáo KPI quý là <b>ngày 05 tháng đầu quý kế tiếp</b>. KPI của quý được điền sẵn — bạn viết phần năng lực và tự đánh giá. ","The Quarterly KPI Report is due on <b>day 05 of the first month of the next quarter</b>. KPIs are pre-filled — write the competencies and self-assessment. ")+how,
        btn:T("Mở báo cáo KPI quý","Open quarterly KPI report"), go:function(){ qOpen(null, fy, q); } });
  }
  return list;
};

/* ── CSS ── */
(function(){
  if($("ksp-css")) return;
  var s=document.createElement("style"); s.id="ksp-css";
  s.textContent=[
    ".ksp,.ksp *{font-family:Aptos,'Aptos Display','Segoe UI',Calibri,Arial,sans-serif}",
    "#kr2 .kx-card{width:min(1400px,100%)} #kr2 .kx-bd{grid-template-columns:minmax(0,560px) minmax(0,1fr)}",
    "#kq .kx-card{width:min(1500px,100%)} #kq .kx-bd{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr)} #kq .kx-r{order:1;border-right:1px solid #EEF1F4} #kq .kx-l{order:2;border-right:none}",
    ".ksp .kx-h5 small{font-weight:400;color:#8A97A6;margin-left:4px}",
    ".ksp-big{font-size:22px;font-weight:700;padding-top:2px}",
    ".ksp-due{font-size:12px;color:#5E738C;line-height:1.5;margin-top:6px;padding:7px 10px;background:var(--t-soft,#F0F7FF);border:1px solid var(--t-line,#CFE2F3);border-radius:8px}",
    ".ksp-due b{color:var(--t-ink,#003047)} .ksp-ok{color:#2F7A4A;font-weight:600}",
    ".ksp-self{font-size:12.5px;line-height:1.5;color:#5B4A12;background:#FFF8E1;border:1px solid #E8C86A;border-radius:8px;padding:7px 10px;margin:8px 0}",
    ".ksp-k{border:1px solid #E6EAEF;border-radius:10px;padding:8px 10px;margin-bottom:8px;background:#fff}",
    ".ksp-k .h{display:flex;align-items:baseline;gap:7px;font-size:13px;color:#1F3347} .ksp-k .h b{flex:1;font-weight:600}",
    ".ksp .cd{font-size:11px;font-weight:700;color:#5E738C;background:#F3F6F9;border:1px solid #E6EAEF;border-radius:5px;padding:0 5px;white-space:nowrap}",
    ".ksp-k .pc{font-weight:700;font-variant-numeric:tabular-nums} .ksp-k .m{font-size:11.5px;color:#7A8999;margin:2px 0 6px}",
    ".ksp-k textarea{width:100%;box-sizing:border-box;min-height:44px;border:1px solid var(--fld-line,#C3CDD8);border-radius:8px;padding:6px 8px;font:inherit;font-size:13px;resize:vertical;outline:none;line-height:1.45}",
    ".ksp-k textarea:focus,.ksp-det:focus{border-color:var(--t-pri,#3A5CAA);box-shadow:0 0 0 3px rgba(58,92,170,.12)}",
    ".ksp-cb{display:flex;gap:7px;align-items:center;font-size:13px;color:#41566F;margin:4px 0}",
    ".ksp-sc{display:flex;align-items:center;gap:8px;margin-top:5px} .ksp-sc small{margin:0!important}",
    ".ksp-a td{vertical-align:top} .ksp-det{width:100%;box-sizing:border-box;min-height:54px;border:1px solid var(--fld-line,#C3CDD8);border-radius:7px;padding:5px 7px;font:inherit;font-size:12.5px;resize:vertical;outline:none;line-height:1.4}",
    ".ksp-cap{display:block;font-size:10.5px;color:#8A6A1F;font-weight:600}",
    ".ksp .kx-ft.asking>button{display:none} .ksp-ask{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto;padding:6px 10px;border:1px solid var(--t-line,#CFE2F3);background:var(--t-soft,#F0F7FF);border-radius:10px;font-size:13px;color:#1F3347}",
    ".ksp-ask .t{max-width:640px;line-height:1.4}",
    ".ksp-compose a.kp-btn{text-decoration:none;display:inline-flex;align-items:center}",
    ".ksp-a td:nth-child(3){min-width:220px}",
    "@media(max-width:900px){ #kr2 .kx-bd,#kq .kx-bd{grid-template-columns:1fr} #kq .kx-l{order:1} #kq .kx-r{order:2;border-right:none} }"
  ].join("\n");
  document.head.appendChild(s);
})();

/* ── lối vào: thay KR / SE cũ ── */
window.KR={ open:function(pic, month){ mOpen(pic, month); } };
window.SE={ open:function(pic, fy, q){ qOpen(pic, fy, q); } };
window.KPISOP={ m:M, q:Q, mOpen:mOpen, qOpen:qOpen, mWord:mWord, qWord:qWord, remindDay:remindDay, dueMonth:dueMonth, dueQuarter:dueQuarter, docLang:docLang, dearOf:dearOf, copyRcpt:copyRcpt, mCompose:mCompose, qCompose:qCompose, composeLinks:composeLinks, v:"1.2" };
})();
