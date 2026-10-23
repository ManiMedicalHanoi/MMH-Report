/* ═══════════════════════════════════════════════════════════════════════════
 * rpstat.js v1.0 (23/10/2026) — GIỐNG HỆT ở MMH-Report và MMH-CRM (sửa 1 nơi ⇒ chép sang nơi kia)
 *
 * ① XUẤT THỐNG KÊ GỬI BÁO CÁO (RPSTAT.open) — Admin / Director / HOD hoặc quyền "rps" (Phân quyền người dùng)
 *    · Đọc nhật ký gửi báo cáo (action rpLog, sheet ẩn _MMH_REPORT_LOG — backend MMH_ReportLog.gs) ở 8 backend:
 *      Report Hub (Marketing · Back Office · Management), CRM (Dental · Surgical · Eyeless · Thailand), KPI.
 *    · Mỗi PIC · loại báo cáo · kỳ ⇒ lấy LẦN GỬI GẦN NHẤT so với hạn nộp (lịch làm việc MMH VN / TH do backend trả về):
 *      báo cáo tuần = 23:59 ngày làm việc cuối của tuần · KPI tháng = 16:00 ngày 02 tháng sau · tự đánh giá quý = 17:00 ngày 09 tháng đầu quý sau.
 *    · Xuất Excel (SheetJS): tổng hợp theo tháng, theo quý, chi tiết từng loại, lịch làm việc, cách tính.
 * ② GỬI EMAIL TỰ ĐÁNH GIÁ QUÝ — thêm nút "Gửi email" ở form Setting Expectation (#se): tạo file Word như nút Tải
 *    (SE_NODL / SE_ONBUILT trong seDownload) rồi gửi qua backend KPI (rhSeSend) ⇒ được ghi nhận để thống kê.
 * Cấu hình: window.RPSTAT_CFG = { lang:fn→'vi'|'en', mount:fn(btn), hub, rhKey }.
 * ═══════════════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var CFG = window.RPSTAT_CFG || {};
var KPI = "https://script.google.com/macros/s/AKfycbx58htPcvaOk5R4lC91hWcT3GHWTTAWSq7UZSoRUKkanez6noyX1vHatHNCndQPrFV2/exec";
var SRC = [
  { k:"marketing",  lb:"Report Hub · Marketing",   u:"https://script.google.com/macros/s/AKfycbzn-5chMgO7lQPKmot8P7UkP9C40MdCPtiTTa4H1gcKepVsnr1IYfcB7sSdK1_jrZYY/exec" },
  { k:"backoffice", lb:"Report Hub · Back Office", u:"https://script.google.com/macros/s/AKfycbxWT_M07dwPD77zgzouJpJn4R64n6T6l57sVvsU3I2RgtN6JZcMrRR9eoovKE_DuFuN_g/exec" },
  { k:"management", lb:"Report Hub · Management",  u:"https://script.google.com/macros/s/AKfycbzKQYH154xD3JQSiNQCNJuReFB2VjH3W1_r6zOqnmkV9cP7__mi0ukTn_hDWxX_WHgs/exec" },
  { k:"crm-dental", lb:"CRM Dental",   u:"https://script.google.com/macros/s/AKfycbyzmhECZZfbOZUyXOK5O70ukwTgQ9DHp70MN-HUAL0wMpOptdTTbaGcvMEmcnCrCji6/exec" },
  { k:"crm-surgical", lb:"CRM Surgical", u:"https://script.google.com/macros/s/AKfycbxxckrqwkfhE0fszm1XVdpYyEHU_PCKQWMKE_2wBnMTgoJCZ-1nRZ_fhOCPXXsVfEE/exec" },
  { k:"crm-eyeless", lb:"CRM Eyeless",  u:"https://script.google.com/macros/s/AKfycbxsoTRbRWZRaf-z7-xRy_oIkM-Yv1HoCOjVRO-K6oRRh3Dr7MMg4v53K0qqpMfZ_K5IAg/exec" },
  { k:"crm-thai",   lb:"CRM Thailand", u:"https://script.google.com/macros/s/AKfycbwglPhfcC3y20-lPO8mRC7yapGUyVHSO2Mp3k4fyPJXnraQEu6bbO4dysL0E9MNadwHwg/exec" },
  { k:"kpi",        lb:"KPI (báo cáo KPI tháng · tự đánh giá quý)", u:KPI }
];
var HUB = CFG.hub || "https://script.google.com/macros/s/AKfycbwsX4cQEoH4LNlmcNfe8qWIM9K6EiDEXy7PjhP9bHY2citL6xHn5L1unsAlQJHyL9EP/exec";
var ALIAS = { "minh viet":"viet", "bui trang":"trang" };
var FY0 = "2026-09";                                   /* đầu FY68 */

