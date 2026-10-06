/* ══════════════════════════════════════════════════════════════════════════════
   APP_OUTBOX — hàng đợi ghi bền vững cho webapp tĩnh ↔ Google Apps Script
   · Thao tác hiện ngay trên giao diện (app tự làm), lệnh ghi được lưu localStorage rồi gửi TUẦN TỰ theo từng backend.
   · URL backend chụp lúc bấm (đổi tab / phòng ban không gửi nhầm). Số tạm "tmp-…" tự đổi sang số thật khi gửi.
   · Lỗi mạng / máy chủ bận ⇒ tự thử lại (giãn dần, cùng rid ⇒ backend chống ghi trùng).
   · Phản hồi không chắc (JSONP lỗi, timeout) ⇒ verify() đọc lại dữ liệu trước khi gửi lại.
   · Tải lại / đóng trang ⇒ lần mở sau tự gửi tiếp (lease theo tab, nhả lease khi pagehide).
   · Lỗi thật ⇒ chip đỏ + bảng "Thử lại / Bỏ". Lệnh phụ thuộc (dùng số tạm của lệnh lỗi) dừng theo.
   Dùng:  APP_OUTBOX.init({...});  APP_OUTBOX.add({action:"addItem", name:"…", __tmp:"tmp-…"}).then(r=>…)
   Không phụ thuộc thư viện ngoài. Xem references/outbox.md.
   ══════════════════════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var C={                                   /* cấu hình mặc định — ghi đè trong init() */
  key:"app_outbox_v1", mapKey:"app_tmpmap_v1",
  policy:{},                              /* action → {verify:bool, resend:bool, ui:bool, label:"…"} — chỉ action có ở đây mới vào hàng đợi */
  user:function(){ return "anon"; },      /* người đang đăng nhập (ops của người khác không chạy) */
  endpoint:function(){ return {url:"", src:""}; },     /* backend hiện tại — chụp lúc add() */
  current:function(){ return ""; },       /* nguồn đang xem (để overlay / đếm việc chờ) */
  idFields:["no","keyNo","parentNo"],     /* trường có thể chứa số tạm */
  timeout:60000, maxUrl:7500,
  verify:null,                            /* function(op) → Promise<{ok:true,no:"…"}|null> : tìm bản ghi vừa thêm trên máy chủ */
  resync:null,                            /* function(op) → Promise<bool> : số dòng đổi ⇒ tìm lại đúng dòng, sửa op.body */
  onCreated:null,                         /* function(tmp, realNo, op, res) : đổi số tạm → số thật trên giao diện */
  onDone:null, onFail:null, onChange:null,/* hook tuỳ chọn */
  overlay:null,                           /* function(pendingOps) : áp thay đổi chưa lưu lên dữ liệu mới tải */
  ui:true,                                /* chip góc phải dưới + bảng lỗi */
  transient:/lock|busy|bận|quá tải|timeout|timed out|try again|too many|exceeded|simultaneous|service (invoked|error|unavailable)|internal error|server error|unavailable|network|failed to fetch|mạng|tạm thời/i,
  mismatch:/không khớp|mismatch|đã (bị )?(thay )?đổi|không tìm thấy|not found|expect/i
};
var TAB=Math.random().toString(36).slice(2,9), Q=[], W={}, BUSY={}, T=null, MAP={}, NOURL={}, GONE=false, seq=0, LAST="";
function now(){ return Date.now(); }
function lsGet(k,d){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(_){ return d; } }
function lsSet(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(_){} }
function isTmp(v){ return typeof v==="string" && v.indexOf("tmp-")===0; }
function me(){ try{ return C.user()||""; }catch(_){ return ""; } }
function pol(a){ return C.policy[a]||{}; }
function rid(){ return now().toString(36)+"-"+Math.random().toString(36).slice(2,9); }

