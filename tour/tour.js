/* ════════════════════════════════════════════════════════════════════════════════════════
   MMH TOUR v1.0 (11/10/2026) — HƯỚNG DẪN TỪNG BƯỚC TRONG APP · GIỐNG HỆT NHAU ở MMH-Report và MMH-CRM
   · TOUR.open()      : danh mục bài hướng dẫn theo chức năng (tìm kiếm, nhãn Mới / Cập nhật, Đã xem)
   · TOUR.run(id)     : chạy tour — làm tối màn hình, PHÓNG TO vào đúng chỗ cần xem, thẻ chỉ dẫn, Tiếp / Quay lại
   · Bài hướng dẫn    : file tour/tours.js của từng app — TOUR.add([{ id, v, d, g, t, x, when, steps:[…] }])
       id  mã cố định · v số phiên bản bài (tăng mỗi khi sửa bước) · d ngày sửa YYYY-MM-DD (≤ 14 ngày ⇒ nhãn "Cập nhật")
       g   nhóm · t tiêu đề · x mô tả ngắn · when() bài chỉ hiện với ai (vd. Giám đốc) · app tự lọc
       steps: [{ el: "selector" | function(){ return element },  t: tiêu đề,  x: nội dung (HTML đơn giản),
                 do: function(){ … } (chạy trước bước — mở tab, mở hộp thoại),  wait: ms chờ thêm,
                 zoom: false (không phóng to), pad: số px viền sáng }]
       chữ: "chuỗi" hoặc { vi:"…", en:"…" } (CRM nhóm Thái = tiếng Anh)
   · Cấu hình app     : window.TOUR_CFG = { app, lang(), mount(fn) ⇒ nút mở danh mục, before() dọn popup,
                         after() dọn sau tour, extra: { label, run } (vd. sổ tay cũ) }
   · Kiểm tra tự động : tools/tour_check.js chạy mọi bài với backend giả lập ⇒ báo bước nào không còn tìm thấy.
   Thẻ <dialog> (lớp trên cùng) ⇒ không bị ảnh hưởng khi phóng to trang; phóng to = transform trên <body>.
   ════════════════════════════════════════════════════════════════════════════════════════ */
