/* ══ MMH TESTFLOW v1.0 (13/10/2026) — CHẾ ĐỘ TEST CỦA ADMIN · LUỒNG DỮ LIỆU ══
   Dùng chung MMH-CRM + MMH-Report — file GIỐNG HỆT NHAU ở 2 repo (sửa 1 nơi ⇒ chép sang nơi kia).
   Admin bật "Chế độ TEST" ⇒ dùng app như người dùng "TEST" (đổi vai: nhân viên · Quản lý · Giám đốc):
     · mọi lệnh tới Apps Script gửi kèm tm=1 + tmAs=<vai> + phiên email (tk) — backend MMH_TestMode.gs (kho mmh-backend) kiểm Admin,
       GHI THẬT vào file thật dưới tên TEST, email chỉ về Admin (tiêu đề [TEST]), người khác không thấy dữ liệu TEST, TEST không tính KPI;
     · mỗi lệnh ghi hiện thành 1 thẻ "Luồng dữ liệu": App → Backend (lệnh) → Lưu ở đâu (file ▸ tab ▸ dòng / file Drive) → Tiếp theo (email, lịch, KPI);
     · "Xoá dữ liệu test" gọi tmClean ở các backend của app.
   Cấu hình mỗi app — window.TESTFLOW_CFG (khai báo TRƯỚC file này):
     { app:"crm"|"rh", key:"mmh_test_crm", name:"MMH CRM", lang()→"vi"|"en",
       admin()→bool, email()→string, tk()→string,
       scopeLabel, scopes:[{k,label}], roles:[{k,label,sub}],
       read:{action:1}, labels:{ action:{t, tab, next:[…]} | fn(body,res)→{…} }, steps:[{t, m:[action…]}],
       clean()→[{url,name}], mount(fn)→nút lối vào (Admin, khi chưa bật), extra:{label, sub, run} (lựa chọn phụ trong hộp chọn),
       reload(), fab:{bottom, bottomMobile} }
   Trạng thái: localStorage[key] = { on:1, scope, role, by, at }. Nhật ký: localStorage.mmh_testflow_log (dùng chung 2 app ⇒ thấy cả luồng CRM ↔ Report Hub).
   App đọc trạng thái TRƯỚC khi khởi động (danh tính TEST) — xem TESTFLOW.state(key). */