function save(release){
  var t=now();
  Q.forEach(function(o){ if(o.tab===TAB) o.lease=release?0:t+15000; });
  var other=lsGet(C.key,[]).filter(function(o){ return o && o.tab!==TAB && !Q.some(function(x){ return x.id===o.id; }); });
  lsSet(C.key, other.concat(Q));
}
function load(){
  var t=now();
  lsGet(C.key,[]).forEach(function(o){
    if(!o || !o.id || Q.some(function(x){ return x.id===o.id; })) return;
    if(o.tab!==TAB && o.lease>t) return;                       /* tab khác còn sống đang lo */
    o.tab=TAB;
    if(o.st==="run"){ o.st="q"; o.unc=(o.unc||0)+1; if(pol(o.a).verify) o.chk=1; }   /* tab cũ tắt giữa chừng ⇒ có thể đã ghi */
    Q.push(o); if(o.tmp) NOURL[o.tmp]={url:o.url,src:o.src};
  });
  var m=lsGet(C.mapKey,{});
  Object.keys(m).forEach(function(k){ if(t-(m[k].t||0)<2*86400000){ MAP[k]=m[k].no; if(m[k].url) NOURL[k]={url:m[k].url,src:m[k].src}; } });
}
function saveMap(tmp,no){ var m=lsGet(C.mapKey,{}), t=now(); Object.keys(m).forEach(function(k){ if(t-(m[k].t||0)>2*86400000) delete m[k]; });
  var u=NOURL[tmp]||{}; m[tmp]={no:no,t:t,url:u.url,src:u.src}; lsSet(C.mapKey,m); }

