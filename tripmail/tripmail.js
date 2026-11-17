/* ═══════════ tripmail.js v1.0 (17/11/2026) — GIỐNG HỆT ở MMH-Report và MMH-CRM (sửa 1 nơi chép sang nơi kia) ═══════════
   Báo cáo công tác: người báo cáo TỰ GỬI email từ hộp thư của mình (người dùng yêu cầu 17/11/2026), không gửi từ email hệ thống.
   Backend (mmh-backend ▸ ReportHub_Trip_Mail.gs v13.0): tripReport mailMode=self ⇒ lưu báo cáo + trả `mail` {to, cc, subject, html};
   tripInfo mail=1 ⇒ `trip.mail` dựng từ báo cáo đã lưu; tripReportSent ⇒ ghi nhật ký "đã tự gửi" (system=1 ⇒ hệ thống gửi thay).
   Cấu hình: window.TRIPMAIL_CFG = { call:function(body){ return Promise }, email:function(){ return "email đăng nhập" } }.
   Đã gửi lưu trên máy: localStorage mmh_tripmail_sent:<id chuyến> = { at, to }.                                              */
(function(){
  if(window.TRIPMAIL) return;
  var LS="mmh_tripmail_sent:";
  function cfg(){ return window.TRIPMAIL_CFG||{}; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function $(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof window.toast==="function") return window.toast(m); }catch(_){} }
  function sentOf(id){ try{ return JSON.parse(localStorage.getItem(LS+id)||"null"); }catch(_){ return null; } }
  function setSent(id, o){ try{ localStorage.setItem(LS+id, JSON.stringify(o)); }catch(_){} }
  function me(){ try{ return String((cfg().email&&cfg().email())||""); }catch(_){ return ""; } }
  function kind(){ var e=me(); return /@manimedicalhanoi\.com$/i.test(e)?"gmail":/@mani\.inc$/i.test(e)?"outlook":"outlook"; }
  function links(m){
    var e=encodeURIComponent, to=m.to||[], cc=m.cc||[], sub=m.subject||"";
    return { outlook:"https://outlook.office.com/mail/deeplink/compose?to="+e(to.join(";"))+(cc.length?"&cc="+e(cc.join(";")):"")+"&subject="+e(sub),
             gmail:"https://mail.google.com/mail/?view=cm&fs=1"+(/@manimedicalhanoi\.com$/i.test(me())?"&authuser="+e(me()):"")+"&to="+e(to.join(","))+(cc.length?"&cc="+e(cc.join(",")):"")+"&su="+e(sub),
             app:"mailto:"+to.map(e).join(",")+"?"+(cc.length?"cc="+cc.map(e).join(",")+"&":"")+"subject="+e(sub) };
  }
  function bodyOf(html){ var m=/<body[^>]*>([\s\S]*)<\/body>/i.exec(String(html||"")); return m?m[1]:String(html||""); }
  function copyHtml(html){
    var d=document.createElement("div"); d.innerHTML=html; var text=d.innerText||d.textContent||"";
    function fb(){ d.contentEditable="true"; d.style.cssText="position:fixed;left:-9999px;top:0"; document.body.appendChild(d);
      var r=document.createRange(); r.selectNodeContents(d); var s=getSelection(); s.removeAllRanges(); s.addRange(r); var k=false; try{ k=document.execCommand("copy"); }catch(_){} s.removeAllRanges(); d.remove(); return k; }
    try{ if(window.ClipboardItem&&navigator.clipboard&&navigator.clipboard.write)
      return navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([html],{type:"text/html"}),"text/plain":new Blob([text],{type:"text/plain"})})]).then(function(){ return true; }, fb); }catch(_){}
    return Promise.resolve(fb());
  }
  function copyText(t){
    try{ if(navigator.clipboard&&navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function(){ return true; }, function(){ return false; }); }catch(_){}
    var x=document.createElement("textarea"); x.value=t; x.style.cssText="position:fixed;opacity:0"; document.body.appendChild(x); x.select(); var k=false; try{ k=document.execCommand("copy"); }catch(_){} x.remove(); return Promise.resolve(k);
  }
  function css(){
    if($("tpm-css")) return;
    var s=document.createElement("style"); s.id="tpm-css";
    s.textContent=[
      "#tpm-ov{position:fixed;inset:0;z-index:100060;background:rgba(15,30,45,.35);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Aptos,'Segoe UI',system-ui,sans-serif}",
      "#tpm-ov .tpm-box{background:#fff;border:1px solid #E6EAEF;border-radius:12px;width:min(760px,100%);max-height:calc(100vh - 32px);display:flex;flex-direction:column;color:#1d2b36}",
      "#tpm-ov .tpm-h{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #E6EAEF}",
      "#tpm-ov .tpm-h b{font-size:16px;color:var(--t-ink,#003047);flex:1}",
      "#tpm-ov .tpm-x{border:0;background:none;font-size:20px;cursor:pointer;color:#6b7785;line-height:1}",
      "#tpm-ov .tpm-b{padding:14px 18px;overflow:auto;display:flex;flex-direction:column;gap:10px}",
      "#tpm-ov .tpm-lead{font-size:13.5px;line-height:1.5}",
      "#tpm-ov .tpm-r{display:grid;grid-template-columns:62px 1fr auto;gap:8px;align-items:start;font-size:13px}",
      "#tpm-ov .tpm-r>span{color:#6b7785;padding-top:5px}",
      "#tpm-ov .tpm-r>div{background:#F5F7FA;border:1px solid #E6EAEF;border-radius:8px;padding:5px 9px;word-break:break-all;min-height:18px}",
      "#tpm-ov .tpm-c{border:1px solid #C3CDD8;background:#fff;border-radius:8px;padding:4px 9px;font-size:12px;cursor:pointer}",
      "#tpm-ov iframe{width:100%;height:300px;border:1px solid #E6EAEF;border-radius:8px;background:#fff}",
      "#tpm-ov .tpm-steps{font-size:13px;line-height:1.55;background:var(--t-soft,#F0F7FF);border:1px solid var(--t-line,#CFE2F3);border-radius:8px;padding:8px 12px}",
      "#tpm-ov .tpm-f{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 18px;border-top:1px solid #E6EAEF}",
      "#tpm-ov .tpm-btn{display:inline-flex;align-items:center;border:1px solid #C3CDD8;background:#fff;color:#1d2b36;border-radius:9px;padding:8px 14px;font-size:13.5px;font-weight:600;cursor:pointer;text-decoration:none;font-family:inherit}",
      "#tpm-ov .tpm-btn.pri{background:var(--t-pri,#3A5CAA);border-color:var(--t-pri,#3A5CAA);color:#fff}",
      "#tpm-ov .tpm-btn.ok{border-color:#2E7D32;color:#2E7D32}",
      "#tpm-ov .tpm-sp{flex:1}",
      "#tpm-ov .tpm-lnk{border:0;background:none;color:#6b7785;font-size:12.5px;text-decoration:underline;cursor:pointer;padding:4px;font-family:inherit}",
      "#tpm-ov .tpm-ask{width:100%;font-size:13px;background:#FFF8E1;border:1px solid #F3D27A;border-radius:8px;padding:8px 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
      "#tpm-ov .tpm-msg{font-size:12.5px;color:#2E7D32}",
      ".tpm-bar{margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:13px;border:1px solid var(--t-line,#CFE2F3);background:var(--t-soft,#F0F7FF);border-radius:10px;padding:8px 12px}",
      ".tpm-bar.done{border-color:#CDE7CF;background:#F3FAF3}",
      ".tpm-bar button{border:1px solid var(--t-pri,#3A5CAA);background:#fff;color:var(--t-pri,#3A5CAA);border-radius:8px;padding:5px 12px;font-weight:600;cursor:pointer;font-family:inherit;font-size:13px}",
      "@media(max-width:720px){#tpm-ov{padding:0;align-items:flex-end}#tpm-ov .tpm-box{border-radius:14px 14px 0 0;max-height:92vh}#tpm-ov iframe{height:220px}#tpm-ov .tpm-r{grid-template-columns:52px 1fr auto}}"
    ].join("\n");
    document.head.appendChild(s);
  }
  function close(){ var o=$("tpm-ov"); if(o) o.remove(); document.removeEventListener("keydown", onKey, true); }
  function onKey(e){ if(e.key==="Escape"){ e.stopPropagation(); close(); } }
  /* mở khung gửi email: m = { to[], cc[], subject, html }, trip = { id, row, dest } */
  function open(m, trip, opt){
    if(!m||!(m.to||[]).length){ toast("Không xác định được người nhận email báo cáo."); return; }
    opt=opt||{}; css(); close();
    var html=bodyOf(m.html), L=links(m), pref=kind(), id=(trip&&trip.id)||"", s=sentOf(id);
    var a=function(k,t){ return '<a class="tpm-btn'+(k===pref?' pri':'')+'" data-k="'+k+'" target="_blank" rel="noopener" href="'+esc(L[k])+'">'+t+'</a>'; };
    var o=document.createElement("div"); o.id="tpm-ov";
    o.innerHTML='<div class="tpm-box" role="dialog" aria-label="Gửi email báo cáo công tác"><div class="tpm-h"><b>Gửi email báo cáo công tác</b><button class="tpm-x" data-a="x" title="Đóng">×</button></div>'
      +'<div class="tpm-b">'
      +'<div class="tpm-lead">'+(opt.saved?'Đã lưu báo cáo. ':'')+'Email báo cáo gửi <b>từ hộp thư của bạn</b> tới Giám đốc và các cấp quản lý liên quan.'
        +(s?' <span class="tpm-msg">Bạn đã bấm Đã gửi lúc '+esc(s.at)+'.</span>':'')+'</div>'
      +'<div class="tpm-r"><span>To</span><div>'+esc((m.to||[]).join("; "))+'</div><button class="tpm-c" data-c="to">Sao chép</button></div>'
      +'<div class="tpm-r"><span>CC</span><div>'+(esc((m.cc||[]).join("; "))||'<i>—</i>')+'</div><button class="tpm-c" data-c="cc">Sao chép</button></div>'
      +'<div class="tpm-r"><span>Tiêu đề</span><div>'+esc(m.subject)+'</div><button class="tpm-c" data-c="sub">Sao chép</button></div>'
      +'<div class="tpm-steps">1. Bấm <b>Outlook</b>, <b>Gmail</b> hoặc <b>Ứng dụng mail</b> — người nhận, tiêu đề điền sẵn, nội dung tự sao chép.<br>2. Dán (Ctrl+V) vào thân email rồi bấm Gửi trong hộp thư.<br>3. Quay lại đây bấm <b>Đã gửi</b>.</div>'
      +'<iframe sandbox="" title="Nội dung email"></iframe>'
      +'</div><div class="tpm-f" id="tpm-f">'+a("outlook","Outlook")+a("gmail","Gmail")+a("app","Ứng dụng mail")
      +'<button class="tpm-btn" data-a="copy">Sao chép nội dung</button><span class="tpm-sp"></span>'
      +'<button class="tpm-btn ok" data-a="done">Đã gửi</button>'
      +'<button class="tpm-lnk" data-a="sys">Không mở được hộp thư?</button><button class="tpm-lnk" data-a="x">Để sau</button></div></div>';
    document.body.appendChild(o);
    o.querySelector("iframe").srcdoc='<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0">'+html+'</body></html>';
    document.addEventListener("keydown", onKey, true);
    o.addEventListener("click", function(e){
      var t=e.target.closest("[data-a],[data-k],[data-c]"); if(!t){ if(e.target===o) close(); return; }
      if(t.dataset.k){ copyHtml(html).then(function(ok){ toast(ok!==false?"Đã sao chép nội dung email — dán (Ctrl+V) vào thân email.":"Chưa sao chép được — bấm Sao chép nội dung."); }); return; }   /* link vẫn mở tab hộp thư */
      if(t.dataset.c){ var v=t.dataset.c==="to"?(m.to||[]).join("; "):t.dataset.c==="cc"?(m.cc||[]).join("; "):m.subject; copyText(v).then(function(){ toast("Đã sao chép"); }); return; }
      var a=t.dataset.a;
      if(a==="x") return close();
      if(a==="copy") return copyHtml(html).then(function(ok){ toast(ok!==false?"Đã sao chép nội dung email":"Trình duyệt chặn sao chép — chọn nội dung trong khung xem trước rồi Ctrl+C"); });
      if(a==="done"){
        var all=(m.to||[]).concat(m.cc||[]).join(", "), at=new Date().toLocaleString("vi-VN");
        setSent(id, { at:at, to:all });
        if(cfg().call) cfg().call({ action:"tripReportSent", id:id, r:(trip&&trip.row)||"", to:all }).catch(function(){});
        close(); toast("Đã ghi nhận: email báo cáo công tác đã gửi"); if(opt.onDone) try{ opt.onDone(); }catch(_){}
        return;
      }
      if(a==="sys"){
        var f=$("tpm-f"); if(!f||f.querySelector(".tpm-ask")) return;
        var box=document.createElement("div"); box.className="tpm-ask";
        box.innerHTML='<span>Nhờ hệ thống gửi thay (từ email MMH, trả lời về email của bạn)?</span><button class="tpm-btn pri" data-a="sysgo">Gửi thay</button><button class="tpm-btn" data-a="sysno">Thôi</button>';
        f.appendChild(box); return;
      }
      if(a==="sysno"){ var q=o.querySelector(".tpm-ask"); if(q) q.remove(); return; }
      if(a==="sysgo"){
        t.disabled=true; t.textContent="Đang gửi…";
        if(!cfg().call){ toast("Chưa cấu hình kết nối máy chủ."); return; }
        cfg().call({ action:"tripReportSent", id:id, r:(trip&&trip.row)||"", system:"1" }).then(function(r){
          if(r&&r.ok===false) throw new Error(r.error||"Lỗi máy chủ");
          setSent(id, { at:new Date().toLocaleString("vi-VN"), to:(m.to||[]).concat(m.cc||[]).join(", "), sys:1 });
          close(); toast("Hệ thống đã gửi email báo cáo công tác"); if(opt.onDone) try{ opt.onDone(); }catch(_){}
        }).catch(function(err){ t.disabled=false; t.textContent="Gửi thay"; toast("Chưa gửi được: "+((err&&err.message)||err)); });
      }
    });
  }
  /* đọc nội dung email từ báo cáo đã lưu rồi mở khung */
  function openSaved(trip, opt){
    if(!cfg().call) return;
    toast("Đang chuẩn bị email báo cáo…");
    cfg().call({ action:"tripInfo", id:trip.id, r:trip.row||"", mail:"1" }).then(function(x){
      var m=x&&x.trip&&x.trip.mail; if(!m) throw new Error((x&&x.error)||"Chưa có báo cáo đã lưu cho chuyến đi này");
      open(m, trip, opt);
    }).catch(function(e){ toast("Chưa mở được email báo cáo: "+((e&&e.message)||e)); });
  }
  /* sau khi lưu mà máy chủ không trả nội dung (gửi dạng POST): hỏi lại vài lần tới khi báo cáo có trên file */
  function openAfterSave(trip, probe){
    var n=0;
    (function poll(){
      n++;
      cfg().call({ action:"tripInfo", id:trip.id, r:trip.row||"", mail:"1" }).then(function(x){
        var t=x&&x.trip, m=t&&t.mail;
        if(m && (!probe || String(t.report||"").indexOf(probe)>=0)) return open(m, trip, { saved:true });
        if(n<8) setTimeout(poll, 3000);
      }).catch(function(){ if(n<8) setTimeout(poll, 3000); });
    })();
  }
  /* dải trong khung xem chuyến đi: đã gửi / chưa gửi email báo cáo */
  function bar(host, trip){
    if(!host||!trip||!trip.id) return;
    var old=host.querySelector(".tpm-bar"); if(old) old.remove();
    css();
    var s=sentOf(trip.id), d=document.createElement("div");
    d.className="tpm-bar"+(s?" done":"");
    d.innerHTML=s?'<span>Email báo cáo đã gửi lúc '+esc(s.at)+'.</span><button type="button">Gửi lại email</button>'
                 :'<span>Báo cáo đã lưu — bạn cần tự gửi email báo cáo từ hộp thư của mình.</span><button type="button">Soạn email báo cáo</button>';
    d.querySelector("button").onclick=function(){ openSaved(trip); };
    host.appendChild(d);
  }
  window.TRIPMAIL={ open:open, openSaved:openSaved, openAfterSave:openAfterSave, bar:bar, sent:sentOf, close:close };
})();
/* đóng khung khi bài hướng dẫn kết thúc */
(function hookClean(){ var f=window.__tourClean; if(typeof f!=="function"){ setTimeout(hookClean, 1000); return; } if(f.__tpm) return;
  window.__tourClean=function(){ try{ window.TRIPMAIL&&TRIPMAIL.close(); }catch(_){} return f.apply(this, arguments); }; window.__tourClean.__tpm=1; })();