(function(){
"use strict";
if(window.TOUR && window.TOUR.__v) return;
var CFG=window.TOUR_CFG||{}, LIST=[], LS="mmh_tour_seen", RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function L(o){ if(o==null) return ""; if(typeof o==="string") return o; var en=false; try{ en=!!(CFG.lang&&CFG.lang()==="en"); }catch(_){} return (en&&o.en)||o.vi||o.en||""; }
function EN(){ try{ return !!(CFG.lang&&CFG.lang()==="en"); }catch(_){ return false; } }
function T(vi,en){ return EN()?en:vi; }
function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function noAcc(s){ return String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/gi,"d").toLowerCase(); }
function seen(){ try{ return JSON.parse(localStorage.getItem(LS)||"{}")||{}; }catch(_){ return {}; } }
function mark(id,v){ var s=seen(); s[id]=v; try{ localStorage.setItem(LS,JSON.stringify(s)); }catch(_){} badge(); }
function ok(t){ try{ return !t.when || !!t.when(); }catch(_){ return false; } }
function fresh(t){ if(!t.d) return false; var d=new Date(t.d+"T00:00:00"); return (Date.now()-d.getTime())<14*864e5; }
function state(t){ var s=seen()[t.id]; if(s==null) return fresh(t)?"new":""; return s<(t.v||1)?"upd":"done"; }

/* ── giao diện ── */
var CSS='\
.tr-dlg{border:0;padding:0;background:transparent;max-width:none;max-height:none;width:100vw;height:100vh;overflow:hidden;color:#0E2433;font-family:inherit}\
.tr-dlg::backdrop{background:transparent}\
.tr-cat::backdrop{background:rgba(0,24,38,.45);backdrop-filter:blur(3px)}\
.tr-cat{width:min(760px,calc(100vw - 32px));height:auto;max-height:calc(100vh - 48px);margin:auto;border-radius:18px;background:var(--tr-card);border:1px solid var(--tr-line);overflow:auto;color:var(--tr-ink);box-shadow:0 18px 50px rgba(0,30,50,.25)}\
.tr-dlg,.tr-cat{--tr-pri:var(--t-pri,var(--blue,#3A5CAA));--tr-ink:#0E2433;--tr-head:var(--t-ink,#003047);--tr-mut:#5B6B7D;--tr-line:#E2E8EF;--tr-card:#fff;--tr-soft:var(--t-soft,#F0F7FF);--tr-fld:#C3CDD8}\
.tr-ch{display:flex;align-items:center;gap:12px;padding:18px 20px 12px;position:sticky;top:0;background:var(--tr-card);z-index:2}\
.tr-ch h3{margin:0;flex:1;font-size:19px;color:var(--tr-head)}\
.tr-x{width:36px;height:36px;border-radius:10px;border:1px solid var(--tr-line);background:var(--tr-card);cursor:pointer;font-size:18px;line-height:1;color:var(--tr-head)}\
.tr-q{margin:0 20px 6px;display:flex;gap:8px;align-items:center;height:42px;padding:0 12px;border:1px solid var(--tr-fld);border-radius:12px;background:var(--tr-card)}\
.tr-q input{flex:1;border:0;outline:0;background:none;font:inherit;font-size:15px;color:var(--tr-ink);min-width:0}\
.tr-q:focus-within{border-color:var(--tr-pri);box-shadow:0 0 0 3px rgba(58,92,170,.15)}\
.tr-body{padding:4px 20px 20px;display:flex;flex-direction:column;gap:6px}\
.tr-g{font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--tr-mut);margin:12px 2px 2px}\
.tr-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\
.tr-it{display:flex;gap:12px;align-items:flex-start;text-align:left;padding:13px 14px;border:1px solid var(--tr-line);border-radius:14px;background:var(--tr-card);cursor:pointer;font:inherit;color:var(--tr-ink);transition:border-color .15s,transform .15s}\
.tr-it:hover{border-color:var(--tr-pri);transform:translateY(-1px)}\
.tr-ic{width:36px;height:36px;border-radius:10px;flex:none;display:grid;place-items:center;background:var(--tr-soft);color:var(--tr-pri)}\
.tr-ic svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\
.tr-it b{display:block;font-size:14.5px;color:var(--tr-head);line-height:1.3}\
.tr-it span{display:block;font-size:12.5px;color:var(--tr-mut);margin-top:2px;line-height:1.4}\
.tr-it i{font-style:normal;font-size:11.5px;color:var(--tr-mut);display:block;margin-top:6px}\
.tr-it .tr-bd{display:inline-block;margin-top:0;font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:8px;margin-left:6px;vertical-align:2px}\
.tr-it .tr-bd.new{background:#FFF4B8;color:#6B5600}.tr-it .tr-bd.upd{background:#E3ECFB;color:#2E4C91}.tr-it .tr-bd.done{background:#E7F4EC;color:#1E6B4F}\
.tr-foot{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:12px 20px 18px;border-top:1px solid var(--tr-line);font-size:12.5px;color:var(--tr-mut)}\
.tr-foot button{border:1px solid var(--tr-line);background:var(--tr-card);border-radius:10px;height:34px;padding:0 12px;font:inherit;font-weight:600;cursor:pointer;color:var(--tr-head)}\
.tr-hole{position:fixed;border-radius:12px;box-shadow:0 0 0 4px rgba(255,225,0,.95),0 0 0 9999px rgba(0,22,36,.62);pointer-events:none;transition:all .55s cubic-bezier(.3,.7,.2,1)}\
.tr-hole.none{left:50%!important;top:50%!important;width:0!important;height:0!important;box-shadow:0 0 0 9999px rgba(0,22,36,.62)}\
.tr-card{position:fixed;width:min(360px,calc(100vw - 24px));background:var(--tr-card);border:1px solid var(--tr-line);border-radius:16px;padding:16px 16px 12px;box-shadow:0 14px 40px rgba(0,22,36,.32);transition:opacity .25s,transform .25s;color:var(--tr-ink)}\
.tr-card.hid{opacity:0;transform:translateY(6px)}\
.tr-k{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tr-pri);display:flex;justify-content:space-between;gap:8px}\
.tr-card h4{margin:6px 0 4px;font-size:16.5px;color:var(--tr-head);line-height:1.3}\
.tr-card p{margin:0;font-size:14px;line-height:1.55;color:var(--tr-ink)}\
.tr-card p b{color:var(--tr-head)}\
.tr-miss{margin-top:8px;font-size:12.5px;color:#8A6D1F;background:#FFF8E1;border:1px solid #F1E2B8;border-radius:9px;padding:6px 9px}\
.tr-dots{display:flex;gap:4px;margin:12px 0 10px;flex-wrap:wrap}\
.tr-dots i{width:16px;height:4px;border-radius:3px;background:var(--tr-line)}\
.tr-dots i.on{background:var(--tr-pri)}.tr-dots i.past{background:#9DB3E0}\
.tr-nav{display:flex;gap:8px;align-items:center}\
.tr-nav .sp{flex:1}\
.tr-nav button{height:36px;padding:0 14px;border-radius:10px;border:1px solid var(--tr-line);background:var(--tr-card);font:inherit;font-weight:600;font-size:13.5px;cursor:pointer;color:var(--tr-head)}\
.tr-nav button.pri{background:var(--tr-pri);border-color:var(--tr-pri);color:#fff}\
.tr-nav button.ln{border:0;background:none;color:var(--tr-mut);padding:0 4px}\
.tr-nav button:disabled{opacity:.4;cursor:default}\
.tr-b{position:relative}\
.tr-dot{position:absolute;top:-3px;right:-3px;width:10px;height:10px;border-radius:50%;background:#FFE100;border:2px solid #fff}\
@media (max-width:640px){ .tr-grid{grid-template-columns:1fr} .tr-card{left:12px!important;right:12px;width:auto;bottom:calc(12px + env(safe-area-inset-bottom,0px));top:auto!important} }\
@media (prefers-reduced-motion: reduce){ .tr-hole,.tr-card,.tr-it{transition:none} }';
function css(){ if(document.getElementById("tour-css")) return; var s=document.createElement("style"); s.id="tour-css"; s.textContent=CSS; document.head.appendChild(s); }
var ICON={ start:'<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>', task:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', trip:'<path d="M2.5 19h19"/><path d="M3.5 13.5l3 1 3.5-2.5L5 5.5l2-.8 7 5 4.3-1.9a2 2 0 011.6 3.7L7 16l-3.5-2.5z"/>',
  report:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>', kpi:'<path d="M3 20h18"/><path d="M6 16V10M11 16V6M16 16v-4M21 16V8"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>', photo:'<path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="4"/>',
  people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M21.5 20a6.5 6.5 0 00-4-6"/>', gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 014.9.8c0 1.7-2.4 2.2-2.4 3.7M12 17h.01"/>' };
function ico(k){ return '<svg viewBox="0 0 24 24">'+(ICON[k]||ICON.help)+'</svg>'; }

/* ── danh mục ── */
var CAT=null;
function open(){
  css(); close(); var d=document.createElement("dialog"); d.className="tr-cat"; d.id="tour-cat"; CAT=d;
  d.innerHTML='<div class="tr-ch"><h3>'+T("Hướng dẫn sử dụng","How-to guides")+'</h3><button class="tr-x" aria-label="'+T("Đóng","Close")+'">×</button></div>'
    +'<label class="tr-q">'+'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'
    +'<input id="tour-q" placeholder="'+T("Tìm hướng dẫn: thêm việc, công tác, KPI…","Search: add task, trip, KPI…")+'" autocomplete="off"></label><div class="tr-body" id="tour-body"></div>'
    +'<div class="tr-foot"><span style="flex:1">'+T("Chọn một mục, app sẽ dẫn bạn đi từng bước ngay trên màn hình.","Pick a guide — the app walks you through it step by step.")+'</span>'
    +(CFG.extra?'<button id="tour-extra">'+esc(L(CFG.extra.label))+'</button>':'')+'</div>';
  document.documentElement.appendChild(d);
  d.querySelector(".tr-x").onclick=close; d.addEventListener("cancel",function(e){ e.preventDefault(); close(); });
  d.addEventListener("click",function(e){ if(e.target===d) close(); });
  if(CFG.extra) d.querySelector("#tour-extra").onclick=function(){ close(); try{ CFG.extra.run(); }catch(_){} };
  var q=d.querySelector("#tour-q"); q.oninput=function(){ paintCat(q.value); };
  paintCat(""); try{ d.showModal(); }catch(_){ d.setAttribute("open",""); }
  setTimeout(function(){ try{ q.focus(); }catch(_){} },30);
}
function paintCat(q){
  var k=noAcc(q).trim(), list=LIST.filter(ok).filter(function(t){ return !k || noAcc(L(t.t)+" "+L(t.x)+" "+L(t.g)).indexOf(k)>=0; });
  var groups=[], by={};
  list.forEach(function(t){ var g=L(t.g)||T("Khác","Other"); if(!by[g]){ by[g]=[]; groups.push(g); } by[g].push(t); });
  var h=groups.map(function(g){ return '<div class="tr-g">'+esc(g)+'</div><div class="tr-grid">'+by[g].map(function(t){
    var st=state(t), bd=st==="new"?'<span class="tr-bd new">'+T("Mới","New")+'</span>':st==="upd"?'<span class="tr-bd upd">'+T("Cập nhật","Updated")+'</span>':st==="done"?'<span class="tr-bd done">'+T("Đã xem","Viewed")+'</span>':"";
    var n=(t.steps||[]).filter(ok).length;
    return '<button class="tr-it" data-tour="'+esc(t.id)+'"><span class="tr-ic">'+ico(t.ic)+'</span><span style="min-width:0;margin:0"><b>'+esc(L(t.t))+bd+'</b><span>'+esc(L(t.x))+'</span><i>'+n+' '+T("bước","steps")+' · ~'+Math.max(1,Math.round(n*12/60))+' '+T("phút","min")+'</i></span></button>'; }).join("")+'</div>'; }).join("");
  var b=CAT&&CAT.querySelector("#tour-body"); if(!b) return;
  b.innerHTML=h||'<div class="tr-g" style="text-transform:none;letter-spacing:0">'+T("Không có hướng dẫn khớp.","No matching guide.")+'</div>';
  [].forEach.call(b.querySelectorAll("[data-tour]"),function(x){ x.onclick=function(){ var id=x.getAttribute("data-tour"); close(); run(id); }; });
}
function close(){ if(CAT){ try{ CAT.close(); }catch(_){} CAT.remove(); CAT=null; } }

/* ── chạy tour ── */
var R=null;
function body(){ return document.body; }
function run(id, at){
  var t0=LIST.filter(function(x){ return x.id===id; })[0]; if(!t0) return false;
  var t={}; for(var k in t0) t[k]=t0[k]; t.steps=(t0.steps||[]).filter(ok);   /* bước có when() ⇒ chỉ hiện khi đúng (vd. nhóm có chụp ảnh) */
  css(); stop(true); window.__tourOn=true;   /* app xếp hàng popup tự động (Thư nhắc việc…) khi đang chạy tour */
  try{ if(CFG.before) CFG.before(t); }catch(_){}
  var d=document.createElement("dialog"); d.className="tr-dlg"; d.id="tour-run";
  d.innerHTML='<div class="tr-hole none" id="tr-hole"></div><div class="tr-card hid" id="tr-card" role="dialog" aria-live="polite"></div>';
  document.documentElement.appendChild(d);
  d.addEventListener("cancel",function(e){ e.preventDefault(); stop(); });
  d.addEventListener("keydown",function(e){ if(e.key==="ArrowRight"){ e.preventDefault(); next(1); } else if(e.key==="ArrowLeft"){ e.preventDefault(); next(-1); } });
  R={ t:t, i:at||0, d:d, s:1, tx:0, ty:0, sy:window.scrollY, tf:body().style.transform, to:body().style.transformOrigin, tt:body().style.transition, miss:[] };
  window.scrollTo(0,0);
  var b=body(); b.style.transformOrigin="0 0"; b.style.transition=RM?"none":"transform .6s cubic-bezier(.3,.7,.2,1)";
  try{ d.showModal(); }catch(_){ d.setAttribute("open",""); }
  window.addEventListener("resize",onResize);
  step(); return true;
}
function onResize(){ if(R) place(true); }
function find(sel){
  if(!sel) return null;
  if(typeof sel==="function"){ try{ return sel(); }catch(_){ return null; } }
  var all; try{ all=document.querySelectorAll(sel); }catch(_){ return null; }
  for(var i=0;i<all.length;i++){ var r=all[i].getBoundingClientRect(); if(r.width>0 && r.height>0 && !all[i].closest(".tr-dlg")) return all[i]; }
  return null;
}
function waitFor(sel, ms){ return new Promise(function(res){ var t0=Date.now(); (function poll(){ var e=find(sel); if(e || Date.now()-t0>ms) return res(e); setTimeout(poll,90); })(); }); }
var TOK=0;
function step(){
  if(!R) return; var st=R.t.steps[R.i], my=++TOK, card=R.d.querySelector("#tr-card");
  card.classList.add("hid");
  try{ if(st.do) st.do(); }catch(e){ try{ console.warn("tour do",e); }catch(_){} }
  setTimeout(function(){
    waitFor(st.el, st.el?2200:0).then(function(el){
      if(!R || my!==TOK) return;
      R.el=el; if(!el && st.el) R.miss.push(R.i);
      if(el){ try{ el.scrollIntoView({block:"nearest",inline:"nearest"}); }catch(_){} if(window.scrollY) window.scrollTo(0,0); }
      place(false); paint();
      setTimeout(function(){ if(R && my===TOK){ card.classList.remove("hid"); var b=card.querySelector(".pri"); if(b) try{ b.focus({preventScroll:true}); }catch(_){} } }, RM?0:420);
    });
  }, st.wait!=null?st.wait:(st.do?260:0));
}
/* phóng to: tính hình chữ nhật gốc (chưa biến đổi) từ hình đang thấy */
function place(quick){
  var st=R.t.steps[R.i], el=R.el, hole=R.d.querySelector("#tr-hole"), vw=window.innerWidth, vh=window.innerHeight, pad=st.pad!=null?st.pad:8;
  if(!el){ hole.className="tr-hole none"; setT(1,0,0); R.box=null; return; }
  /* đo khi trang chưa phóng to (tắt biến đổi trong chốc lát, cùng 1 khung hình ⇒ không nháy) */
  var bd=body(), pv=bd.style.transform; bd.style.transition="none"; bd.style.transform="";
  var r=el.getBoundingClientRect(), x=r.left, y=r.top, w=r.width, h=r.height;
  bd.style.transform=pv; void bd.offsetWidth; bd.style.transition=RM?"none":"transform .6s cubic-bezier(.3,.7,.2,1)";
  var fixed=false; for(var p=el;p&&p!==document.body;p=p.parentElement){ if(getComputedStyle(p).position==="fixed"){ fixed=true; break; } }
  var mob=vw<640, cx=mob?vw/2:vw/2, cy=mob?vh*.36:vh*.44;
  var s=1; if(st.zoom!==false && !RM){ s=Math.min(vw*(mob?.8:.5)/Math.max(w,1), vh*(mob?.34:.42)/Math.max(h,1), mob?1.45:1.75); s=Math.max(1,s); if(s<1.12) s=1; }
  var vis=x>=8 && y>=8 && x+w<=vw-8 && y+h<=vh-8, tx=0, ty=0;
  if(s>1 || !vis){ tx=cx-s*(x+w/2); ty=cy-s*(y+h/2); }
  if(fixed && s===1 && vis){ tx=0; ty=0; }
  /* không kéo mép trái / trên của trang vào giữa màn hình */
  tx=Math.min(tx,0); ty=Math.min(ty,0);
  var docW=Math.max(document.documentElement.scrollWidth,vw), docH=Math.max(document.documentElement.scrollHeight,vh);
  tx=Math.max(tx, vw-docW*s); ty=Math.max(ty, vh-docH*s);
  setT(s,tx,ty,quick);
  var bx={ l:tx+s*x-pad, t:ty+s*y-pad, w:s*w+pad*2, h:s*h+pad*2 }; R.box=bx;
  hole.className="tr-hole"; hole.style.left=bx.l+"px"; hole.style.top=bx.t+"px"; hole.style.width=bx.w+"px"; hole.style.height=bx.h+"px";
}
function setT(s,tx,ty,quick){
  R.s=s; R.tx=tx; R.ty=ty; var b=body();
  if(quick) b.style.transition="none";
  b.style.transform=(s===1&&!tx&&!ty)?"":"translate("+tx+"px,"+ty+"px) scale("+s+")";
  if(quick){ void b.offsetWidth; b.style.transition=RM?"none":"transform .6s cubic-bezier(.3,.7,.2,1)"; }
}
function paint(){
  var t=R.t, st=t.steps[R.i], n=t.steps.length, card=R.d.querySelector("#tr-card"), last=R.i===n-1;
  card.innerHTML='<div class="tr-k"><span>'+esc(L(t.t))+'</span><span>'+(R.i+1)+' / '+n+'</span></div><h4>'+esc(L(st.t))+'</h4><p>'+L(st.x)+'</p>'
    +(!R.el && st.el?'<div class="tr-miss">'+T("Mục này hiện chưa có trên màn hình của bạn (tuỳ quyền hoặc dữ liệu). Bấm Tiếp để xem bước sau.","This item is not on your screen right now (depends on your role or data). Click Next to continue.")+'</div>':'')
    +'<div class="tr-dots">'+t.steps.map(function(_,i){ return '<i class="'+(i===R.i?"on":i<R.i?"past":"")+'"></i>'; }).join("")+'</div>'
    +'<div class="tr-nav"><button class="ln" data-k="x">'+T("Thoát","Exit")+'</button><span class="sp"></span><button data-k="b"'+(R.i?"":" disabled")+'>'+T("Quay lại","Back")+'</button><button class="pri" data-k="n">'+(last?T("Xong","Done"):T("Tiếp","Next"))+'</button></div>';
  [].forEach.call(card.querySelectorAll("[data-k]"),function(b){ b.onclick=function(){ var k=b.getAttribute("data-k"); if(k==="x") stop(); else next(k==="n"?1:-1); }; });
  /* đặt thẻ chỉ dẫn cạnh vùng sáng */
  var vw=window.innerWidth, vh=window.innerHeight, cw=Math.min(360,vw-24), ch=card.offsetHeight||190, bx=R.box, L0, T0;
  if(vw<640){ card.style.left=""; card.style.top=""; return; }
  if(!bx){ L0=(vw-cw)/2; T0=(vh-ch)/2; }
  else if(bx.t+bx.h+14+ch<vh){ L0=bx.l+bx.w/2-cw/2; T0=bx.t+bx.h+14; }
  else if(bx.t-14-ch>0){ L0=bx.l+bx.w/2-cw/2; T0=bx.t-14-ch; }
  else if(bx.l+bx.w+14+cw<vw){ L0=bx.l+bx.w+14; T0=bx.t+bx.h/2-ch/2; }
  else if(bx.l-14-cw>0){ L0=bx.l-14-cw; T0=bx.t+bx.h/2-ch/2; }
  else { L0=vw-cw-16; T0=vh-ch-16; }
  card.style.left=Math.max(12,Math.min(vw-cw-12,L0))+"px"; card.style.top=Math.max(12,Math.min(vh-ch-12,T0))+"px";
}
function next(dir){
  if(!R) return; var n=R.t.steps.length, i=R.i+dir;
  if(i<0) return; if(i>=n){ mark(R.t.id,R.t.v||1); stop(); return; }
  R.i=i; step();
}
function stop(silent){
  if(!R) return; var r=R; R=null; TOK++; window.__tourOn=false;
  window.removeEventListener("resize",onResize);
  var b=body(); b.style.transition=r.tt||""; b.style.transform=r.tf||""; b.style.transformOrigin=r.to||"";
  try{ r.d.close(); }catch(_){} r.d.remove();
  if(!silent) try{ if(CFG.after) CFG.after(r.t); }catch(_){}
  try{ window.scrollTo(0,r.sy||0); }catch(_){}
  if(r.i>=1 && !silent) mark(r.t.id, Math.max(seen()[r.t.id]||0, r.i>=r.t.steps.length-1 ? (r.t.v||1) : (seen()[r.t.id]||0)));
}

/* ── nút mở danh mục + chấm vàng khi có bài mới / cập nhật ── */
function badge(){ var b=document.querySelector("[data-tour-btn]"); if(!b) return; var any=LIST.filter(ok).some(function(t){ var s=state(t); return s==="upd" || s==="new"; });
  var d=b.querySelector(".tr-dot"); if(any && !d){ d=document.createElement("i"); d.className="tr-dot"; b.appendChild(d); } else if(!any && d) d.remove(); }
function mount(){
  if(document.querySelector("[data-tour-btn]") || !CFG.mount) return !!document.querySelector("[data-tour-btn]");
  var b=null; try{ b=CFG.mount(open); }catch(_){ b=null; } if(!b) return false;
  if(!b.id) b.id="tour-btn"; b.setAttribute("data-tour-btn","1"); b.classList.add("tr-b"); badge(); return true;
}
function add(arr){ (arr||[]).forEach(function(t){ LIST=LIST.filter(function(x){ return x.id!==t.id; }); LIST.push(t); }); badge(); }
var tries=0; (function go(){ css(); if(mount()) return; if(++tries<80) setTimeout(go,1500); })();
window.TOUR={ __v:"1.0", add:add, open:open, run:run, stop:stop, list:function(){ return LIST.slice(); }, find:find, cfg:CFG,
  /* cho bộ kiểm tra tự động: chạy hết bài, trả về các bước không tìm thấy */
  check:function(id){ return new Promise(function(res){ if(!run(id)) return res({id:id,error:"not found"}); var t=R.t;
    (function adv(){ if(!R){ return res({id:id,steps:t.steps.length,miss:last}); } var cur=R.i; setTimeout(function(){ if(!R) return res({id:id,steps:t.steps.length,miss:last}); last=R.miss.slice(); if(R.i===t.steps.length-1){ var m=R.miss.slice(); stop(true); return res({id:id,steps:t.steps.length,miss:m}); } next(1); adv(); }, 2600); })(); var last=[]; }); } };
})();