function add(body){
  var a=body.action, ep=OB.ctx||C.endpoint();
  C.idFields.forEach(function(f){ var v=body[f]; if(isTmp(v) && NOURL[v]) ep=NOURL[v]; });   /* đối tượng vừa tạo ở backend nào ⇒ gửi về đó */
  if(!body.rid) body.rid=rid();
  var tmp=body.__tmp||""; delete body.__tmp;
  var op={ id:body.rid, a:a, url:ep.url, src:ep.src, user:me(), body:body, tmp:tmp, tries:0, next:0, st:"q", err:"", why:"", t:now(), tab:TAB, lease:0, unc:0, rs:0 };
  if(tmp) NOURL[tmp]={url:op.url, src:op.src};
  if(OB.beforeAdd) try{ OB.beforeAdd(op); }catch(_){}
  Q.push(op); save(); paint();
  var p=new Promise(function(res,rej){ W[op.id]={res:res,rej:rej}; });
  setTimeout(pump,0);
  return p;
}
function prep(op){
  var b={}, wait=false, dead=null;
  Object.keys(op.body).forEach(function(k){
    var v=op.body[k];
    if(isTmp(v)){
      if(MAP[v]) v=MAP[v];
      else { var mk=Q.filter(function(x){ return x.tmp===v; })[0]; if(mk && mk.st!=="fail") wait=true; else dead=mk||true; }
    }
    b[k]=v;
  });
  if(dead) return {__dead: dead===true?"Bản ghi gốc chưa được lưu (đã huỷ)":"Đang chờ lưu “"+name(dead)+"”"};
  if(wait) return {__wait:true};
  if(OB.prepare) try{ OB.prepare(op, b); }catch(_){}           /* ví dụ: đặt b.expect = tên hiện tại trên máy chủ */
  return b;
}
function send(op,b){
  var params={}; Object.keys(b).forEach(function(k){ var v=b[k]; params[k]=(v!==null && typeof v==="object")?JSON.stringify(v):v; });
  var cb="__ob_"+now()+"_"+(++seq); params.callback=cb;
  var qs=Object.keys(params).map(function(k){ return encodeURIComponent(k)+"="+encodeURIComponent(params[k]==null?"":params[k]); }).join("&");
  if((op.url+"?"+qs).length>C.maxUrl) return post(op,b);
  return new Promise(function(resolve){
    var sc=document.createElement("script"), tm=setTimeout(function(){ fin({__unc:"timeout"}); }, C.timeout);
    function fin(d){ clearTimeout(tm); try{ delete window[cb]; }catch(_){ window[cb]=undefined; } if(sc.parentNode) sc.parentNode.removeChild(sc); resolve(d); }
    window[cb]=function(d){ fin(d||{__unc:"empty"}); };
    sc.onerror=function(){ fin({__unc:"script"}); };
    sc.src=op.url+"?"+qs; document.body.appendChild(sc);
  });
}
function post(op,b){
  var payload=JSON.stringify(b);
  return fetch(op.url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:payload})
    .then(function(r){ return r.text(); }).then(function(t){ return JSON.parse(t); })
    .catch(function(){ return fetch(op.url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:payload})
      .then(function(){ return {__unc:"post"}; }, function(){ return {__err:"network"}; }); });
}
function pump(){
  clearTimeout(T); T=null;
  if(!me()){ T=setTimeout(pump,1000); return; }
  var t=now(), wake=Infinity, g={};
  Q.forEach(function(o){ if(o.st==="fail"||o.user!==me()||o.tab!==TAB) return; (g[o.url]=g[o.url]||[]).push(o); });
  Object.keys(g).forEach(function(u){
    if(BUSY[u]) return;
    var o=g[u][0];
    if(o.next>t){ wake=Math.min(wake,o.next); return; }
    if(navigator.onLine===false){ wake=Math.min(wake,t+4000); return; }
    run(o);
  });
  if(wake<Infinity) T=setTimeout(pump, Math.max(250,wake-t));
  paint();
}
function backoff(o){ return Math.min(60000, 1500*Math.pow(2,Math.max(0,o.tries-1)))+Math.round(Math.random()*600); }
function run(o){
  var b=prep(o);
  if(b.__wait){ o.next=now()+800; setTimeout(pump,850); return; }
  if(b.__dead) return fail(o,b.__dead);
  BUSY[o.url]=1; o.st="run"; o.tries++; save(); paint();
  var p=(o.chk && C.verify) ? C.verify(o).then(function(v){ return v||send(o,b); }) : send(o,b);
  p.then(function(d){ handle(o,d||{__unc:"empty"}); }, function(e){ handle(o,{__err:String(e&&e.message||e)}); });
}
function retry(o,ms,why){ o.st="q"; o.next=now()+ms; o.why=why||""; BUSY[o.url]=0; save(); pump(); }
function handle(o,d){
  var P=pol(o.a);
  if(d.__unc){
    o.unc++;
    if(P.verify){ o.chk=1; return retry(o, o.unc===1?2500:backoff(o), "đang kiểm tra trên máy chủ"); }
    if(P.resend && o.unc<2) return retry(o,1500,"gửi lại để chắc chắn");
    return done(o,{ok:true,uncertain:true});
  }
  if(d.__err) return retry(o,backoff(o),"mạng chập chờn");
  if(P.verify && d.ok!==false && !d.no && !d.verified && o.unc<6){ o.unc++; o.chk=1; return retry(o,1500,"đang kiểm tra trên máy chủ"); }
  if(d.ok===false){
    var e=String(d.error||"Lỗi");
    if(C.transient.test(e)) return retry(o,backoff(o),"máy chủ bận");
    if(C.resync && C.mismatch.test(e) && o.rs<2){ o.rs++; BUSY[o.url]=0;
      return C.resync(o).then(function(ok){ if(ok) retry(o,300,"tìm lại đúng dòng"); else fail(o,e); }, function(){ fail(o,e); }); }
    return fail(o,e);
  }
  done(o,d);
}
function rm(o){ Q=Q.filter(function(x){ return x!==o; }); }
function done(o,r){
  rm(o); BUSY[o.url]=0;
  if(o.tmp && r && r.no){ var no=String(r.no); MAP[o.tmp]=no; saveMap(o.tmp,no); if(C.onCreated) try{ C.onCreated(o.tmp,no,o,r); }catch(_){} }
  save();
  if(C.onDone) try{ C.onDone(o,r); }catch(_){}
  var w=W[o.id]; delete W[o.id]; if(w) w.res(r);
  pump();
}
function fail(o,err){
  BUSY[o.url]=0; o.st="fail"; o.err=String(err||"Lỗi"); o.why="";
  if(pol(o.a).ui){ rm(o); save(); var w=W[o.id]; delete W[o.id]; if(w) w.rej(new Error(o.err)); pump(); return; }   /* hộp thoại đang chờ tự xử lý lỗi */
  Q.forEach(function(x){ if(x!==o && x.st!=="fail" && o.tmp && Object.keys(x.body).some(function(k){ return x.body[k]===o.tmp; })){ x.st="fail"; x.err="Đang chờ lưu “"+name(o)+"”"; } });
  save(); pump();
  if(C.onFail) try{ C.onFail(o); }catch(_){}
}
function name(o){ var b=o.body||{}, n=b.name||b.title||b.keyTask||""; return (pol(o.a).label||o.a)+(n?" · "+String(n).slice(0,70):""); }
function mine(){ return Q.filter(function(o){ return o.user===me(); }); }