function en(){ try{ return (CFG.lang ? CFG.lang() : "vi") === "en"; }catch(_){ return false; } }
function T(vi, e){ return en() ? e : vi; }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function nk(s){ var k=String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/gi,"d").toLowerCase().replace(/\s+/g," ").trim(); return ALIAS[k]||k; }
function pad(n){ return ("0"+n).slice(-2); }
function isoD(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function dOf(iso){ var p=String(iso).slice(0,10).split("-"); return new Date(+p[0], +p[1]-1, +p[2], 12); }
function addD(iso, n){ var d=dOf(iso); d.setDate(d.getDate()+n); return isoD(d); }
function nowStr(){ var d=new Date(); return isoD(d)+" "+pad(d.getHours())+":"+pad(d.getMinutes()); }
function tk(){ try{ return (window.AUTH && AUTH.tk()) || ""; }catch(_){ return ""; } }
function user(){ try{ return (window.AUTH && AUTH.user()) || null; }catch(_){ return null; } }
function toastX(m){ if(window.toast) toast(m); else alert(m); }

/* ── quyền: Admin / Director / HOD, hoặc Perms rps (Phân quyền người dùng) ── */
function can(){
  var u=user(); if(!u) return false;
  var o=u.perms&&u.perms.rps; if(o && (o.v===0||o.v===1)) return o.v===1;
  return !!(u.admin || u.level==="director" || u.level==="hod");
}

/* ── JSONP (đọc) ── */
var seq=0;
function jsonp(url, q, ms){
  return new Promise(function(res, rej){
    var cb="__rps_"+Date.now()+"_"+(++seq), s=document.createElement("script"), t=setTimeout(function(){ done(null, new Error(T("Hết thời gian chờ","Timed out"))); }, ms||45000);
    function done(d, e){ clearTimeout(t); try{ delete window[cb]; }catch(_){ window[cb]=undefined; } if(s.parentNode) s.parentNode.removeChild(s); if(e) rej(e); else res(d); }
    window[cb]=function(d){ done(d); };
    q=Object.assign({}, q||{}, { callback:cb });
    s.src=url+"?"+Object.keys(q).map(function(k){ return encodeURIComponent(k)+"="+encodeURIComponent(q[k]==null?"":q[k]); }).join("&");
    s.onerror=function(){ done(null, new Error(T("Không kết nối được","Cannot connect"))); };
    document.body.appendChild(s);
  });
}

/* ══════════════ LỊCH LÀM VIỆC (từ backend: cal = {VN:{2026:{sat,off}}, TH:{…}}) ══════════════ */
var CAL=null, RULE={ week:"23:59", kpiDay:2, kpi:"16:00", qDay:9, q:"17:00" };
function isWork(iso, c){
  var y=(CAL&&CAL[c==="TH"?"TH":"VN"]||{})[iso.slice(0,4)], md=iso.slice(5,10), w=dOf(iso).getDay();
  if(w===0) return false;
  if(w===6) return !!(y && y.sat.indexOf(md)>=0);
  return !(y && y.off.indexOf(md)>=0);
}
function weekEnd(mon, c){ for(var i=5;i>=0;i--){ var d=addD(mon,i); if(isWork(d,c)) return d; } return ""; }
function monOf(iso){ var w=dOf(iso).getDay(); return addD(iso, w===0?-6:1-w); }
function nextYm(ym){ var y=+ym.slice(0,4), m=+ym.slice(4,6)+1; if(m>12){ m=1; y++; } return y+pad(m); }
function dueOf(type, per, c){
  if(type==="week"){ var e=weekEnd(monOf(per), c); return e ? e+" "+RULE.week : ""; }
  if(type==="kpi"){ var n=nextYm(per); return n.slice(0,4)+"-"+n.slice(4,6)+"-"+pad(RULE.kpiDay)+" "+RULE.kpi; }
  if(type==="quarter"){ var q=/^FY(\d+)-Q([1-4])$/.exec(per); if(!q) return ""; var s=1958+ +q[1], m=[[s,12],[s+1,3],[s+1,6],[s+1,9]][+q[2]-1]; return m[0]+"-"+pad(m[1])+"-"+pad(RULE.qDay)+" "+RULE.q; }
  return "";
}
/* quý FY của tháng yyyyMM: FY68 = 09/2026 → 08/2027, Q1 = T9–T11 */
function fyq(ym){ var y=+ym.slice(0,4), m=+ym.slice(4,6), fy=(m>=9?y:y-1)-1958, i=((m+12-9)%12); return { fy:fy, q:"Q"+(Math.floor(i/3)+1), id:"FY"+fy+"-Q"+(Math.floor(i/3)+1) }; }
function qMonths(id){ var q=/^FY(\d+)-Q([1-4])$/.exec(id), s=1958+ +q[1], st=9+(+q[2]-1)*3, out=[]; for(var i=0;i<3;i++){ var m=st+i, y=s; if(m>12){ m-=12; y++; } out.push(y+pad(m)); } return out; }
function ymLbl(ym){ return ym.slice(4,6)+"/"+ym.slice(0,4); }
function dmy(iso){ var p=String(iso||"").slice(0,10).split("-"); return p.length===3 ? p[2]+"/"+p[1]+"/"+p[0] : ""; }
function dmyT(s){ s=String(s||""); return s ? dmy(s)+(s.length>10?" "+s.slice(11,16):"") : ""; }

/* ══════════════ TẢI DỮ LIỆU ══════════════ */
var ST={ busy:false, res:null };
function load(fromIso){
  var k=tk();
  var calls=SRC.map(function(s){
    return jsonp(s.u, { action:"rpLog", tk:k, from:fromIso, pic:(user()||{}).pic||"" }, 60000).then(function(r){
      if(!r || r.ok===false) return { s:s, err:(r&&r.error)||T("Backend chưa có lệnh rpLog","Backend has no rpLog yet") };
      return { s:s, r:r };
    }, function(e){ return { s:s, err:e.message }; });
  });
  var roster=jsonp(HUB, { action:"rhAdminList", tk:k, rhKey:CFG.rhKey||window.TRAINING_RH_KEY||"" }, 45000).then(function(r){ return (r&&r.ok&&r.users)||[]; }, function(){ return []; });
  return Promise.all([Promise.all(calls), roster]).then(function(a){ return { src:a[0], users:a[1] }; });
}

/* ══════════════ TÍNH THỐNG KÊ ══════════════ */
function build(D, ymFrom, ymTo){
  var H=null, rows=[], since={ week:"", kpi:"", quarter:"" }, ok=[], bad=[];
  D.src.forEach(function(x){
    if(x.err){ bad.push(x.s.lb+": "+x.err); return; }
    ok.push(x.s.lb); var r=x.r; H=H||r.head; if(r.cal) CAL=r.cal; if(r.rule) RULE=Object.assign(RULE, r.rule);
    (r.rows||[]).forEach(function(v){ rows.push({ at:String(v[0]), type:String(v[1]), pic:String(v[2]), per:String(v[3]), from:String(v[4]), to:String(v[5]), due:String(v[6]), by:String(v[9]||""), opt:String(v[10]||""), cal:String(v[11]||"VN")||"VN", src:x.s.lb }); });
    var sc=String(r.since||"");
    var first=(r.rows||[]).reduce(function(m,v){ var a=String(v[0]); return !m||a<m?a:m; }, "");
    var s0=[sc,first].filter(Boolean).sort()[0]||"";
    if(s0){ var kk=x.s.k==="kpi" ? ["kpi","quarter"] : ["week"]; kk.forEach(function(t){ if(t==="quarter" && !sc) return; var v=t==="quarter"?sc:s0; if(!since[t]||v<since[t]) since[t]=v; }); }
  });
  /* người: RH_Users (đang hoạt động, bỏ TEST) + mọi PIC trong nhật ký */
  var P={};
  function person(name){ var k=nk(name); if(!k||/^test\b/.test(k)) return null; return P[k]||(P[k]={ pic:name, dept:"", level:"", cal:"", g:{} }); }
  (D.users||[]).forEach(function(u){ if(!u.active || !u.pic) return; var p=person(u.pic); if(!p) return; p.pic=u.pic; p.dept=u.dept||""; p.level=u.level||""; if(/thai/i.test(u.dept||"")) p.cal="TH"; });
  rows.forEach(function(r){ var p=person(r.pic); if(!p) return; if(r.type==="week" && r.cal==="TH") p.cal="TH"; var key=r.type+"|"+(r.type==="week"?monOf(r.per):r.per); (p.g[key]=p.g[key]||[]).push(r); });
  var now=nowStr(), months=[]; for(var m=ymFrom; m<=ymTo; m=nextYm(m)) months.push(m);
  var startIso=ymFrom.slice(0,4)+"-"+ymFrom.slice(4,6)+"-01", endIso=addD(nextYm(ymTo).slice(0,4)+"-"+nextYm(ymTo).slice(4,6)+"-01", -1);
  function judge(p, type, per){
    var c=p.cal||"VN", due=dueOf(type, per, c), L=(p.g[type+"|"+per]||[]).slice().sort(function(a,b){ return a.at<b.at?-1:1; });
    if(type==="week" && !due) return { per:per, due:"", st:T("Không tính (tuần nghỉ)","Not counted (no working day)"), k:"na", n:L.length };
    var last=L[L.length-1];
    if(last){ var late=due && last.at>due; return { per:per, due:due, last:last, first:L[0], n:L.length, st:late?T("Muộn","Late"):T("Đúng hạn","On time"), k:late?"late":"ok",
      hrs:late? Math.round((new Date(last.at.replace(" ","T")+":00+07:00")-new Date(due.replace(" ","T")+":00+07:00"))/36e5*10)/10 : "" }; }
    if(due>now) return { per:per, due:due, n:0, st:T("Chưa đến hạn","Not due yet"), k:"wait" };
    if(!since[type] || due<since[type]) return { per:per, due:due, n:0, st:T("Chưa ghi nhận (trước khi bắt đầu theo dõi)","Not tracked yet"), k:"na" };
    return { per:per, due:due, n:0, st:T("Chưa gửi","Not sent"), k:"miss" };
  }
  var out=[];
  Object.keys(P).sort(function(a,b){ return P[a].pic.localeCompare(P[b].pic); }).forEach(function(k){
    var p=P[k], W=[], K=[], Q=[];
    for(var mon=monOf(startIso); mon<=endIso; mon=addD(mon,7)){
      var j=judge(p,"week",mon), we=weekEnd(mon,p.cal||"VN"), ym=(we||addD(mon,4)).slice(0,7).replace("-","");
      if(ym<ymFrom||ym>ymTo) continue; j.ym=ym; j.mon=mon; W.push(j);
    }
    months.forEach(function(ym){ var j=judge(p,"kpi",ym); j.ym=ym; K.push(j); });
    var qs=[]; months.forEach(function(ym){ var q=fyq(ym).id; if(qs.indexOf(q)<0) qs.push(q); });
    qs.forEach(function(q){ var j=judge(p,"quarter",q); Q.push(j); });
    out.push({ p:p, W:W, K:K, Q:Q, qs:qs });
  });
  return { list:out, months:months, since:since, ok:ok, bad:bad, n:rows.length };
}
function cnt(arr){ var c={ need:0, sent:0, ok:0, late:0, miss:0 }; arr.forEach(function(j){ if(j.k==="ok"||j.k==="late"){ c.need++; c.sent++; c[j.k]++; } else if(j.k==="miss"){ c.need++; c.miss++; } }); return c; }
function pct(c){ return c.need ? Math.round(c.ok/c.need*100)+"%" : ""; }

/* ══════════════ EXCEL ══════════════ */
function loadXlsx(){
  if(window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise(function(res, rej){ var s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; s.onload=function(){ res(window.XLSX); }; s.onerror=function(){ rej(new Error(T("Không tải được thư viện Excel.","Cannot load the Excel library."))); }; document.head.appendChild(s); });
}
function sheet(X, aoa, widths){ var ws=X.utils.aoa_to_sheet(aoa); ws["!cols"]=(widths||[]).map(function(w){ return { wch:w }; }); if(aoa.length>1) ws["!autofilter"]={ ref:X.utils.encode_range({ s:{ r:0, c:0 }, e:{ r:aoa.length-1, c:aoa[0].length-1 } }) }; return ws; }
function workbook(X, R, ymFrom, ymTo){
  var wb=X.utils.book_new(), calName=function(p){ return p.cal==="TH"?T("Thái Lan","Thailand"):T("Việt Nam","Vietnam"); };
  /* 1. theo tháng */
  var a=[[T("PIC","PIC"),T("Phòng ban","Department"),T("Lịch","Calendar"),T("Tháng","Month"),
          T("BC tuần: cần gửi","Weekly: due"),T("BC tuần: đã gửi","Weekly: sent"),T("BC tuần: đúng hạn","Weekly: on time"),T("BC tuần: muộn","Weekly: late"),T("BC tuần: chưa gửi","Weekly: not sent"),T("BC tuần: % đúng hạn","Weekly: % on time"),
          T("KPI tháng","Monthly KPI"),T("KPI: gửi lúc (gần nhất)","KPI: sent at (latest)"),T("KPI: hạn","KPI: deadline")]];
  R.list.forEach(function(x){ R.months.forEach(function(ym){
    var c=cnt(x.W.filter(function(j){ return j.ym===ym; })), k=x.K.filter(function(j){ return j.ym===ym; })[0]||{};
    a.push([x.p.pic, x.p.dept, calName(x.p), ymLbl(ym), c.need, c.sent, c.ok, c.late, c.miss, pct(c), k.st||"", k.last?dmyT(k.last.at):"", dmyT(k.due)]);
  }); });
  X.utils.book_append_sheet(wb, sheet(X, a, [16,20,10,9,10,10,11,9,11,12,24,18,16]), T("Theo thang","By month"));
  /* 2. theo quý */
  var b=[[T("PIC","PIC"),T("Phòng ban","Department"),T("Quý","Quarter"),T("Các tháng","Months"),
          T("BC tuần: cần gửi","Weekly: due"),T("BC tuần: đã gửi","Weekly: sent"),T("BC tuần: đúng hạn","Weekly: on time"),T("BC tuần: muộn","Weekly: late"),T("BC tuần: chưa gửi","Weekly: not sent"),
          T("KPI tháng: cần gửi","KPI: due"),T("KPI tháng: đã gửi","KPI: sent"),T("KPI tháng: đúng hạn","KPI: on time"),T("KPI tháng: muộn","KPI: late"),T("KPI tháng: chưa gửi","KPI: not sent"),
          T("Tự đánh giá quý","Quarterly self-evaluation"),T("Tự đánh giá: gửi lúc","Self-evaluation: sent at"),T("Tự đánh giá: hạn","Self-evaluation: deadline")]];
  R.list.forEach(function(x){ x.qs.forEach(function(q){
    var ms=qMonths(q), cw=cnt(x.W.filter(function(j){ return ms.indexOf(j.ym)>=0; })), ck=cnt(x.K.filter(function(j){ return ms.indexOf(j.ym)>=0; })), qq=x.Q.filter(function(j){ return j.per===q; })[0]||{};
    b.push([x.p.pic, x.p.dept, q.replace("-"," "), ymLbl(ms[0])+" – "+ymLbl(ms[2]), cw.need, cw.sent, cw.ok, cw.late, cw.miss, ck.need, ck.sent, ck.ok, ck.late, ck.miss, qq.st||"", qq.last?dmyT(qq.last.at):"", dmyT(qq.due)]);
  }); });
  X.utils.book_append_sheet(wb, sheet(X, b, [16,20,11,17,10,10,11,9,11,10,10,11,9,11,26,18,16]), T("Theo quy","By quarter"));
  /* 3–5. chi tiết */
  function det(list, name, perLbl){
    var c=[[T("PIC","PIC"),T("Phòng ban","Department"),T("Lịch","Calendar"),perLbl,T("Hạn nộp","Deadline"),T("Kết quả","Result"),T("Lần gửi gần nhất","Latest e-mail"),T("Trễ (giờ)","Late (hours)"),T("Số lần gửi","E-mails sent"),T("Lần gửi đầu","First e-mail"),T("Người bấm gửi","Sent by"),T("Nguồn","Source")]];
    R.list.forEach(function(x){ x[list].forEach(function(j){
      c.push([x.p.pic, x.p.dept, calName(x.p), j.lbl||j.per, dmyT(j.due), j.st, j.last?dmyT(j.last.at):"", j.hrs||"", j.n||0, j.first?dmyT(j.first.at):"", j.last?j.last.by:"", j.last?j.last.src:""]);
    }); });
    X.utils.book_append_sheet(wb, sheet(X, c, [16,20,10,26,16,22,18,10,10,18,14,26]), name);
  }
  R.list.forEach(function(x){ x.W.forEach(function(j){ j.lbl=dmy(j.mon)+" – "+dmy(addD(j.mon,6)); }); x.K.forEach(function(j){ j.lbl=ymLbl(j.ym); }); x.Q.forEach(function(j){ j.lbl=j.per.replace("-"," "); }); });
  det("W", T("BC tuan","Weekly"), T("Tuần","Week"));
  det("K", T("KPI thang","Monthly KPI"), T("Tháng","Month"));
  det("Q", T("Tu danh gia quy","Quarterly"), T("Quý","Quarter"));
  /* 6. lịch làm việc */
  var l=[[T("Lịch","Calendar"),T("Năm","Year"),T("Loại ngày","Type"),T("Ngày","Date"),T("Thứ","Weekday")]], DW=T("CN T2 T3 T4 T5 T6 T7","Sun Mon Tue Wed Thu Fri Sat").split(" ");
  Object.keys(CAL||{}).forEach(function(c){ Object.keys(CAL[c]).forEach(function(y){
    CAL[c][y].sat.forEach(function(md){ var iso=y+"-"+md; l.push([(c==="TH"?T("Thái Lan","Thailand"):T("Việt Nam","Vietnam")), y, T("Thứ 7 đi làm","Working Saturday"), dmy(iso), DW[dOf(iso).getDay()]]); });
    CAL[c][y].off.forEach(function(md){ var iso=y+"-"+md; l.push([(c==="TH"?T("Thái Lan","Thailand"):T("Việt Nam","Vietnam")), y, T("Nghỉ lễ / nghỉ bù (T2–T6)","Holiday (Mon–Fri)"), dmy(iso), DW[dOf(iso).getDay()]]); });
  }); });
  X.utils.book_append_sheet(wb, sheet(X, l, [12,8,26,12,8]), T("Lich lam viec","Work calendar"));
  /* 7. cách tính */
  var n=[[T("Cách tính","How it is counted")],
    [T("Báo cáo tuần: gửi trước 24:00 (≤ "+RULE.week+") ngày làm việc cuối của tuần (thứ 2 → thứ 7) theo lịch MMH Việt Nam / Thái Lan; tuần không có ngày làm việc không tính. Tuần được tính vào tháng chứa ngày làm việc cuối.",
       "Weekly report: deadline = "+RULE.week+" on the last working day of the week (Mon → Sat) of the MMH Vietnam / Thailand calendar; weeks without a working day are not counted.")],
    [T("Báo cáo KPI tháng: gửi trước "+RULE.kpi+" ngày "+pad(RULE.kpiDay)+" tháng sau.","Monthly KPI report: deadline = "+RULE.kpi+" on day "+pad(RULE.kpiDay)+" of the next month.")],
    [T("Tự đánh giá quý (Setting Expectation): hạn = "+RULE.q+" ngày "+pad(RULE.qDay)+" tháng đầu quý sau (Q1 → 09/12, Q2 → 09/03, Q3 → 09/06, Q4 → 09/09). Chỉ tính khi gửi bằng nút Gửi email trong form.",
       "Quarterly self-evaluation: deadline = "+RULE.q+" on day "+pad(RULE.qDay)+" of the first month of the next quarter. Counted when sent with the form's Send e-mail button.")],
    [T("Mỗi PIC · loại · kỳ lấy LẦN GỬI EMAIL GẦN NHẤT so với hạn nộp. Gửi thử cho chính mình / chế độ TEST không tính.","Per PIC · report · period the LATEST e-mail is compared with the deadline. Test e-mails are ignored.")],
    [T("Bắt đầu ghi nhận: báo cáo tuần "+(dmyT(R.since.week)||"—")+" · KPI tháng "+(dmyT(R.since.kpi)||"—")+" · tự đánh giá quý "+(dmyT(R.since.quarter)||"—")+". Kỳ trước mốc này: \"Chưa ghi nhận\" (không tính là chưa gửi).",
       "Tracking started: weekly "+(dmyT(R.since.week)||"—")+" · KPI "+(dmyT(R.since.kpi)||"—")+" · quarterly "+(dmyT(R.since.quarter)||"—")+".")],
    [T("Nguồn đã đọc: ","Sources read: ")+R.ok.join(" · ")],
    R.bad.length?[T("Chưa đọc được: ","Not read: ")+R.bad.join(" · ")]:[""],
    [T("Xuất lúc ","Exported ")+dmyT(nowStr())+T(" · kỳ "," · period ")+ymLbl(ymFrom)+" – "+ymLbl(ymTo)]];
  X.utils.book_append_sheet(wb, sheet(X, n, [150]), T("Cach tinh","Rules"));
  return wb;
}

/* ══════════════ GIAO DIỆN ══════════════ */
function css(){
  if($("rps-css")) return;
  var s=document.createElement("style"); s.id="rps-css";
  s.textContent='.rps-ov{position:fixed;inset:0;background:rgba(0,30,50,.32);z-index:9500;display:none;align-items:flex-start;justify-content:center;padding:48px 16px;overflow:auto;font-family:Aptos,"Segoe UI",Calibri,Arial,sans-serif}'
   +'.rps-ov.show{display:flex}.rps-card{background:#fff;border:1px solid #E6EAEF;border-radius:12px;width:100%;max-width:720px;box-shadow:0 10px 30px rgba(0,30,50,.12)}'
   +'.rps-hd{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #E6EAEF}.rps-hd h3{margin:0;font-size:16px;color:var(--t-ink,#003047);flex:1}'
   +'.rps-x{border:0;background:none;font-size:18px;cursor:pointer;color:#5E738C}.rps-bd{padding:14px 18px;font-size:13.5px;color:#22313F;line-height:1.55}'
   +'.rps-row{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:10px}.rps-row label{display:block;font-size:12px;color:#5E738C;margin-bottom:3px}'
   +'.rps-row select,.rps-f input,.rps-f textarea{font:inherit;border:1px solid var(--fld-line,#C3CDD8);border-radius:8px;padding:7px 9px;background:#fff;box-sizing:border-box}'
   +'.rps-f{margin-bottom:9px}.rps-f label{display:block;font-size:12px;color:#5E738C;margin-bottom:3px}.rps-f input,.rps-f textarea{width:100%}.rps-f textarea{min-height:120px;resize:vertical}'
   +'.rps-btn{font:inherit;font-size:13.5px;border:1px solid var(--t-pri,#3A5CAA);color:var(--t-pri,#3A5CAA);background:#fff;border-radius:8px;padding:7px 14px;cursor:pointer}'
   +'.rps-btn.pri{background:var(--t-pri,#3A5CAA);color:#fff}.rps-btn:disabled{opacity:.55;cursor:default}'
   +'.rps-st{margin:8px 0;padding:9px 11px;background:var(--t-soft,#F0F7FF);border-radius:8px;font-size:12.5px}.rps-st .bad{color:#A33A2B}'
   +'.rps-tb{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px}.rps-tb th{background:var(--t-soft,#F0F7FF);color:var(--t-ink,#003047);text-align:left;font-weight:600;padding:6px 8px}'
   +'.rps-tb td{padding:5px 8px;border-top:1px solid #EEF1F5}.rps-tb td.n{text-align:right}.rps-ft{display:flex;gap:8px;justify-content:flex-end;padding:12px 18px;border-top:1px solid #E6EAEF}'
   +'.rps-note{font-size:12px;color:#5E738C}';
  document.head.appendChild(s);
}
function ov(id){
  css(); var o=$(id); if(o) return o;
  o=document.createElement("div"); o.id=id; o.className="rps-ov"; o.innerHTML='<div class="rps-card"></div>';
  o.addEventListener("mousedown", function(e){ if(e.target===o) o.classList.remove("show"); });
  document.body.appendChild(o); return o;
}
function ymNow(){ var d=new Date(); return d.getFullYear()+pad(d.getMonth()+1); }
function monthOpts(sel){
  var out=[], m=FY0.replace("-",""), end=ymNow();
  for(; m<=end; m=nextYm(m)) out.push('<option value="'+m+'"'+(m===sel?" selected":"")+'>'+ymLbl(m)+'</option>');
  return out.reverse().join("");
}
function open(){
  if(!tk()){ toastX(T("Cần đăng nhập bằng email công ty.","Please sign in with your company e-mail.")); if(window.AUTH && AUTH.open) AUTH.open(); return; }
  if(!can()){ toastX(T("Chỉ Admin, Director, HOD hoặc người được cấp quyền mới xuất được thống kê.","Only Admin, Director, HOD or granted users can export.")); return; }
  var o=ov("rps-ov"), cur=ymNow(), f0=FY0.replace("-","");
  o.firstChild.innerHTML='<div class="rps-hd"><h3>'+T("Thống kê gửi báo cáo","Report submission statistics")+'</h3><button class="rps-x" aria-label="Đóng">✕</button></div>'
    +'<div class="rps-bd"><div class="rps-row"><div><label>'+T("Từ tháng","From")+'</label><select id="rps-f">'+monthOpts(f0)+'</select></div>'
    +'<div><label>'+T("Đến tháng","To")+'</label><select id="rps-t">'+monthOpts(cur)+'</select></div>'
    +'<button class="rps-btn" id="rps-load">'+T("Xem số liệu","Load")+'</button></div>'
    +'<div class="rps-note">'+T("Báo cáo tuần · báo cáo KPI tháng · tự đánh giá quý của từng PIC, theo email gần nhất đã gửi. Báo cáo tuần: trước 24:00 ngày làm việc cuối của tuần (lịch MMH Việt Nam / Thái Lan) · KPI tháng: trước 16:00 ngày 02 tháng sau · tự đánh giá quý: trước 17:00 ngày 09 tháng đầu quý sau.",
      "Weekly report · monthly KPI report · quarterly self-evaluation per PIC, by the latest e-mail sent. Weekly deadline = last working day of the week (MMH Vietnam / Thailand calendar).")+'</div>'
    +'<div id="rps-out"></div></div>'
    +'<div class="rps-ft"><button class="rps-btn" id="rps-close">'+T("Đóng","Close")+'</button><button class="rps-btn pri" id="rps-xls" disabled>'+T("Xuất Excel","Export Excel")+'</button></div>';
  o.querySelector(".rps-x").onclick=$("rps-close").onclick=function(){ o.classList.remove("show"); };
  $("rps-load").onclick=run; $("rps-xls").onclick=xls;
  o.classList.add("show"); run();
}
function range(){ var a=$("rps-f").value, b=$("rps-t").value; return a<=b ? [a,b] : [b,a]; }
function run(){
  if(ST.busy) return; ST.busy=true;
  var out=$("rps-out"), r=range(), bt=$("rps-xls"); bt.disabled=true;
  out.innerHTML='<div class="rps-st">'+T("Đang đọc nhật ký gửi báo cáo ở 8 backend…","Reading the report logs of 8 backends…")+'</div>';
  load(r[0].slice(0,4)+"-"+r[0].slice(4,6)+"-01").then(function(D){
    ST.busy=false; ST.D=D; var R=build(D, r[0], r[1]); ST.R=R; ST.rg=r;
    var tw=cnt([]), tk2=cnt([]), tq=cnt([]);
    function add(t, c){ Object.keys(c).forEach(function(k){ t[k]+=c[k]; }); }
    R.list.forEach(function(x){ add(tw, cnt(x.W)); add(tk2, cnt(x.K)); add(tq, cnt(x.Q)); });
    var row=function(lb, c){ return '<tr><td>'+lb+'</td><td class="n">'+c.need+'</td><td class="n">'+c.sent+'</td><td class="n">'+c.ok+'</td><td class="n">'+c.late+'</td><td class="n">'+c.miss+'</td><td class="n">'+(pct(c)||"—")+'</td></tr>'; };
    out.innerHTML='<div class="rps-st">'+T("Đã đọc ","Read ")+R.ok.length+'/'+SRC.length+T(" nguồn · "," sources · ")+R.n+T(" lượt gửi · "," e-mails · ")+R.list.length+' PIC'
      +(R.bad.length?'<div class="bad">'+T("Chưa đọc được: ","Not read: ")+esc(R.bad.join(" · "))+'</div>':'')+'</div>'
      +'<table class="rps-tb"><thead><tr><th>'+T("Loại báo cáo","Report")+'</th><th>'+T("Cần gửi","Due")+'</th><th>'+T("Đã gửi","Sent")+'</th><th>'+T("Đúng hạn","On time")+'</th><th>'+T("Muộn","Late")+'</th><th>'+T("Chưa gửi","Not sent")+'</th><th>'+T("% đúng hạn","% on time")+'</th></tr></thead><tbody>'
      +row(T("Báo cáo tuần","Weekly report"), tw)+row(T("Báo cáo KPI tháng","Monthly KPI report"), tk2)+row(T("Tự đánh giá quý","Quarterly self-evaluation"), tq)+'</tbody></table>'
      +'<div class="rps-note" style="margin-top:8px">'+T("Kỳ trước khi bắt đầu theo dõi ghi \"Chưa ghi nhận\", không tính là chưa gửi. File Excel có chi tiết từng PIC theo tháng / quý.","Periods before tracking started are not counted. The Excel file has per-PIC detail by month / quarter.")+'</div>';
    bt.disabled=!R.ok.length;
  }).catch(function(e){ ST.busy=false; out.innerHTML='<div class="rps-st bad">⚠ '+esc(e.message)+'</div>'; });
}
function xls(){
  if(!ST.R) return;
  var b=$("rps-xls"), t0=b.textContent; b.disabled=true; b.textContent=T("Đang tạo file…","Creating…");
  loadXlsx().then(function(X){
    var R=build(ST.D, ST.rg[0], ST.rg[1]), wb=workbook(X, R, ST.rg[0], ST.rg[1]);
    var nm="MMH_Thong_ke_bao_cao_"+ST.rg[0]+"-"+ST.rg[1]+".xlsx";
    X.writeFile(wb, nm); b.disabled=false; b.textContent=t0; toastX(T("Đã tạo ","Created ")+nm);
  }).catch(function(e){ b.disabled=false; b.textContent=t0; toastX("⚠ "+e.message); });
}

/* ══════════════ ② GỬI EMAIL TỰ ĐÁNH GIÁ QUÝ ══════════════ */
function kpiPost(action, payload){
  var body=new URLSearchParams(); body.set("action", action); body.set("payload", JSON.stringify(Object.assign({ tk:tk() }, payload||{})));
  return fetch(KPI, { method:"POST", body:body }).then(function(r){ return r.text(); }).then(function(t){ var d=null; try{ d=JSON.parse(t); }catch(_){} if(!d) throw new Error(T("Máy chủ KPI không trả lời đúng.","Unexpected reply from the KPI server.")); if(d.ok===false) throw new Error(d.error||"Lỗi"); return d; });
}
function b64(blob){ return new Promise(function(res, rej){ var r=new FileReader(); r.onload=function(){ res(String(r.result).split(",")[1]||""); }; r.onerror=function(){ rej(new Error("FileReader")); }; r.readAsDataURL(blob); }); }
function seMount(){
  var se=$("se"); if(!se) return;
  var ft=se.querySelector(".kx-ft"); if(!ft || $("se-mail")) return;
  var b=document.createElement("button"); b.className="kp-btn"; b.id="se-mail"; b.type="button"; b.textContent=T("Gửi email","Send e-mail");
  b.title=T("Tạo file Word và gửi email cho quản lý — được ghi nhận để thống kê đúng hạn","Create the Word file and e-mail it to your manager — counted for on-time statistics");
  var dl=$("se-dl"); ft.insertBefore(b, dl);
  b.onclick=function(){
    if(!dl) return; b.disabled=true;
    window.SE_ONBUILT=function(x){ b.disabled=false; window.SE_ONBUILT=null; seSendForm(x); };
    window.SE_NODL=1; dl.click();
    setTimeout(function(){ b.disabled=false; }, 20000);
  };
}
function seSendForm(x){
  var o=ov("rps-se"), u=user()||{}, per="FY"+x.fy+" "+x.q, qm=x.qm||[];
  var full=x.name||x.pic, subj=T("Setting Expectation & tự đánh giá "+per+" · "+x.pic, "Setting Expectation & self-evaluation "+per+" · "+x.pic);
  var body=T("Dear anh/chị,\n\nEm gửi file Setting Expectation & tự đánh giá "+per+" (đính kèm).\n\nBest regards,\n"+full,
             "Dear,\n\nPlease find attached my Setting Expectation & self-evaluation for "+per+".\n\nBest regards,\n"+full);
  o.firstChild.innerHTML='<div class="rps-hd"><h3>'+T("Gửi email tự đánh giá ","Send self-evaluation ")+esc(per)+'</h3><button class="rps-x" aria-label="Đóng">✕</button></div>'
    +'<div class="rps-bd"><div class="rps-f"><label>To</label><input id="rse-to" placeholder="'+T("đang lấy người nhận…","loading recipients…")+'"></div>'
    +'<div class="rps-f"><label>CC</label><input id="rse-cc"></div>'
    +'<div class="rps-f"><label>'+T("Tiêu đề","Subject")+'</label><input id="rse-sub" value="'+esc(subj)+'"></div>'
    +'<div class="rps-f"><label>'+T("Nội dung","Message")+'</label><textarea id="rse-body">'+esc(body)+'</textarea></div>'
    +'<div class="rps-note">'+T("Đính kèm: ","Attachment: ")+esc(x.nm)+'</div></div>'
    +'<div class="rps-ft"><button class="rps-btn" id="rse-test">'+T("Gửi thử cho tôi","Test to me")+'</button><button class="rps-btn pri" id="rse-send">'+T("Gửi","Send")+'</button></div>';
  o.querySelector(".rps-x").onclick=function(){ o.classList.remove("show"); };
  o.classList.add("show");
  var m=qm[qm.length-1];
  if(m) kpiPost("rhKpiMail", { pic:x.pic, month:m }).then(function(r){ var d=r.data||{}; if(!$("rse-to").value) $("rse-to").value=d.to||""; if(!$("rse-cc").value) $("rse-cc").value=d.cc||""; $("rse-to").placeholder=""; }, function(){ $("rse-to").placeholder=""; });
  function send(test){
    var to=test?(u.email||""):$("rse-to").value.trim(), cc=test?"":$("rse-cc").value.trim();
    if(!to){ toastX(T("Chưa có người nhận (To).","No recipient (To).")); return; }
    var bt=$(test?"rse-test":"rse-send"), t0=bt.textContent; bt.disabled=true; bt.textContent=T("Đang gửi…","Sending…");
    b64(x.blob).then(function(d){
      return kpiPost("rhSeSend", { pic:x.pic, fy:x.fy, q:x.q, to:to, cc:cc, subject:$("rse-sub").value, body:$("rse-body").value, name:x.nm, b64:d, test:test?"1":"", lang:en()?"en":"" });
    }).then(function(r){ bt.disabled=false; bt.textContent=t0; toastX(r.message||T("Đã gửi","Sent")); if(!test){ o.classList.remove("show"); try{ localStorage.setItem("mmh_se_sent:"+x.pic+":FY"+x.fy+x.q, String(Date.now())); }catch(_){} } },
      function(e){ bt.disabled=false; bt.textContent=t0; toastX("⚠ "+e.message); });
  }
  $("rse-test").onclick=function(){ send(true); }; $("rse-send").onclick=function(){ send(false); };
}
/* nút "Gửi email" xuất hiện khi form Setting Expectation mở */
new MutationObserver(function(){ if($("se") && !$("se-mail")) seMount(); }).observe(document.body, { childList:true });

/* ══ lối vào ══ */
function mount(){
  if(!can()) { var b0=$("rps-btn"); if(b0) b0.remove(); return; }
  if($("rps-btn") || !CFG.mount) return;
  var b=document.createElement("button"); b.id="rps-btn"; b.type="button"; b.textContent=T("Thống kê báo cáo","Report stats");
  b.title=T("Xuất thống kê gửi báo cáo tuần / KPI tháng / tự đánh giá quý (Excel)","Export report submission statistics (Excel)");
  b.onclick=open;
  try{ CFG.mount(b); }catch(_){}
}
setInterval(mount, 3000); setTimeout(mount, 800);
(window.QS_EXTRA_CMDS=window.QS_EXTRA_CMDS||[]).push(function(){ return can() ? { ic:"📊", title:T("Xuất thống kê gửi báo cáo","Export report statistics"), hay:"thong ke bao cao gui muon dung han xuat excel report stats late kpi tu danh gia quy", run:open } : null; });

/* tour: __tourClean đóng cả hộp thống kê */
(function hookClean(){ var f=window.__tourClean; if(typeof f!=="function"){ setTimeout(hookClean, 1000); return; } if(f.__rps) return;
  var g=function(){ document.querySelectorAll(".rps-ov.show").forEach(function(o){ o.classList.remove("show"); }); return f.apply(this, arguments); }; g.__rps=1; window.__tourClean=g; })();
window.RPSTAT={ open:open, can:can, build:build, load:load, dueOf:dueOf, weekEnd:weekEnd, _st:ST, v:"1.0" };
})();
