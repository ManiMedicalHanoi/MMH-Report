/* ══════ THÔNG BÁO TỪ APP KHÁC (RHN) — GIỐNG HỆT ở MMH-Report và MMH-CRM (sửa 1 nơi ⇒ chép sang nơi kia) ══════
   Hộp thông báo chung: sheet RH_Notify (Training Master). App "Sự kiện MKT" ghi khi bạn được @nhắc tên (bình luận, biên bản họp),
   được giao việc, có việc chờ bạn duyệt / bị trả lại, được nhắc việc. Đọc qua Training Hub: rhNotifyList / rhNotifySeen (RH_Notify.gs).
   Cấu hình trước khi nạp file: window.RHN_CFG = { url, key, actor:fn→PIC, mount:fn(btn), lang:fn→"vi"|"en", busy:fn→bool }.
   Bấm 1 thông báo ⇒ mở đúng việc / biên bản / thảo luận ở app nguồn (tab mới) + đánh dấu đã xem. */
(function(){
  "use strict";
  var C = window.RHN_CFG || {}, R = window.RHN = { items: [], unseen: 0, loaded: false };
  var en = function(){ try { return (C.lang && C.lang()) === "en"; } catch(e){ return false; } };
  var T = function(vi, e){ return en() ? e : vi; };
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]; }); };
  var me = function(){ try { return (C.actor && C.actor()) || ""; } catch(e){ return ""; } };
  var tk = function(){ try { var o = JSON.parse(localStorage.getItem("mmh_tk") || "null"); return o && o.tk && (!o.exp || Date.now() < o.exp) ? o.tk : ""; } catch(e){ return ""; } };
  var ago = function(s){ var t = new Date(String(s || "").replace(" ", "T")); if (isNaN(t)) return ""; var m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return T("vừa xong", "just now"); if (m < 60) return m + T(" phút trước", " min ago"); var h = Math.round(m / 60); if (h < 24) return h + T(" giờ trước", " h ago");
    var d = Math.round(h / 24); return d + T(" ngày trước", " d ago"); };
  var KIND = { mention: ["Nhắc tên bạn", "Mentioned you"], note: ["Biên bản họp", "Meeting note"], assign: ["Giao việc", "Assigned"], review: ["Chờ bạn duyệt", "Needs your review"],
    "return": ["Cần chỉnh sửa", "Changes requested"], comment: ["Bình luận", "Comment"], remind: ["Nhắc việc", "Reminder"], team: ["Sự kiện mới", "New event"] };
  var APP = { event: ["Sự kiện MKT", "MKT Events"] };
  function call(action, params){
    return new Promise(function(res, rej){
      if (!C.url) return rej(new Error("RHN_CFG.url?"));
      var cb = "__rhn" + Date.now() + Math.floor(Math.random() * 1e4), sc = document.createElement("script");
      var q = Object.assign({ action: action, rhKey: C.key || "", actor: me(), callback: cb }, tk() ? { tk: tk() } : {}, params || {});
      var t = setTimeout(function(){ done(); rej(new Error("timeout")); }, 30000);
      function done(){ clearTimeout(t); try { delete window[cb]; } catch(e){ window[cb] = undefined; } if (sc.parentNode) sc.parentNode.removeChild(sc); }
      window[cb] = function(d){ done(); if (d && d.ok === false) rej(new Error(d.error || "error")); else res(d || {}); };
      sc.onerror = function(){ done(); rej(new Error("network")); };
      sc.src = C.url + "?" + Object.keys(q).map(function(k){ return encodeURIComponent(k) + "=" + encodeURIComponent(q[k]); }).join("&");
      document.body.appendChild(sc);
    });
  }
  var css = document.createElement("style"); css.id = "rhn-css";
  css.textContent = "#rhn-btn{position:relative}#rhn-btn .rhn-n{position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#B83A2E;color:#fff;font:600 10.5px/17px Aptos,Arial,sans-serif;text-align:center}" +
    "#rhn-pop{position:fixed;z-index:9990;width:min(400px,94vw);max-height:min(560px,80vh);display:flex;flex-direction:column;background:#fff;border:1px solid #DDE3E9;border-radius:12px;box-shadow:0 18px 40px rgba(13,36,49,.2);font-family:Aptos,'Segoe UI',Arial,sans-serif;color:#0D2431}" +
    "#rhn-pop .rh{display:flex;align-items:center;gap:8px;padding:12px 14px 8px}#rhn-pop .rh b{font-size:15px;flex:1}#rhn-pop .rh button{border:0;background:none;color:#3A5CAA;font-size:12.5px;cursor:pointer;padding:4px 6px;border-radius:6px}#rhn-pop .rh button:hover{background:#EEF2F8}" +
    "#rhn-pop ul{list-style:none;margin:0;padding:0 6px 8px;overflow:auto}#rhn-pop li{display:grid;grid-template-columns:8px minmax(0,1fr);gap:10px;padding:9px 8px;border-radius:8px;cursor:pointer}#rhn-pop li:hover{background:#F2F5F8}" +
    "#rhn-pop li i{width:8px;height:8px;border-radius:50%;margin-top:6px;background:transparent}#rhn-pop li.new i{background:#3A5CAA}#rhn-pop li .k{font-size:11.5px;color:#7B8C98}#rhn-pop li .t{font-size:13.5px;font-weight:600;line-height:1.35;margin:1px 0 2px}" +
    "#rhn-pop li .x{font-size:12.5px;color:#4B5E6B;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-line}#rhn-pop .em{padding:22px 16px;font-size:13.5px;color:#4B5E6B;text-align:center}" +
    "#rhn-toast{position:fixed;right:18px;bottom:18px;z-index:9985;max-width:340px;background:#fff;border:1px solid #DDE3E9;border-left:3px solid #3A5CAA;border-radius:10px;box-shadow:0 12px 30px rgba(13,36,49,.18);padding:11px 14px;font:13.5px/1.45 Aptos,Arial,sans-serif;color:#0D2431;display:flex;gap:10px;align-items:center}" +
    "#rhn-toast button{border:0;background:#3A5CAA;color:#fff;border-radius:7px;padding:5px 11px;font:600 12.5px Aptos,Arial,sans-serif;cursor:pointer}#rhn-toast .c{background:none;color:#7B8C98;padding:2px 4px}" +
    "@media (prefers-color-scheme:dark){html[data-rhn-dark] #rhn-pop,html[data-rhn-dark] #rhn-toast{background:#0F212D;color:#E6EDF1;border-color:#1E3747}}";
  document.head.appendChild(css);
  var btn = null;
  function paintBtn(){
    if (!btn){
      btn = document.createElement("button"); btn.type = "button"; btn.id = "rhn-btn"; btn.title = T("Thông báo từ app khác (Sự kiện MKT)", "Notifications from other apps (MKT Events)");
      btn.setAttribute("aria-label", T("Thông báo", "Notifications"));
      btn.addEventListener("click", function(ev){ ev.stopPropagation(); toggle(); });
      try { if (C.mount) C.mount(btn); } catch(e){}
      if (!btn.isConnected) return;
    }
    var n = btn.querySelector(".rhn-n"); if (n) n.remove();
    if (R.unseen){ n = document.createElement("span"); n.className = "rhn-n"; n.textContent = R.unseen > 99 ? "99+" : R.unseen; btn.appendChild(n); }
  }
  function load(){
    if (!me()) return Promise.resolve();
    return call("rhNotifyList", {}).then(function(d){
      var first = !R.loaded; R.items = d.items || []; R.unseen = d.unseen || 0; R.loaded = true; paintBtn();
      if (first && R.unseen) toastNew();
      if (document.getElementById("rhn-pop")) draw();
    }).catch(function(){ R.loaded = true; });
  }
  function toastNew(){
    try { if (sessionStorage.getItem("rhn_toast")) return; sessionStorage.setItem("rhn_toast", "1"); } catch(e){}
    var go = function(){ if (C.busy && C.busy()) return setTimeout(go, 1500);
      var t = document.createElement("div"); t.id = "rhn-toast"; t.setAttribute("role", "status");
      t.innerHTML = "<span>" + T("Bạn có <b>" + R.unseen + "</b> thông báo mới từ <b>Sự kiện MKT</b>", "You have <b>" + R.unseen + "</b> new notification" + (R.unseen > 1 ? "s" : "") + " from <b>MKT Events</b>") + '</span><button type="button" class="o">' + T("Xem", "View") + '</button><button type="button" class="c" aria-label="' + T("Đóng", "Close") + '">✕</button>';
      document.body.appendChild(t);
      t.querySelector(".o").onclick = function(){ t.remove(); open(); }; t.querySelector(".c").onclick = function(){ t.remove(); };
      setTimeout(function(){ if (t.isConnected) t.remove(); }, 12000); };
    setTimeout(go, 2500);
  }
  function draw(){
    var p = document.getElementById("rhn-pop"); if (!p) return;
    p.innerHTML = '<div class="rh"><b>' + T("Thông báo", "Notifications") + "</b>" + (R.unseen ? '<button type="button" data-all="1">' + T("Đánh dấu đã đọc", "Mark all read") + "</button>" : "") + "</div>" +
      (R.items.length ? "<ul>" + R.items.map(function(x){ var k = String(x.kind || "").split(",")[0], kl = KIND[k] || ["Thông báo", "Notice"], al = APP[x.app] || [x.app, x.app];
        return '<li class="' + (x.seen ? "" : "new") + '" data-id="' + esc(x.id) + '" data-url="' + esc(x.url) + '"><i></i><div style="min-width:0"><div class="k">' + esc(T(al[0], al[1])) + " · " + esc(T(kl[0], kl[1])) + " · " + esc(ago(x.at)) + '</div><div class="t">' + esc(x.title) + "</div>" + (x.text ? '<div class="x">' + esc(x.text) + "</div>" : "") + "</div></li>"; }).join("") + "</ul>"
        : '<div class="em">' + T("Chưa có thông báo. Khi ai đó @nhắc tên bạn hoặc giao việc cho bạn ở app Sự kiện MKT, thông báo hiện ở đây.", "No notifications yet. When someone @mentions you or assigns you a task in MKT Events, it appears here.") + "</div>");
    var a = p.querySelector("[data-all]"); if (a) a.onclick = function(ev){ ev.stopPropagation(); seen(null); };
    Array.prototype.forEach.call(p.querySelectorAll("li[data-id]"), function(li){ li.onclick = function(){ seen([li.dataset.id]); if (li.dataset.url) window.open(li.dataset.url, "_blank", "noopener"); close(); }; });
  }
  function place(){
    var p = document.getElementById("rhn-pop"); if (!p || !btn) return; var r = btn.getBoundingClientRect();
    if (!r.width){ p.style.right = "12px"; p.style.top = "60px"; p.style.left = "auto"; return; }
    p.style.top = Math.min(r.bottom + 6, window.innerHeight - 120) + "px"; p.style.left = Math.max(8, Math.min(r.right - p.offsetWidth, window.innerWidth - p.offsetWidth - 8)) + "px";
  }
  function open(){ var p = document.getElementById("rhn-pop"); if (!p){ p = document.createElement("div"); p.id = "rhn-pop"; p.setAttribute("role", "dialog"); p.setAttribute("aria-label", T("Thông báo", "Notifications")); document.body.appendChild(p); p.addEventListener("click", function(ev){ ev.stopPropagation(); }); }
    draw(); place(); load(); }
  function close(){ var p = document.getElementById("rhn-pop"); if (p) p.remove(); }
  function toggle(){ if (document.getElementById("rhn-pop")) close(); else open(); }
  function seen(ids){
    var L = ids ? R.items.filter(function(x){ return ids.indexOf(x.id) >= 0 && !x.seen; }) : R.items.filter(function(x){ return !x.seen; });
    if (!L.length) return; L.forEach(function(x){ x.seen = true; }); R.unseen = R.items.filter(function(x){ return !x.seen; }).length; paintBtn(); draw();
    call("rhNotifySeen", ids ? { ids: L.map(function(x){ return x.id; }).join(",") } : { all: 1 }).catch(function(){});
  }
  document.addEventListener("click", function(){ close(); });
  document.addEventListener("keydown", function(ev){ if (ev.key === "Escape") close(); });
  window.addEventListener("resize", place);
  R.load = load; R.open = open; R.close = close;
  (function start(){ if (!me()) return setTimeout(start, 1500); paintBtn(); load(); setInterval(function(){ if (document.visibilityState === "visible") load(); }, 300000); })();
})();