/* ── giao diện: chip + bảng ── */
function esc(v){ return String(v==null?"":v).replace(/[&<>"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
var okT=null;
function paint(){
  var L=mine(), f=L.filter(function(o){ return o.st==="fail"; }).length, p=L.length-f,
      slow=L.some(function(o){ return o.st==="q" && o.tries>0 && o.next>now()+800; }),
      st=f?"fail":(p&&navigator.onLine===false)?"off":(p&&slow)?"retry":p?"saving":"";
  if(C.onChange) try{ C.onChange({pending:p, failed:f, state:st}); }catch(_){}
  if(!C.ui) return;
  var el=document.getElementById("ob-chip");
  if(!el){ el=document.createElement("div"); el.id="ob-chip"; el.onclick=function(){ if(/fail|retry|off/.test(el.className)) OB.open(); }; (document.body||document.documentElement).appendChild(el); }
  var html= st==="fail"?"⚠️ "+f+" thay đổi chưa lưu được — bấm để xem"
          : st==="off"?"📴 Mất mạng — "+p+" thay đổi sẽ tự lưu khi có mạng"
          : st==="retry"?"<i></i>Mạng chậm — đang tự thử lại · "+p+" chờ lưu"
          : st==="saving"?"<i></i>Đang lưu…"+(p>1?" ("+p+")":"") : "";
  var sig=st+"|"+html; if(sig===LAST) return; LAST=sig;
  clearTimeout(okT);
  if(st){ el.className="show "+st; el.innerHTML=html; }
  else if(el.className){ el.className="show ok"; el.innerHTML="✓ Đã lưu"; okT=setTimeout(function(){ el.className=""; },1400); }
  var pan=document.getElementById("ob-pan"); if(pan && pan.classList.contains("show")) OB.open();
}
var OB=window.APP_OUTBOX={
  ctx:null, beforeAdd:null, prepare:null,
  init:function(cfg){ Object.keys(cfg||{}).forEach(function(k){ C[k]=cfg[k]; }); load(); pump(); return OB; },
  handles:function(a){ return !!C.policy[a]; },
  add:add, pump:pump, list:function(){ return Q.slice(); }, map:MAP, realNo:function(no){ return MAP[no]||no; },
  pending:function(src){ return mine().filter(function(o){ return o.st!=="fail" && (src==null || o.src===src); }).length; },
  overlay:function(){ if(C.overlay) return C.overlay(mine().filter(function(o){ return o.src===C.current(); })); },
  retry:function(id){ Q.forEach(function(o){ if((!id||o.id===id) && o.st==="fail"){ o.st="q"; o.err=""; o.next=0; o.tries=0; o.rs=0; } }); save(); pump(); },
  drop:function(id){
    var o=Q.filter(function(x){ return x.id===id; })[0]; if(!o) return;
    var deps=Q.filter(function(x){ return o.tmp && Object.keys(x.body).some(function(k){ return x.body[k]===o.tmp; }); });
    [o].concat(deps).forEach(function(x){ rm(x); var w=W[x.id]; delete W[x.id]; if(w) w.rej(new Error("Đã bỏ thay đổi")); });
    save(); pump(); if(!mine().some(function(x){ return x.st==="fail"; })) OB.close();
  },
  open:function(){
    var p=document.getElementById("ob-pan"); if(!p){ p=document.createElement("div"); p.id="ob-pan"; document.body.appendChild(p); }
    p.innerHTML='<div class="hd"><b>Thay đổi chưa lưu xuống máy chủ</b><span>Trên app vẫn hiện đúng như bạn vừa thao tác. Bấm <b>Thử lại</b> sau khi kiểm tra; <b>Bỏ</b> để huỷ thay đổi đó.</span></div>'
      +'<div class="bd">'+mine().map(function(o){
        return '<div class="it"><b>'+esc(name(o))+'</b><small>'+new Date(o.t).toLocaleString()+(o.src?' · '+esc(o.src):'')+'</small>'
          +(o.st==="fail"?'<div class="er">'+esc(o.err)+'</div><div class="ac"><button class="pri" onclick="APP_OUTBOX.retry(\''+o.id+'\')">↻ Thử lại</button><button onclick="APP_OUTBOX.drop(\''+o.id+'\')">Bỏ</button></div>'
            :'<div class="st">'+(o.st==="run"?"Đang gửi…":"Chờ gửi"+(o.why?" · "+esc(o.why):""))+'</div>')+'</div>';
      }).join("")+'</div><div class="ft"><button onclick="APP_OUTBOX.close()">Đóng</button><button class="pri" onclick="APP_OUTBOX.retry()">↻ Thử lại tất cả</button></div>';
    p.classList.add("show");
  },
  close:function(){ var p=document.getElementById("ob-pan"); if(p) p.classList.remove("show"); }
};
/* CSS mặc định (dùng biến theme nếu có) */
(function(){ var s=document.createElement("style"); s.id="ob-css"; s.textContent=
 "#ob-chip{position:fixed;right:96px;bottom:18px;z-index:750;display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:20px;font-family:inherit;font-weight:700;font-size:12.5px;line-height:1.2;color:#fff;background:var(--t-ink,#1F3347);box-shadow:0 6px 18px rgba(20,35,50,.18);opacity:0;transform:translateY(12px);transition:.2s;pointer-events:none}"
+"#ob-chip.show{opacity:1;transform:none}#ob-chip.ok{background:#2F7A5A}#ob-chip.retry{background:#8A6514;pointer-events:auto;cursor:pointer}#ob-chip.off{background:#4A5D70;pointer-events:auto;cursor:pointer}#ob-chip.fail{background:#A8433F;pointer-events:auto;cursor:pointer}"
+"#ob-chip i{width:11px;height:11px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:obspin .7s linear infinite}@keyframes obspin{to{transform:rotate(360deg)}}"
+"#ob-pan{position:fixed;right:16px;bottom:96px;z-index:9100;width:min(420px,calc(100vw - 24px));max-height:min(70vh,560px);display:none;flex-direction:column;background:#fff;border:1px solid #E6EAEF;border-radius:14px;box-shadow:0 14px 36px rgba(20,35,50,.16);overflow:hidden;color:#1F3347}"
+"#ob-pan.show{display:flex}#ob-pan .hd{padding:13px 16px 10px;border-bottom:1px solid #EEF1F4}#ob-pan .hd>b{display:block;font-size:14.5px}#ob-pan .hd>span{display:block;font-size:12px;color:#6B7B8C;margin-top:3px;line-height:1.45}"
+"#ob-pan .bd{overflow:auto;padding:8px 10px}#ob-pan .it{border:1px solid #EEF1F4;border-radius:10px;padding:9px 11px;margin:6px 0}#ob-pan .it b{display:block;font-size:13px}#ob-pan .it small{display:block;font-size:11.5px;color:#7A8999;margin-top:2px}"
+"#ob-pan .er{font-size:12px;color:#A8433F;margin-top:4px}#ob-pan .st{font-size:11.5px;font-weight:700;color:#8A6514}#ob-pan .ac{display:flex;gap:6px;margin-top:7px}"
+"#ob-pan button{font-family:inherit;font-weight:700;font-size:12px;border-radius:8px;padding:5px 10px;cursor:pointer;border:1px solid #DDE3EA;background:#fff;color:#4A5D70}#ob-pan button.pri{background:var(--t-pri,#3A5CAA);border-color:var(--t-pri,#3A5CAA);color:#fff}"
+"#ob-pan .ft{display:flex;gap:8px;justify-content:flex-end;padding:10px 14px;border-top:1px solid #EEF1F4}";
 (document.head||document.documentElement).appendChild(s); })();
/* vòng đời trang */
document.addEventListener("visibilitychange",function(){ if(document.hidden) save(GONE); else pump(); });
window.addEventListener("pagehide",function(){ GONE=true; save(true); });          /* nhả lease ⇒ trang mở lại nhận việc ngay */
window.addEventListener("pageshow",function(){ GONE=false; });
window.addEventListener("beforeunload",function(e){ save(true);
  if(mine().some(function(o){ return o.st!=="fail"; })){ e.preventDefault(); e.returnValue="Còn thay đổi đang lưu — lần mở sau app sẽ tự gửi tiếp."; return e.returnValue; } });
window.addEventListener("online",pump); window.addEventListener("offline",paint);
window.addEventListener("storage",function(e){ if(e.key===C.key){ load(); pump(); } });
setInterval(function(){ if(GONE) return; if(Q.some(function(o){ return o.tab===TAB; })) save(); load(); if(Q.length) pump(); }, 5000);
})();
