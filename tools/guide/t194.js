/* Kiểm thử + ảnh v19.4 (kpisop v1.2: chỉ gửi bản soạn sẵn về email của chính mình · nhắc ngày 01–05, quá hạn 06–10) — dựa trên t191.js. Gốc: Kiểm thử + ảnh v19.1 (+ v19.2: lời chào theo chức danh, xác nhận gửi trên khung): Báo cáo KPI tháng (FM01) / quý (FM02) theo quy trình MMHSOP_009 (kpisop/kpisop.js).
   Chạy: NODE_PATH=$(npm root -g) node tools/guide/t191.js [--shots]   (cần JSZip cục bộ: npm i -g jszip, hoặc tự tải từ cdnjs nếu mạng cho phép)
   --shots ⇒ lưu ảnh vào updates/v19.1 */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs'), M=require('./mock.js');
const SHOTS=process.argv.includes('--shots'), OUT=path.resolve(__dirname,'../../updates/v19.4'), TMP=path.resolve(__dirname,'shots'); if(!fs.existsSync(TMP)) fs.mkdirSync(TMP);
let JSZIP=''; try{ JSZIP=fs.readFileSync(require.resolve('jszip/dist/jszip.min.js'),'utf8'); }catch(_){}
async function page(b, o){
  const ctx=await b.newContext({viewport:{width:o.w||1500,height:o.h||900},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh',acceptDownloads:true});
  const p=await ctx.newPage(); p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.addInitScript((o)=>{ try{ if(sessionStorage.getItem('__i')) return; }catch(_){ return; } sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic',o.who); localStorage.setItem('mmh_src','marketing');
    localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.'+o.tk,exp:Date.now()+90*864e5,user:{email:o.tk+'@manimedicalhanoi.com',local:o.tk,pic:o.who,level:'pic',admin:o.tk==='mmh.product'}})); }, o);
  await p.clock.setFixedTime(new Date(o.time||'2026-11-05T09:00:00+07:00'));
  if(JSZIP) await p.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/, r=>r.fulfill({contentType:'application/javascript',body:JSZIP}));
  await M.install(p,{noChecks:true});
  await p.goto('http://127.0.0.1:8792/index.html');
  await p.waitForFunction((w)=>window.S&&S.user&&S.user.pic===w&&document.getElementById('app').style.display==='block',o.who,{timeout:20000});
  await p.waitForTimeout(o.wait||2500);
  return p;
}
const close=p=>p.evaluate(()=>{ try{ if(window.UPD&&UPD.isOpen()) UPD.close(); }catch(_){} try{ ASG.close(); }catch(_){} try{ NT.close&&NT.close(); }catch(_){} document.querySelectorAll('#nt-letter,#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('#kpn').forEach(e=>e.classList.remove('show')); });
/* file:// không fetch được templates/ ⇒ phục vụ repo qua http */
const http=require('http'), root=path.resolve(__dirname,'../..');
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{ const f=path.join(root,decodeURIComponent(q.url.split('?')[0])); fs.readFile(f,(e,d)=>{ if(e){ r.writeHead(404); r.end(); } else { r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'}); r.end(d); } }); }).listen(8792);
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  if(SHOTS && !fs.existsSync(OUT)) fs.mkdirSync(OUT,{recursive:true});
  const pop=async(time)=>{ const p=await page(b,{who:'Giang',tk:'mmh.product',time,wait:1000}); await p.evaluate(()=>{ window.UPD&&(UPD.active=function(){ return []; }); });
    await p.waitForFunction(()=>document.querySelector('#kpn.show'),null,{timeout:25000}).catch(()=>{});
    const t=await p.evaluate(()=>{ const o=document.querySelector('#kpn.show'); return o?o.innerText:''; }); return [p,t]; };
  /* ① nhắc hạn: 02/11 còn 3 ngày · 05/11 hôm nay · 08/11 quá hạn · 12/11 không nhắc */
  let [p,t]=await pop('2026-11-02T09:00:00+07:00');
  if(!/còn 3 ngày/.test(t) || !/05\/11\/2026/.test(t)) fail('02/11: '+t.slice(0,160));
  if(!/Đã gửi, không nhắc nữa/.test(t)) fail('thiếu nút Đã gửi, không nhắc nữa');
  if(!/tự gửi email/.test(t)) fail('popup chưa nói tự gửi email');
  if(SHOTS && t) await p.screenshot({path:OUT+'/nhachan.jpg',type:'jpeg',quality:82,clip:await p.evaluate(()=>{ const r=document.querySelector('#kpn .c').getBoundingClientRect(); return {x:r.left-20,y:r.top-20,width:r.width+40,height:r.height+40}; })});
  await p.context().close();
  [p,t]=await pop('2026-11-05T09:00:00+07:00'); if(!/hôm nay là hạn/.test(t)) fail('05/11: '+t.slice(0,160)); await p.context().close();
  [p,t]=await pop('2026-11-08T09:00:00+07:00'); if(!/quá hạn/i.test(t)) fail('08/11: '+t.slice(0,160)); await p.context().close();
  [p,t]=await pop('2026-12-03T09:00:00+07:00'); if(!/FM02/.test(t) && !/QUÝ/.test(t)) {
    await p.evaluate(()=>{ const b=[...document.querySelectorAll('#kpn button')].find(x=>/Để sau/.test(x.textContent)); if(b) b.click(); }); await p.waitForTimeout(1200);
    t=await p.evaluate(()=>{ const o=document.querySelector('#kpn.show'); return o?o.innerText:''; }); }
  if(!/Q1 FY68/.test(t)) fail('03/12 chưa nhắc KPI quý: '+t.slice(0,160)); await p.context().close();
  p=await page(b,{who:'Giang',tk:'mmh.product',time:'2026-11-12T09:00:00+07:00',wait:1000}); await p.evaluate(()=>{ window.UPD&&(UPD.active=function(){ return []; }); }); await p.waitForTimeout(9000);
  if(await p.$('#kpn.show')) fail('12/11 vẫn nhắc'); await p.context().close();

  /* ② Báo cáo KPI tháng — chỉ gửi về email của mình */
  p=await page(b,{who:'Giang',tk:'mmh.product',time:'2026-11-03T09:00:00+07:00'}); await close(p); await p.addStyleTag({content:'#kpn,#rhn-toast{display:none!important}'});
  await p.evaluate(()=>{ document.querySelectorAll('#kpn').forEach(e=>e.classList.remove('show')); KR.open('Viet','202610'); });
  await p.waitForFunction(()=>document.querySelectorAll('#kr2 .ksp-k').length>0,null,{timeout:20000});
  const btns=await p.$$eval('#kr2-ft button',x=>x.map(b=>b.textContent.trim()));
  if(btns.some(x=>/Gửi báo cáo KPI tháng|Gửi thử/.test(x))) fail('còn nút gửi cho người khác: '+btns);
  if(!btns.includes('Soạn email để gửi') || !btns.includes('Gửi bản sao về email của tôi')) fail('nút mới: '+btns);
  const to1=await p.$$eval('#kr2-to span',x=>x.map(s=>s.firstChild.textContent)); if(to1.length!==2) fail('To gợi ý: '+to1);
  await p.click('#kr2-mail'); await p.waitForTimeout(400); if(await p.$('#kr2-ft .ksp-compose')) fail('thiếu lý do vẫn mở soạn email');
  const why={'F4-01':'Đạt nhờ 2 đơn thầu bệnh viện tỉnh về sớm.','C1-01':'Chưa đạt: 1 phòng khám mới lùi lịch ký sang tháng 11.','C3-01':'Đạt: lên lịch tuyến Bắc Ninh – Bắc Giang cả tuần.','C21-00':'Đạt theo đánh giá của quản lý.'};
  for(const k in why) await p.fill('#kr2-why-'+k, why[k]);
  await p.fill('#kr2-next','- Ký hợp đồng phòng khám Hà Đông trước 15/11\n- Thêm 6 lượt viếng thăm đại lý khu vực phía Bắc');
  await p.waitForTimeout(1500);
  /* soạn email: thanh mở hộp thư (To / CC / tiêu đề điền sẵn), không gửi gì qua hệ thống */
  await p.context().grantPermissions(['clipboard-read','clipboard-write']).catch(()=>{});
  await p.click('#kr2-mail'); await p.waitForTimeout(800);
  const bar=await p.$eval('#kr2-ft .ksp-compose',x=>({t:x.innerText, h:[...x.querySelectorAll('a')].map(a=>a.href)})).catch(()=>null);
  if(!bar) fail('chưa hiện thanh soạn email');
  else { if(!bar.h.some(h=>/outlook\.office\.com\/mail\/deeplink\/compose\?to=truongbophan/.test(h))) fail('link Outlook: '+bar.h[0]);
    if(!bar.h.some(h=>/mail\.google\.com\/mail\/\?view=cm.*cc=ketoan/.test(h))) fail('link Gmail: '+bar.h[1]);
    if(!/tự gửi/.test(bar.t)) fail('thanh soạn email: '+bar.t); }
  if(M.KPIMAIL.length) fail('soạn email mà hệ thống lại gửi');
  if(SHOTS){ await p.evaluate(()=>{ document.querySelectorAll('#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('.ksp .kx-l,.ksp .kx-r').forEach(e=>e.scrollTop=0); const s=document.querySelector('#kr2 .ksp-self'); if(s) s.scrollIntoView({block:'start'}); }); await p.waitForTimeout(300); await p.screenshot({path:OUT+'/kpithang.jpg',type:'jpeg',quality:82}); }
  await p.click('#kr2-ft .ksp-compose button:has-text("Đã gửi")'); await p.waitForTimeout(1500);
  if(!(await p.evaluate(()=>!!localStorage.getItem('mmh_kpi_sent:Viet:202610')))) fail('Đã gửi chưa ghi nhận');
  const ks=M.KPISENT[M.KPISENT.length-1]||{}; if(ks.kind!=='m' || ks.month!=='202610' || ks.pic!=='Viet') fail('rhKpiSent: '+JSON.stringify(ks));
  const dueTxt=await p.$eval('#kr2 .ksp-due',x=>x.innerText); if(!/đánh dấu đã gửi/.test(dueTxt)) fail('dòng đã gửi: '+dueTxt);
  if(SHOTS){ await p.evaluate(()=>{ document.querySelectorAll('.ksp .kx-l').forEach(e=>e.scrollTop=0); }); await p.waitForTimeout(300);
    await p.screenshot({path:OUT+'/dagui.jpg',type:'jpeg',quality:82,clip:await p.evaluate(()=>{ const c=document.querySelector('#kr2 .kx-card').getBoundingClientRect(); return {x:c.left,y:c.top,width:c.width*0.5,height:Math.min(420,c.height)}; })}); }
  /* bản sao về email của mình */
  await p.click('#kr2-send'); await p.waitForTimeout(3000);
  const ms=M.KPIMAIL[M.KPIMAIL.length-1]||{};
  if(ms.to!=='mmh.product@manimedicalhanoi.com' || ms.cc) fail('bản sao gửi tới người khác: to='+ms.to+' cc='+ms.cc);
  if(!ms.attB64) fail('bản sao chưa đính kèm Word');
  await p.evaluate(()=>document.getElementById('kr2').classList.remove('show'));

  /* ③ Báo cáo KPI quý (FM02) — chỉ gửi về email của mình */
  await p.evaluate(()=>SE.open('Giang',68,'Q1')); await p.waitForFunction(()=>document.querySelectorAll('#kq .ksp-det').length>0,null,{timeout:20000}); await p.waitForTimeout(1500);
  const qb=await p.$$eval('#kq-ft button',x=>x.map(b=>b.textContent.trim())); if(qb.some(x=>/Gửi báo cáo KPI quý|Gửi thử/.test(x))) fail('quý còn nút cũ: '+qb);
  await p.click('#kq-mail'); await p.waitForTimeout(800); if(!(await p.$('#kq-ft .ksp-compose'))) fail('quý chưa có thanh soạn email');
  await p.click('#kq-ft .ksp-compose button:has-text("Đã gửi")'); await p.waitForTimeout(1200);
  if((M.KPISENT[M.KPISENT.length-1]||{}).kind!=='q') fail('rhKpiSent quý');
  await p.click('#kq-send'); await p.waitForTimeout(3500);
  const se=M.RPLOG[M.RPLOG.length-1]||{};
  if(se.to!=='mmh.product@manimedicalhanoi.com' || se.cc || !se.b64) fail('quý gửi: '+JSON.stringify({to:se.to,cc:se.cc,fwd:se.fwdTo}).slice(0,200));
  if(p.errs.length) fail('lỗi trang: '+p.errs.join(' | '));
  await p.context().close(); srv.close();
  await b.close(); console.log(ok?'OK v19.4':'FAIL v19.4'); process.exit(ok?0:1);
})();