(function(){
"use strict";
var C=window.TESTFLOW_CFG||{}, LOGK="mmh_testflow_log", FILEK="mmh_testflow_files", MAXLOG=150;
var BK={ /* tiền tố deployment ⇒ backend (kho mmh-backend · backends.json) */
  "AKfycbzn-5chM":["marketing","Report Hub – Marketing"], "AKfycbzKQYH15":["management","Report Hub – Management"],
  "AKfycbxWT_M07":["backoffice","Report Hub – Back Office"], "AKfycbwsX4cQE":["training","Training Hub"],
  "AKfycbzAsSxx8":["trip","Business Trip"], "AKfycbx-eZ0sO":["mkt-online","MKT Online"], "AKfycbwvH5YqD":["mkt-offline","MKT Offline"],
  "AKfycbx58htPc":["kpi","MMH KPI FY68"], "AKfycbyzmhECZ":["crm-dental","CRM Dental"], "AKfycbxxckrqw":["crm-surgical","CRM Surgical"],
  "AKfycbxsoTRbR":["crm-eyeless","CRM Eyeless"], "AKfycbwglPhfc":["crm-thai","CRM Thailand Surgical"], "AKfycbz1qIyw4":["cust-data","Data khách hàng"],
  "AKfycbz26knlK":["turnover","Turnover"], "AKfycbykuiMSX":["thai-mkt","Thai Surgical Marketing"], "AKfycbxH-EoEv":["product-data","Product Data"] };
var READ_RE=/^(boot|bundle|weekly|monthly|list|multi|version|ping|roster|sheets|sheetInfo|customerIndex|customerDetail|account360|visitFeed|kpi|dashboard|productCodes|photoMeta|photoB64|activity|custLog|myTasks|refStatus|mmList|mmGet|calendar|mmhCalendar|mmhOptions|tripMaster2?|tripInfo|tripSync|tfPending|tfLog|tfTrips|tfVer|naList|naPending|krData|krPreview|mtList|mtGet|mtTenders|mtPrices|rhAuth\w*|rhKpi|rhKpiTotal|rhKpiMail|rhKpiMailPreview|rhSessions|rhMeta|rhMaterials|rhDirectory|rhAssignList|rhMyChecks|rhAdminList|getTurnoverData|getNppDetail|customers|kpiApi\w*|tmInfo|healRows|debugLayout|activityLog|string|version2|me|bootstrap)$/;
var GAS=/^https:\/\/script\.google\.com\/(?:a\/[^\/]+\/)?macros\/s\/([\w-]+)\//;

function lsG(k){ try{ return localStorage.getItem(k); }catch(_){ return null; } }
function lsS(k,v){ try{ if(v==null) localStorage.removeItem(k); else localStorage.setItem(k,v); }catch(_){} }
function jget(k,d){ try{ var v=JSON.parse(lsG(k)||"null"); return v==null?d:v; }catch(_){ return d; } }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function en(){ try{ return C.lang && C.lang()==="en"; }catch(_){ return false; } }
function L(vi,e){ return en()?e:vi; }
/* chữ trong cấu hình: chuỗi hoặc [vi, en] */
function tx(v){ return Array.isArray(v)?(en()?(v[1]||v[0]):v[0]):(v==null?"":String(v)); }
function call(fn,d){ try{ return typeof fn==="function"?fn():d; }catch(_){ return d; } }
function admin(){ return !!call(C.admin,false); }
function hhmm(t){ var d=new Date(t); return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2); }
function bkOf(url){ var m=GAS.exec(String(url||"")); if(!m) return null; for(var k in BK) if(m[1].indexOf(k)===0) return { key:BK[k][0], name:BK[k][1], id:m[1] }; return { key:"?", name:"Apps Script", id:m[1] }; }

var ST=jget(C.key,null); if(ST && !ST.on) ST=null;
function role(){ return (ST&&ST.role)||((C.roles&&C.roles[0]&&C.roles[0].k)||"staff"); }
function roleObj(k){ var r=(C.roles||[]).filter(function(r){ return r.k===(k||role()); })[0]; return r?{ k:r.k, label:tx(r.label), sub:tx(r.sub) }:{ k:k, label:k||"", sub:"" }; }
function scopeObj(k){ var r=(C.scopes||[]).filter(function(r){ return r.k===(k||(ST&&ST.scope)); })[0]; return r?{ k:r.k, label:tx(r.label) }:null; }

/* ───────── nhật ký luồng ───────── */
var LOG=jget(LOGK,[]); if(!Array.isArray(LOG)) LOG=[];
var saveT=0;
function save(){ clearTimeout(saveT); saveT=setTimeout(function(){ try{ lsS(LOGK, JSON.stringify(LOG.slice(0,MAXLOG))); }catch(_){ LOG=LOG.slice(0,40); lsS(LOGK, JSON.stringify(LOG)); } }, 150); }
function files(){ return jget(FILEK,{}); }
function add(e){ if(Array.isArray(e.title)) e.title=tx(e.title); if(e.tab) e.tab=tx(e.tab); if(e.next) e.next=e.next.map(tx); e.id="f"+Date.now().toString(36)+Math.random().toString(36).slice(2,6); e.t=Date.now(); e.app=C.app; e.role=role(); LOG.unshift(e); if(LOG.length>MAXLOG) LOG.length=MAXLOG; save(); paint(); return e; }

/* nội dung gửi: các ô ngắn dễ đọc */
var SKIP={ action:1, tk:1, rid:1, callback:1, tm:1, tmAs:1, cv:1, _ts:1, push:1, at:1, b64:1, photo:1, data:1, trip:1, payload:1, html:1, htmlBody:1, items:1, pdf:1, file:1, files:1, mime:1, lat:1, lng:1, acc:1, sig:1, kk:1 };
function flat(o, out, pre){
  out=out||{}; if(!o || typeof o!=="object") return out;
  Object.keys(o).forEach(function(k){
    var v=o[k];
    if(k==="b64" && typeof v==="string"){ out["ảnh"]=Math.round(v.length*0.75/1024)+" KB"; return; }
    if(k==="photo" && v && v.b64){ out["ảnh"]=Math.round(String(v.b64).length*0.75/1024)+" KB"; return; }
    if((k==="data"||k==="trip"||k==="payload"||k==="row"&&typeof v==="string"&&/^\{/.test(v)) && typeof v==="string"){ try{ flat(JSON.parse(v), out, k); }catch(_){} return; }
    if((k==="data"||k==="trip") && v && typeof v==="object" && !Array.isArray(v)){ flat(v, out, k); return; }
    if(k==="items" && typeof v==="string"){ try{ var a=JSON.parse(v); if(Array.isArray(a)) out["số mục"]=a.length+" · "+a.map(function(x){ return (x.pic||"")+(x.decision?" "+x.decision:""); }).join(", ").slice(0,80); }catch(_){} return; }
    if(SKIP[k] || v==null || v==="" || typeof v==="object" || typeof v==="function") return;
    var s=String(v); if(s.length>90) s=s.slice(0,88)+"…";
    if(Object.keys(out).length<9) out[k]=s;
  });
  return out;
}
function bodyOf(url, init){
  var b={}, q={}; try{ new URL(url).searchParams.forEach(function(v,k){ q[k]=v; }); }catch(_){}
  var raw=init&&init.body;
  try{
    if(typeof raw==="string"){ try{ b=JSON.parse(raw); }catch(_){ var u=new URLSearchParams(raw); u.forEach(function(v,k){ b[k]=v; }); } }
    else if(raw && typeof raw.forEach==="function" && typeof raw.get==="function"){ raw.forEach(function(v,k){ b[k]=v; }); }
  }catch(_){}
  if(b.payload && typeof b.payload==="string"){ try{ var x=JSON.parse(b.payload); for(var k in x) if(b[k]==null) b[k]=x[k]; }catch(_){} }
  for(var k2 in q) if(b[k2]==null) b[k2]=q[k2];
  return b;
}
function label(action, body, res){
  var l=(C.labels||{})[action]; if(typeof l==="function"){ try{ l=l(body||{}, res||{}); }catch(_){ l=null; } }
  if(!l) return {};
  return { t:l.t?tx(l.t):"", tab:l.tab?tx(l.tab):"", next:(l.next||[]).map(tx).filter(String), ext:!!l.ext };
}
/* kết quả trả về ⇒ thông tin "lưu ở đâu" */
function resOf(j){
  if(!j || typeof j!=="object") return { ok:false, msg:L("Không đọc được phản hồi","Unreadable response") };
  var rec=j.rec||j.record||{}, r={ ok:j.ok!==false && !j.error, msg:String(j.message||j.msg||j.error||"").slice(0,240) };
  r.row=j.row||rec._row||(j.result&&j.result.row)||j.newRow||"";
  r.no=j.no||rec.id||j.id||j.caseId||"";
  r.url=j.url||(j.pdf&&j.pdf.url)||j.pdfUrl||j.folder||j.fileUrl||"";
  r.name=j.name||(j.pdf&&j.pdf.name)||"";
  r.dup=!!(j.dup||j.dedup);
  if(j.results && j.results.length) r.results=j.results.map(function(x){ return { ok:x.ok, pic:x.pic, row:x.row, status:x.status||x.already||"", err:x.error||x.mailErr||"", folder:x.folder||"" }; });
  if(j.mail && (j.mail.to||j.mail.cc)) r.mailInfo={ to:[].concat(j.mail.to||[]).join(", "), cc:[].concat(j.mail.cc||[]).join(", ") };
  if(j._tm){ r.tm=true; r.mails=(j._tm.mails||[]).map(function(m){ return { to:m.to, cc:m.cc, s:m.subject, f:m.files }; }); }
  if(j.sheets) r.sheets=j.sheets; if(j.files!=null && typeof j.files==="number") r.nfiles=j.files; if(j.trip!=null && typeof j.trip==="number") r.trip=j.trip;
  if(j.code==="TEST_ADMIN"||j.code==="TEST_AUTH") r.auth=true;
  return r;
}
function done(e, j, err){
  if(!e) return;
  if(err){ e.st="err"; e.res={ ok:false, msg:String(err).slice(0,200) }; }
  else { e.res=resOf(j); e.st=e.res.ok?"ok":"err"; var l=label(e.action, e.body, j); if(l.t) e.title=l.t; if(l.tab) e.tab=l.tab; if(l.next) e.next=l.next; e.ext=l.ext; }
  e.ms=Date.now()-e.t; save(); paint(); toastE(e); info(e.bk);
}
/* tên + link file của backend (tmInfo, chỉ chạy trong chế độ TEST) */
var INFO_ASK={};
function info(bk){
  if(!bk || !bk.key || bk.key==="?" || INFO_ASK[bk.key] || files()[bk.key]) return;
  INFO_ASK[bk.key]=1;
  jsonp(bk.url, { action:"tmInfo" }).then(function(j){ if(j && j.file){ var f=files(); f[bk.key]={ name:j.file.name, url:j.file.url }; lsS(FILEK, JSON.stringify(f)); paint(); } }, function(){});
}
function jsonp(url, params, ms){
  return new Promise(function(res, rej){
    var cb="__tflow_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7), s=document.createElement("script"), fin=false;
    var to=setTimeout(function(){ end(); rej(new Error(L("Hết thời gian chờ","Timed out"))); }, ms||90000);
    function end(){ fin=true; clearTimeout(to); try{ delete window[cb]; }catch(_){ window[cb]=undefined; } if(s.parentNode) s.parentNode.removeChild(s); }
    window[cb]=function(j){ if(fin) return; end(); res(j); };
    var q=Object.assign({ pic:"TEST", tk:call(C.tk,""), _ts:Date.now(), callback:cb }, params);
    s.onerror=function(){ if(fin) return; end(); rej(new Error(L("Không kết nối được máy chủ","Cannot reach the server"))); };
    s.src=String(url).split("?")[0]+"?"+Object.keys(q).map(function(k){ return encodeURIComponent(k)+"="+encodeURIComponent(q[k]); }).join("&");
    document.body.appendChild(s);
  });
}

/* ───────── chặn & đánh dấu lệnh gửi Apps Script (chỉ khi đang bật) ───────── */
function isWrite(a){ return !!a && !READ_RE.test(a) && !(C.read&&C.read[a]); }
/* tạo việc cho người khác (C.forceTest = { action:[khoá…] }) ⇒ người nhận đổi thành TEST: chế độ TEST không giao việc / ghi tên người thật */
function force(a, o){
  var ks=(C.forceTest||{})[a]; if(!ks || !o || typeof o!=="object") return null; var ch=[];
  ks.forEach(function(k){ var v=o[k]; if(typeof v==="string" && v.trim() && !/^TEST(\b|_)/.test(v.trim())){ ch.push(v+" → TEST"); o[k]="TEST"; } });
  return ch.length?ch:null;
}
function tagUrl(url){
  if(!GAS.test(url) || /[?&]tm=1/.test(url)) return url;
  return url+(url.indexOf("?")<0?"?":"&")+"tm=1&tmAs="+encodeURIComponent(role());
}
function install(){
  if(window.__tfOn) return; window.__tfOn=true;
  /* <script src> (JSONP) */
  try{
    var d=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src");
    Object.defineProperty(HTMLScriptElement.prototype,"src",{ configurable:true, enumerable:d.enumerable, get:d.get, set:function(v){
      var url=String(v||"");
      if(GAS.test(url)){
        var bk=bkOf(url), p={}; try{ new URL(url).searchParams.forEach(function(x,k){ p[k]=x; }); }catch(_){}
        var a=p.action||"", fc=null;
        if((C.forceTest||{})[a]){ try{ var U=new URL(url), pp={}; U.searchParams.forEach(function(x,k){ pp[k]=x; }); fc=force(a, pp); if(fc){ Object.keys(pp).forEach(function(k){ U.searchParams.set(k, pp[k]); }); url=U.toString(); p=pp; } }catch(_){} }
        url=tagUrl(url);
        if(isWrite(a) && p.callback && !/^__tflow_/.test(p.callback)){
          var e=add({ action:a, bk:{ key:bk.key, name:bk.name, url:url.split("?")[0] }, body:flat(p), st:"run", via:"jsonp", forced:fc });
          var cb=p.callback, f0=window[cb];
          if(typeof f0==="function"){ window[cb]=function(j){ try{ done(e, j); }catch(_){} return f0.apply(this, arguments); }; }
          var me=this; this.addEventListener("error", function(){ if(e.st==="run") done(e, null, L("Không kết nối được máy chủ","Cannot reach the server")); });
          setTimeout(function(){ if(e.st==="run"){ e.st="unk"; save(); paint(); } }, 150000);
        }
      }
      return d.set.call(this, url);
    } });
  }catch(_){}
  /* fetch */
  var f0=window.fetch;
  window.fetch=function(input, init){
    var url=typeof input==="string"?input:(input&&input.url)||"";
    if(!GAS.test(url)) return f0.apply(this, arguments);
    var bk=bkOf(url), body=bodyOf(url, init), a=body.action||"";
    url=tagUrl(url);
    var raw=init&&init.body, ni=init?Object.assign({}, init):undefined, fc=null;
    try{
      if(typeof raw==="string" && /^\s*\{/.test(raw)){ var o=JSON.parse(raw); fc=force(a, o); o.tm=1; o.tmAs=role(); if(!o.tk && call(C.tk,"")) o.tk=call(C.tk,""); ni.body=JSON.stringify(o); }
      else if(raw && typeof raw.set==="function"){
        if((C.forceTest||{})[a]){ var pl=null; try{ pl=JSON.parse(raw.get("payload")||"null"); }catch(_){} if(pl){ fc=force(a, pl); if(fc) raw.set("payload", JSON.stringify(pl)); } else { var po={}; raw.forEach(function(v,k){ po[k]=v; }); fc=force(a, po); if(fc) Object.keys(po).forEach(function(k){ raw.set(k, po[k]); }); } }
        raw.set("tm","1"); raw.set("tmAs", role()); if(!raw.get("tk") && call(C.tk,"")) raw.set("tk", call(C.tk,""));
      }
    }catch(_){}
    if(fc) body=bodyOf(url, ni||init);
    /* JSONP đọc bằng fetch (khối AUTH) đã được ghi nhận ở <script src> ⇒ không ghi 2 lần */
    var e=(isWrite(a) && !/[?&]callback=/.test(url))?add({ action:a, bk:{ key:bk.key, name:bk.name, url:url.split("?")[0] }, body:flat(body), st:"run", via:"fetch", forced:fc }):null;
    var pr=f0.call(this, typeof input==="string"?url:input, ni);
    if(e) pr.then(function(r){ try{ r.clone().text().then(function(t){ var j=null; try{ j=JSON.parse(t); }catch(_){ var m=/^[\w$.]+\(([\s\S]*)\);?\s*$/.exec(t); if(m){ try{ j=JSON.parse(m[1]); }catch(_){} } } done(e, j, j?null:L("Phản hồi không phải JSON","Not a JSON response")); }, function(){ done(e, null, "?"); }); }catch(_){ } return r; },
      function(err){ done(e, null, err && err.message || err); });
    return pr;
  };
}

/* ───────── giao diện ───────── */
var CSS='\
#tf-strip{position:fixed;left:0;right:0;top:0;height:3px;background:repeating-linear-gradient(90deg,#F2B705 0 18px,#1E3A4F 18px 30px);z-index:10080;pointer-events:none}\
#tf-fab{position:fixed;left:14px;bottom:var(--tf-fb,16px);z-index:var(--tf-z,9000);display:flex;align-items:center;gap:8px;height:38px;padding:0 14px 0 10px;border-radius:19px;border:1px solid #E8C95A;background:#FFF6D6;color:#5A4500;font:700 13px/1 Aptos,"Segoe UI",sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,31,48,.16)}\
#tf-fab b{background:#1E3A4F;color:#FFE100;border-radius:6px;padding:3px 6px;font-size:11px;letter-spacing:.06em}\
#tf-fab .n{min-width:18px;height:18px;border-radius:9px;background:#3A5CAA;color:#fff;font-size:11px;line-height:18px;text-align:center;padding:0 5px}\
#tf-fab .n.run{background:#C77700}#tf-fab .n.err{background:#B3261E}\
#tf-pn{position:fixed;top:0;right:0;bottom:0;width:min(540px,100vw);z-index:10075;background:#fff;border-left:1px solid #E6EAEF;display:flex;flex-direction:column;font-family:Aptos,"Segoe UI",sans-serif;color:#1D2B3A;transform:translateX(102%);transition:transform .22s ease}\
#tf-pn.show{transform:none;box-shadow:-10px 0 30px rgba(0,31,48,.14)}\
.tf-hd{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;border-bottom:1px solid #EEF1F4}\
.tf-hd h3{margin:0;font-size:16px;color:#003047;flex:1}.tf-hd h3 small{display:block;font-size:12px;color:#6B7B8C;font-weight:500;margin-top:2px}\
.tf-x{border:0;background:none;font-size:24px;line-height:1;color:#6B7B8C;cursor:pointer;padding:0 4px}\
.tf-sc{overflow:auto;flex:1;padding:12px 16px 24px}\
.tf-box{border:1px solid #E6EAEF;border-radius:12px;padding:10px 12px;margin-bottom:12px;background:#fff}\
.tf-box h4{margin:0 0 8px;font-size:12px;letter-spacing:.06em;color:#6B7B8C;text-transform:uppercase}\
.tf-roles{display:flex;gap:6px;flex-wrap:wrap}\
.tf-roles button,.tf-scopes button{border:1px solid #D5DCE4;background:#fff;border-radius:9px;padding:7px 10px;font:600 13px Aptos,"Segoe UI",sans-serif;color:#33475B;cursor:pointer;text-align:left}\
.tf-roles button small{display:block;font-weight:500;font-size:11.5px;color:#7A8999;margin-top:2px}\
.tf-roles button.on,.tf-scopes button.on{border-color:#3A5CAA;background:#F0F5FF;color:#1F3F8A}\
.tf-rules{margin:8px 0 0;padding-left:18px;font-size:12.5px;color:#41566F;line-height:1.55}\
.tf-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}\
.tf-btn{height:34px;padding:0 12px;border-radius:9px;border:1px solid #D5DCE4;background:#fff;color:#33475B;font:600 13px Aptos,"Segoe UI",sans-serif;cursor:pointer}\
.tf-btn.pri{background:#3A5CAA;border-color:#3A5CAA;color:#fff}.tf-btn.warn{color:#9A3B12;border-color:#EBC2A8}\
.tf-btn:disabled{opacity:.5;cursor:default}\
.tf-steps{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;font-size:12.5px;color:#41566F}\
.tf-steps span{display:flex;gap:6px;align-items:flex-start}.tf-steps i{flex:none;width:15px;height:15px;border-radius:50%;border:1.5px solid #B8C3CF;margin-top:1px;font-style:normal;font-size:10px;line-height:12px;text-align:center;color:#fff}\
.tf-steps span.ok i{background:#2E7D32;border-color:#2E7D32}.tf-steps span.ok{color:#1E5A2A}\
.tf-tl h4{display:flex;align-items:center}.tf-tl h4 span{flex:1}\
.tf-e{border:1px solid #E6EAEF;border-left:4px solid #9AA8B6;border-radius:10px;padding:9px 11px;margin-bottom:9px;background:#fff}\
.tf-e.ok{border-left-color:#2E7D32}.tf-e.err{border-left-color:#B3261E;background:#FFFBFA}.tf-e.run{border-left-color:#C77700}.tf-e.clean{border-left-color:#6B4FA0}\
.tf-e.fresh{animation:tfIn .5s ease}@keyframes tfIn{from{background:#FFF6D6}to{background:#fff}}\
.tf-eh{display:flex;align-items:baseline;gap:8px;font-size:13.5px}.tf-eh b{color:#003047;flex:1}.tf-eh time{font-size:11.5px;color:#8A97A6}\
.tf-pill{font-size:11px;font-weight:700;padding:2px 7px;border-radius:8px;background:#EEF1F4;color:#41566F;white-space:nowrap}\
.tf-pill.ok{background:#E6F4EA;color:#1E6B34}.tf-pill.err{background:#FBE9E7;color:#A23B30}.tf-pill.run{background:#FFF1D6;color:#8A5300}\
.tf-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 10px;margin-top:8px}\
.tf-n{position:relative;border:1px solid #E6EAEF;border-radius:8px;padding:6px 7px;font-size:11.5px;line-height:1.35;color:#33475B;background:#FAFBFC;min-width:0;overflow-wrap:anywhere}\
.tf-n:nth-child(odd):after{content:"";position:absolute;right:-10px;top:50%;width:10px;height:1.5px;background:#9AA8B6}\
.tf-n em{display:block;font-style:normal;font-size:10px;font-weight:700;letter-spacing:.05em;color:#8A97A6;text-transform:uppercase;margin-bottom:2px}\
.tf-n a{color:#3A5CAA;font-weight:600;text-decoration:none}\
.tf-n.on{background:#F0F5FF;border-color:#C9D7F2}.tf-n.ml{background:#FFF8E6;border-color:#F1E2B8}\
.tf-kv{margin-top:6px;font-size:11.5px;color:#5B6B7D;line-height:1.45}.tf-kv span{display:inline-block;margin-right:8px}.tf-kv span b{color:#33475B;font-weight:600}\
.tf-msg{margin-top:5px;font-size:12px;color:#41566F}.tf-e.err .tf-msg{color:#A23B30}\
.tf-empty{font-size:13px;color:#7A8999;text-align:center;padding:18px 6px;border:1px dashed #D5DCE4;border-radius:10px}\
#tf-ts{position:fixed;left:14px;bottom:calc(var(--tf-fb,16px) + 46px);z-index:10071;display:flex;flex-direction:column;gap:6px;max-width:min(380px,calc(100vw - 28px))}\
#tf-ts div{background:#1E3A4F;color:#fff;border-radius:10px;padding:8px 12px;font:600 12.5px/1.4 Aptos,"Segoe UI",sans-serif;box-shadow:0 6px 18px rgba(0,31,48,.2);cursor:pointer;animation:tfIn2 .25s ease}\
#tf-ts div.err{background:#A23B30}#tf-ts div small{display:block;font-weight:500;opacity:.85}\
@keyframes tfIn2{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}\
#tf-pk{position:fixed;inset:0;z-index:10090;background:rgba(0,31,48,.34);display:flex;align-items:flex-start;justify-content:center;padding:6vh 14px;overflow:auto;font-family:Aptos,"Segoe UI",sans-serif}\
#tf-pk .tf-card{background:#fff;border-radius:14px;border:1px solid #E6EAEF;width:min(620px,100%);padding:18px 20px;box-shadow:0 12px 32px rgba(0,31,48,.18)}\
#tf-pk h3{margin:0 0 4px;font-size:17px;color:#003047}#tf-pk p{margin:0 0 12px;font-size:13px;color:#5B6B7D;line-height:1.55}\
#tf-pk .tf-lb{font-size:12px;font-weight:700;color:#6B7B8C;letter-spacing:.05em;text-transform:uppercase;margin:12px 0 6px}\
#tf-pk .tf-scopes{display:flex;gap:6px;flex-wrap:wrap}\
#tf-pk .tf-ft{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}\
#tf-pk .tf-alt{margin-top:14px;padding-top:12px;border-top:1px solid #EEF1F4;font-size:12.5px;color:#5B6B7D}\
#tf-pk .tf-alt button{border:0;background:none;color:#3A5CAA;font:600 13px Aptos,"Segoe UI",sans-serif;cursor:pointer;padding:0}\
@media(max-width:720px){#tf-fab{bottom:var(--tf-fbm,84px);left:10px;height:34px;font-size:12px}\
 #tf-pn{top:auto;height:88vh;width:100vw;border-left:0;border-top:1px solid #E6EAEF;border-radius:16px 16px 0 0;transform:translateY(102%)}#tf-pn.show{transform:none}\
 .tf-flow{grid-template-columns:1fr}.tf-n:nth-child(odd):after,.tf-n:not(:last-child):after{content:"";right:auto;left:14px;top:auto;bottom:-6px;width:1.5px;height:6px}\
 .tf-steps{grid-template-columns:1fr}#tf-ts{left:10px;bottom:calc(var(--tf-fbm,84px) + 42px)}}';
function css(){ if(document.getElementById("tf-css")) return; var s=document.createElement("style"); s.id="tf-css"; s.textContent=CSS+(C.css||""); document.head.appendChild(s); }
var NOW={};
function nodeHtml(e){
  var bk=e.bk||{}, f=files()[bk.key]||null, r=e.res||{}, h="";
  var app=(tx(C.name)||"App")+(e.app&&e.app!==C.app?" ("+(e.app==="crm"?"CRM":"Report Hub")+")":"");
  h+='<div class="tf-n"><em>① '+L("Thao tác","Action")+'</em>'+esc(app)+'<br><b>'+esc(e.title||e.action)+'</b><br>'+L("vai ","as ")+esc((roleObj(e.role).label)||e.role)+(e.forced?'<br><small style="color:#8A5300">'+L("Người nhận ","Assignee ")+esc(e.forced.join(", "))+L(" (chế độ TEST không giao việc cho người thật)"," (TEST mode never assigns to real people)")+'</small>':'')+'</div>';
  h+='<div class="tf-n on"><em>② Backend</em>'+esc(bk.name||"?")+'<br><code style="font-size:11px">'+esc(e.action)+'</code>'+(e.ms?'<br><small>'+(e.ms/1000).toFixed(1)+' s</small>':'')+'</div>';
  var w="";
  if(r.ok){
    if(!e.ext) w+=(f?'<a href="'+esc(f.url)+'" target="_blank" rel="noopener">'+esc(f.name)+' ↗</a>':esc(bk.name||""))+(e.tab?'<br>▸ ':'');
    if(e.tab) w+=esc(e.tab);
    if(r.row) w+='<br>▸ '+L("dòng ","row ")+esc(r.row);
    if(r.no && String(r.no)!==String(r.row)) w+='<br>'+L("mã ","id ")+esc(r.no);
    if(r.name) w+='<br>'+esc(r.name);
    if(r.url) w+='<br><a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+L("Mở file / ảnh ↗","Open file ↗")+'</a>';
    if(r.results) w+=r.results.map(function(x){ return '<br>'+(x.ok?"✓ ":"✗ ")+esc(x.pic)+(x.row?" · "+L("dòng ","row ")+x.row:"")+(x.status?" · "+esc(x.status):"")+(x.folder?' · <a href="'+esc(x.folder)+'" target="_blank" rel="noopener">folder ↗</a>':""); }).join("");
    if(r.sheets) w+=r.sheets.map(function(s){ return '<br>'+esc(s.name)+': '+s.rows; }).join("")+(r.trip?'<br>Business Trip: '+r.trip:'')+(r.nfiles?'<br>Drive: '+r.nfiles+' file':'');
    if(r.dup) w+='<br><i>'+L("đã có — không ghi trùng","already saved — no duplicate")+'</i>';
  } else w+=e.st==="run"?L("đang gửi…","sending…"):e.st==="unk"?L("chưa rõ (hết giờ chờ)","unknown (timed out)"):L("chưa lưu","not saved");
  h+='<div class="tf-n"><em>③ '+L("Lưu ở","Saved in")+'</em>'+w+'</div>';
  var nx="";
  if(r.mails && r.mails.length) nx+=r.mails.map(function(m){ return '✉ '+L("Lẽ ra gửi ","Would go to ")+esc(m.to||"—")+(m.cc?' · CC '+esc(m.cc):'')+' ⇒ <b>'+L("chỉ về Admin","Admin only")+'</b> <small>[TEST] '+esc(String(m.s||"").slice(0,70))+'</small>'; }).join("<br>");
  else if(r.mailInfo) nx+='✉ '+esc(r.mailInfo.to)+(r.mailInfo.cc?' · CC '+esc(r.mailInfo.cc):'');
  if(e.next && e.next.length) nx+=(nx?"<br>":"")+e.next.map(function(x){ return "→ "+esc(x); }).join("<br>");
  if(!nx) nx=r.ok?L("Không gửi email","No e-mail"):"—";
  h+='<div class="tf-n'+(r.mails&&r.mails.length?" ml":"")+'"><em>④ '+L("Tiếp theo","Next")+'</em>'+nx+'</div>';
  return h;
}
function entryHtml(e){
  if(e.kind==="note") return '<div class="tf-e" style="padding:6px 11px;border-left-color:#1E3A4F"><div class="tf-eh"><b style="font-weight:600">'+esc(e.title)+'</b><time>'+hhmm(e.t)+'</time></div></div>';
  var st=e.kind==="clean"?"clean":e.st, pill=e.st==="ok"?L("Đã lưu","Saved"):e.st==="err"?L("Lỗi","Error"):e.st==="run"?L("Đang gửi","Sending"):L("Chưa rõ","Unknown");
  if(e.kind==="clean") pill=e.st==="ok"?L("Đã xoá","Removed"):pill;
  var kv=Object.keys(e.body||{}).map(function(k){ return '<span>'+esc(k)+': <b>'+esc(e.body[k])+'</b></span>'; }).join("");
  var fresh=Date.now()-e.t<4000 && !NOW[e.id]; if(fresh) NOW[e.id]=1;
  return '<div class="tf-e '+st+(fresh?" fresh":"")+'"><div class="tf-eh"><b>'+esc(e.title||e.action)+'</b><span class="tf-pill '+e.st+'">'+pill+'</span><time>'+hhmm(e.t)+'</time></div>'
    +'<div class="tf-flow">'+nodeHtml(e)+'</div>'
    +(kv?'<div class="tf-kv">'+kv+'</div>':'')
    +(e.res&&e.res.msg?'<div class="tf-msg">'+esc(e.res.msg)+'</div>':'')+'</div>';
}
function stepsHtml(){
  var S=C.steps||[]; if(!S.length) return "";
  var have={}; LOG.forEach(function(e){ if(e.st==="ok") have[e.action+"|"+(e.role||"")]=have[e.action]=1; });
  var n=0, rows=S.map(function(s){ var ok=(s.m||[]).some(function(a){ var p=a.split("@"); return p[1]?have[p[0]+"|"+p[1]]:have[p[0]]; }); if(ok) n++; return '<span class="'+(ok?"ok":"")+'"><i>'+(ok?"✓":"")+'</i>'+esc(tx(s.t))+'</span>'; }).join("");
  return '<div class="tf-box"><h4>'+L("Kịch bản test","Test checklist")+' · '+n+'/'+S.length+'</h4><div class="tf-steps">'+rows+'</div></div>';
}
function paint(){
  if(!ST) return;
  var fab=document.getElementById("tf-fab");
  if(fab){
    var run=LOG.filter(function(e){ return e.st==="run"; }).length, err=LOG.filter(function(e){ return e.st==="err" && Date.now()-e.t<3600e3; }).length, mine=LOG.filter(function(e){ return Date.now()-e.t<12*3600e3; }).length;
    fab.innerHTML='<b>TEST</b><span>'+esc(roleObj().label)+'</span><span class="n'+(run?" run":err?" err":"")+'">'+(run||mine)+'</span>';
  }
  var pn=document.getElementById("tf-pn"); if(!pn || !pn.classList.contains("show")) return;
  var sc=pn.querySelector(".tf-sc"), keep=sc.scrollTop;
  var so=scopeObj();
  sc.innerHTML='<div class="tf-box"><h4>'+L("Đang dùng như","Acting as")+'</h4><div class="tf-roles">'+(C.roles||[]).map(function(r0){ var r=roleObj(r0.k); return '<button data-role="'+r.k+'" class="'+(r.k===role()?"on":"")+'">'+esc(r.label)+(r.sub?'<small>'+esc(r.sub)+'</small>':'')+'</button>'; }).join("")+'</div>'
    +(C.scopes&&C.scopes.length?'<div style="margin-top:8px;font-size:12.5px;color:#41566F">'+esc(tx(C.scopeLabel)||L("Phạm vi","Scope"))+': <b>'+esc(so?so.label:"—")+'</b> <button class="tf-btn" data-act="pick" style="height:26px;font-size:12px;margin-left:6px">'+L("Đổi","Change")+'</button></div>':'')
    +'<ul class="tf-rules"><li>'+L("Dữ liệu ghi <b>thật</b> vào file thật, người dùng / tên bắt đầu bằng <b>TEST</b> (ảnh: TEST_ngày_…).","Data is <b>really</b> saved to the real files, user / names start with <b>TEST</b>.")+'</li>'
    +'<li>'+L("Mọi email chỉ gửi về ","All e-mails go only to ")+'<b>'+esc(call(C.email,"Admin"))+'</b>'+L(", tiêu đề [TEST].",", subject [TEST].")+'</li>'
    +'<li>'+L("Người khác không thấy dữ liệu TEST; TEST không tính KPI. Vai Giám đốc / Quản lý chỉ duyệt được hồ sơ TEST.","Others never see TEST data; TEST is not counted in KPI. Director / Manager roles can approve TEST records only.")+'</li></ul>'
    +'<div class="tf-acts"><button class="tf-btn warn" data-act="clean">'+L("Xoá dữ liệu test","Delete test data")+'</button><button class="tf-btn" data-act="clear">'+L("Xoá nhật ký","Clear log")+'</button><button class="tf-btn pri" data-act="stop">'+L("Thoát chế độ TEST","Exit TEST mode")+'</button></div></div>'
    +stepsHtml()
    +'<div class="tf-tl"><h4 style="margin:4px 0 8px;font-size:12px;letter-spacing:.06em;color:#6B7B8C;text-transform:uppercase"><span>'+L("Luồng dữ liệu","Data flow")+' · '+LOG.length+'</span></h4>'
    +(LOG.length?LOG.slice(0,60).map(entryHtml).join(""):'<div class="tf-empty">'+L("Chưa có thao tác nào. Thao tác trên app như bình thường — mỗi lần lưu sẽ hiện ở đây: lưu vào file nào, dòng nào, email gửi tới ai.","Nothing yet. Use the app as usual — each save shows up here.")+'</div>')+'</div>';
  sc.scrollTop=keep;
}
function panel(open){
  css();
  var pn=document.getElementById("tf-pn");
  if(!pn){
    pn=document.createElement("div"); pn.id="tf-pn"; pn.setAttribute("role","dialog");
    pn.innerHTML='<div class="tf-hd"><h3>'+L("Chế độ TEST · Luồng dữ liệu","TEST mode · Data flow")+'<small>'+esc(tx(C.name))+' — '+L("ghi thật dưới tên TEST","real saves under the name TEST")+'</small></h3><button class="tf-x" title="'+L("Đóng","Close")+'">×</button></div><div class="tf-sc"></div>';
    document.body.appendChild(pn);
    pn.querySelector(".tf-x").onclick=function(){ panel(false); };
    pn.addEventListener("click", function(ev){
      var b=ev.target.closest("button"); if(!b) return;
      var r=b.getAttribute("data-role"), a=b.getAttribute("data-act");
      if(r && r!==role()) setRole(r);
      if(a==="clean") clean(); if(a==="clear"){ if(confirm(L("Xoá nhật ký luồng dữ liệu trên máy này?","Clear the data-flow log on this device?"))){ LOG=[]; save(); paint(); } }
      if(a==="stop") stop(); if(a==="pick") pick();
    });
  }
  pn.classList.toggle("show", open!==false);
  paint();
}
var TS=null;
function toastE(e){
  if(!ST) return;
  if(!TS){ TS=document.createElement("div"); TS.id="tf-ts"; document.body.appendChild(TS); }
  var r=e.res||{}, f=files()[(e.bk||{}).key];
  var t=(e.st==="ok"?"✓ ":"✗ ")+(e.title||e.action), s=e.st==="ok"?((e.ext?"":(f?f.name:(e.bk||{}).name)+(e.tab?" ▸ ":""))+(e.tab||"")+(r.row?" ▸ "+L("dòng ","row ")+r.row:"")+(r.mails&&r.mails.length?" · ✉ "+r.mails.length+L(" email về Admin"," e-mail(s) to Admin"):"")):(r.msg||"");
  var d=document.createElement("div"); if(e.st!=="ok") d.className="err";
  d.innerHTML=esc(t)+'<small>'+esc(s)+' · '+L("bấm để xem luồng","tap to see the flow")+'</small>';
  d.onclick=function(){ d.remove(); panel(true); };
  TS.appendChild(d); while(TS.children.length>3) TS.removeChild(TS.firstChild);
  setTimeout(function(){ if(d.parentNode) d.remove(); }, e.st==="ok"?6000:10000);
}
function ui(){
  css();
  if(!document.getElementById("tf-strip")){ var s=document.createElement("div"); s.id="tf-strip"; document.body.appendChild(s); }
  if(!document.getElementById("tf-fab")){
    var b=document.createElement("button"); b.id="tf-fab"; b.type="button"; b.title=L("Chế độ TEST — xem luồng dữ liệu","TEST mode — data flow");
    if(C.fab){ if(C.fab.bottom) b.style.setProperty("--tf-fb", C.fab.bottom); if(C.fab.bottomMobile) b.style.setProperty("--tf-fbm", C.fab.bottomMobile); if(C.fab.z) b.style.setProperty("--tf-z", C.fab.z); }
    b.onclick=function(){ var p=document.getElementById("tf-pn"); panel(!(p && p.classList.contains("show"))); };
    document.body.appendChild(b);
  }
  var tt=function(){ if(!/^\[TEST\]/.test(document.title)) document.title="[TEST] "+document.title; }; tt(); setInterval(tt, 3000);
  paint();
}

/* ───────── bật / tắt / đổi vai ───────── */
function setState(o){ ST=o; lsS(C.key, o?JSON.stringify(o):null); }
function start(scope, r){
  if(!admin()){ alert(L("Chế độ TEST chỉ dành cho Admin (đăng nhập bằng email).","TEST mode is for the Admin only.")); return; }
  setState({ on:1, scope:scope||(C.scopes&&C.scopes[0]&&C.scopes[0].k)||"", role:r||role(), by:call(C.email,""), at:Date.now() });
  add({ kind:"note", action:"tmStart", title:L("Bật chế độ TEST","TEST mode on")+" · "+roleObj(r).label, st:"ok", body:{}, res:{ ok:true } });
  reload();
}
function stop(){
  if(!confirm(L("Thoát chế độ TEST và quay về tài khoản của bạn?\n(Dữ liệu TEST đã lưu vẫn còn — dùng \"Xoá dữ liệu test\" nếu muốn xoá.)","Exit TEST mode and return to your own account?"))) return;
  setState(null); try{ if(C.stop) C.stop(); }catch(_){} reload();
}
function setRole(r){ if(!ST) return; ST.role=r; setState(ST); add({ kind:"note", action:"tmRole", title:L("Đổi vai: ","Role: ")+roleObj(r).label, st:"ok", body:{}, res:{ ok:true } }); reload(); }
function reload(){ try{ if(C.reload){ C.reload(); return; } }catch(_){} location.reload(); }
function clean(){
  var T=call(C.clean,[])||[]; if(!T.length) return;
  if(!confirm(L("Xoá MỌI dữ liệu TEST ở: ","Delete ALL TEST data in: ")+T.map(function(x){ return x.name; }).join(", ")+L(" ?\n\nDòng có PIC \"TEST\" bị xoá nội dung (giữ công thức), đề xuất công tác TEST + folder, ảnh / file \"TEST_…\" trên Drive. Dữ liệu thật không bị đụng tới."," ?\n\nRows with PIC \"TEST\", TEST trip proposals + folders and \"TEST_…\" Drive files are removed. Real data is not touched."))) return;
  var pn=document.querySelector('#tf-pn [data-act="clean"]'); if(pn){ pn.disabled=true; pn.textContent=L("Đang xoá…","Deleting…"); }
  var all=T.map(function(x){
    var bk=bkOf(x.url)||{ key:"?", name:x.name };
    var e=add({ kind:"clean", action:"tmClean", title:L("Xoá dữ liệu test · ","Delete test data · ")+x.name, bk:{ key:bk.key, name:bk.name, url:x.url }, st:"run", body:{} });
    return jsonp(x.url, { action:"tmClean", tm:1, tmAs:role() }, 150000).then(function(j){ done(e, j); }, function(err){ done(e, null, err.message); });
  });
  Promise.all(all).then(function(){ if(pn){ pn.disabled=false; pn.textContent=L("Xoá dữ liệu test","Delete test data"); } try{ if(C.afterClean) C.afterClean(); }catch(_){} });
}
function pick(){
  if(!admin()) return;
  css();
  var old=document.getElementById("tf-pk"); if(old) old.remove();
  var sel={ scope:(ST&&ST.scope)||(C.scopes&&C.scopes[0]&&C.scopes[0].k)||"", role:role() };
  var o=document.createElement("div"); o.id="tf-pk";
  function draw(){
    o.innerHTML='<div class="tf-card" role="dialog"><h3>'+L("Chế độ TEST — ghi thật dưới tên TEST","TEST mode — real saves under the name TEST")+'</h3>'
      +'<p>'+L("Dùng app như một người dùng tên <b>TEST</b> để thử mọi chức năng (chụp ảnh, công tác, duyệt, báo cáo tuần / tháng / KPI, mở mới…). Dữ liệu được <b>lưu thật</b> vào file thật để thấy đúng luồng đi của dữ liệu; email chỉ gửi về <b>","Use the app as a user named <b>TEST</b> to try every function. Data is <b>really saved</b> to the real files; e-mails go only to <b>")+esc(call(C.email,""))+'</b>'+L("; người khác không thấy dữ liệu TEST, không tính KPI. Mỗi thao tác hiện trong bảng <b>Luồng dữ liệu</b>.","; nobody else sees TEST data and it is not counted in KPI.")+'</p>'
      +(C.scopes&&C.scopes.length?'<div class="tf-lb">'+esc(tx(C.scopeLabel)||L("Phạm vi","Scope"))+'</div><div class="tf-scopes">'+C.scopes.map(function(s){ return '<button data-s="'+s.k+'" class="'+(s.k===sel.scope?"on":"")+'">'+esc(tx(s.label))+'</button>'; }).join("")+'</div>':'')
      +'<div class="tf-lb">'+L("Vai","Role")+'</div><div class="tf-roles">'+(C.roles||[]).map(function(r0){ var r=roleObj(r0.k); return '<button data-r="'+r.k+'" class="'+(r.k===sel.role?"on":"")+'">'+esc(r.label)+(r.sub?'<small>'+esc(r.sub)+'</small>':'')+'</button>'; }).join("")+'</div>'
      +'<div class="tf-ft"><button class="tf-btn" data-x="1">'+L("Đóng","Close")+'</button><button class="tf-btn pri" data-go="1">'+(ST?L("Áp dụng","Apply"):L("Bắt đầu chế độ TEST","Start TEST mode"))+'</button></div>'
      +(C.extra&&!ST?'<div class="tf-alt">'+esc(tx(C.extra.sub))+' <button data-alt="1">'+esc(tx(C.extra.label))+' →</button></div>':'')
      +'</div>';
  }
  draw();
  o.addEventListener("click", function(ev){
    if(ev.target===o){ o.remove(); return; }
    var b=ev.target.closest("button"); if(!b) return;
    if(b.getAttribute("data-s")){ sel.scope=b.getAttribute("data-s"); draw(); }
    else if(b.getAttribute("data-r")){ sel.role=b.getAttribute("data-r"); draw(); }
    else if(b.getAttribute("data-x")) o.remove();
    else if(b.getAttribute("data-alt")){ o.remove(); try{ C.extra.run(); }catch(_){} }
    else if(b.getAttribute("data-go")){ o.remove(); if(ST){ ST.scope=sel.scope; ST.role=sel.role; setState(ST); reload(); } else start(sel.scope, sel.role); }
  });
  document.body.appendChild(o);
}

window.TESTFLOW={ on:function(){ return !!ST; }, state:function(){ return ST; }, role:role, scope:function(){ return ST&&ST.scope; },
  start:start, stop:stop, pick:pick, open:function(){ panel(true); }, close:function(){ panel(false); }, setRole:setRole, clean:clean,
  log:function(){ return LOG; }, add:add, files:files, ver:"1.0" };

/* lối vào cho Admin (khi chưa bật) */
var tries=0;
(function mountLoop(){
  if(ST) return;
  if(admin() && C.mount){ try{ if(C.mount(pick)) return; }catch(_){} }
  if(++tries<40) setTimeout(mountLoop, 1500);
})();
if(!ST) return;
/* đang bật nhưng không còn là Admin (phiên khác / đăng xuất) ⇒ tắt */
setTimeout(function(){ if(ST && !admin()){ setState(null); try{ if(C.stop) C.stop(); }catch(_){} location.reload(); } }, 2500);
window.__TF_TESTDIR=(role()==="dir");
install();
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", ui); else ui();
})();
