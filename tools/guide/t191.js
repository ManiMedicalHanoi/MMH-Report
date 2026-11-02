/* Kiểm thử + ảnh v19.1 (+ v19.2: lời chào theo chức danh, xác nhận gửi trên khung): Báo cáo KPI tháng (FM01) / quý (FM02) theo quy trình MMHSOP_009 (kpisop/kpisop.js).
   Chạy: NODE_PATH=$(npm root -g) node tools/guide/t191.js [--shots]   (cần JSZip cục bộ: npm i -g jszip, hoặc tự tải từ cdnjs nếu mạng cho phép)
   --shots ⇒ lưu ảnh vào updates/v19.1 */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs'), M=require('./mock.js');
const SHOTS=process.argv.includes('--shots'), OUT=path.resolve(__dirname,'../../updates/v19.1'), TMP=path.resolve(__dirname,'shots'); if(!fs.existsSync(TMP)) fs.mkdirSync(TMP);
let JSZIP=''; try{ JSZIP=fs.readFileSync(require.resolve('jszip/dist/jszip.min.js'),'utf8'); }catch(_){}
async function page(b, o){
  const ctx=await b.newContext({viewport:{width:o.w||1500,height:o.h||900},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh',acceptDownloads:true});
  const p=await ctx.newPage(); p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.addInitScript((o)=>{ try{ if(sessionStorage.getItem('__i')) return; }catch(_){ return; } sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic',o.who); localStorage.setItem('mmh_src','marketing');
    localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.'+o.tk,exp:Date.now()+90*864e5,user:{email:o.tk+'@manimedicalhanoi.com',local:o.tk,pic:o.who,level:'pic',admin:o.tk==='mmh.product'}})); }, o);
  await p.clock.setFixedTime(new Date(o.time||'2026-11-05T09:00:00+07:00'));
  if(JSZIP) await p.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/, r=>r.fulfill({contentType:'application/javascript',body:JSZIP}));
  await M.install(p,{noChecks:true});
  await p.goto('http://127.0.0.1:8791/index.html');
  await p.waitForFunction((w)=>window.S&&S.user&&S.user.pic===w&&document.getElementById('app').style.display==='block',o.who,{timeout:20000});
  await p.waitForTimeout(o.wait||2500);
  return p;
}
const close=p=>p.evaluate(()=>{ try{ if(window.UPD&&UPD.isOpen()) UPD.close(); }catch(_){} try{ ASG.close(); }catch(_){} try{ NT.close&&NT.close(); }catch(_){} document.querySelectorAll('#nt-letter,#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('#kpn').forEach(e=>e.classList.remove('show')); });
/* file:// không fetch được templates/ ⇒ phục vụ repo qua http */
const http=require('http'), root=path.resolve(__dirname,'../..');
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{ const f=path.join(root,decodeURIComponent(q.url.split('?')[0])); fs.readFile(f,(e,d)=>{ if(e){ r.writeHead(404); r.end(); } else { r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'}); r.end(d); } }); }).listen(8791);
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  if(SHOTS && !fs.existsSync(OUT)) fs.mkdirSync(OUT,{recursive:true});

  /* ① popup nhắc hạn ngày 05/11 (thứ Năm) — KPI tháng 10/2026 */
  let p=await page(b,{who:'Giang',tk:'mmh.product',wait:1000});
  await p.evaluate(()=>{ window.UPD&&(UPD.active=function(){ return []; }); });
  await p.waitForFunction(()=>document.querySelector('#kpn.show'),null,{timeout:60000}).catch(()=>{});
  const kpn=await p.evaluate(()=>{ const o=document.querySelector('#kpn.show'); return o?o.innerText:''; });
  if(!/05\/11/.test(kpn) || !/FM01/.test(kpn)) fail('popup nhắc hạn ngày 05: '+kpn.slice(0,120));
  if(SHOTS && kpn) await p.screenshot({path:OUT+'/nhachan.jpg',type:'jpeg',quality:82,clip:await p.evaluate(()=>{ const r=document.querySelector('#kpn .c').getBoundingClientRect(); return {x:r.left-20,y:r.top-20,width:r.width+40,height:r.height+40}; })});
  /* luật ngày nhắc */
  const rd=await p.evaluate(()=>[KPISOP.remindDay(2026,11),KPISOP.remindDay(2026,12),KPISOP.remindDay(2026,9),KPISOP.dueMonth('202610'),KPISOP.dueQuarter(68,'Q1')]);
  if(JSON.stringify(rd)!==JSON.stringify([5,4,4,'05/11/2026','05/12/2026'])) fail('ngày nhắc / hạn: '+JSON.stringify(rd));
  await p.context().close();

  /* ② ngày 02/11 không còn popup cũ (16:00 ngày 02) */
  p=await page(b,{who:'Giang',tk:'mmh.product',time:'2026-11-02T09:00:00+07:00',wait:1000});
  await p.evaluate(()=>{ window.UPD&&(UPD.active=function(){ return []; }); }); await p.waitForTimeout(9000);
  if(await p.$('#kpn.show')) fail('ngày 02 vẫn hiện popup KPI');
  await p.context().close();

  /* ③ Báo cáo KPI tháng — Sales VN (Viet) */
  p=await page(b,{who:'Giang',tk:'mmh.product',time:'2026-11-10T09:00:00+07:00'}); await close(p);
  await p.evaluate(()=>{ document.querySelectorAll('#kpn').forEach(e=>e.classList.remove('show')); KR.open('Viet','202610'); });
  await p.waitForFunction(()=>document.querySelectorAll('#kr2 .ksp-k').length>0,null,{timeout:20000});
  const n1=await p.$$eval('#kr2 .ksp-k',x=>x.length); if(n1!==4) fail('số chỉ tiêu tháng = '+n1);
  const to1=await p.$$eval('#kr2-to span',x=>x.map(s=>s.firstChild.textContent)); if(to1.length!==2) fail('To phải là Trưởng bộ phận + Tổng Giám đốc: '+to1);
  const cc1=await p.$$eval('#kr2-cc span',x=>x.map(s=>s.firstChild.textContent)); if(!cc1.includes('ketoan@manimedicalhanoi.com')) fail('CC thiếu Kế toán: '+cc1);
  /* gửi khi thiếu lý do ⇒ chặn */
  await p.click('#kr2-send'); await p.waitForTimeout(400); if(M.KPIMAIL.length) fail('thiếu lý do vẫn gửi được');
  const why={'F4-01':'Đạt nhờ 2 đơn thầu bệnh viện tỉnh về sớm.','C1-01':'Chưa đạt: 1 phòng khám mới lùi lịch ký sang tháng 11.','C3-01':'Đạt: lên lịch tuyến Bắc Ninh – Bắc Giang cả tuần.','C21-00':'Đạt theo đánh giá của quản lý.'};
  for(const k in why) await p.fill('#kr2-why-'+k, why[k]);
  await p.fill('#kr2-next','- Ký hợp đồng phòng khám Hà Đông trước 15/11\n- Thêm 6 lượt viếng thăm đại lý khu vực phía Bắc');
  await p.fill('#kr2-high','Doanh số NPP vượt 10% nhờ đơn thầu.'); await p.fill('#kr2-chal','Một khách hàng lớn hoãn lịch ký hợp đồng.');
  await p.waitForTimeout(1500);
  const gr=await p.$eval('#kr2-gr',x=>x.value); if(gr!=='Dear chị Tuyên, sếp Hà,') fail('lời chào: '+gr);
  const pv=await p.evaluate(()=>document.getElementById('kr2-frame').srcdoc||'');
  if(!/MMHSOP_009-FM01/.test(pv) || !/2 đơn thầu/.test(pv) || !/Không có/.test(pv)) fail('xem trước chưa theo FM01');
  if(SHOTS){ await p.evaluate(()=>{ document.querySelectorAll('#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('.ksp .kx-l,.ksp .kx-r').forEach(e=>e.scrollTop=0); }); }   if(SHOTS) await p.screenshot({path:OUT+'/kpithang.jpg',type:'jpeg',quality:82});
  await p.click('#kr2-send'); await p.waitForTimeout(300);
  if(M.KPIMAIL.length) fail('gửi khi chưa bấm Xác nhận gửi');
  const ask=await p.$eval('#kr2-ft .ksp-ask',x=>x.innerText).catch(()=>'');
  if(SHOTS){ const o2=path.resolve(__dirname,'../../updates/v19.2'); if(!fs.existsSync(o2)) fs.mkdirSync(o2,{recursive:true}); await p.evaluate(()=>{ document.querySelectorAll('#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('.ksp .kx-r').forEach(e=>e.scrollTop=0); });
    const cb=await p.evaluate(()=>{ const c=document.querySelector('#kr2 .kx-card').getBoundingClientRect(); return {x:c.left+c.width*0.36,y:c.top,width:c.width*0.64,height:c.height}; }); await p.screenshot({path:o2+'/xacnhan.jpg',type:'jpeg',quality:82,clip:cb}); } if(!/truongbophan/.test(ask)) fail('chưa hiện xác nhận gửi trên khung: '+ask);
  await p.click('#kr2-ft .ksp-ask [data-a="yes"]'); await p.waitForTimeout(3000);
  const dueTxt=await p.$eval('#kr2 .ksp-due',x=>x.innerText); if(!/Đã gửi lúc/.test(dueTxt)) fail('chưa hiện đã gửi: '+dueTxt);
  const ms=M.KPIMAIL[M.KPIMAIL.length-1]||{};
  if(!ms.attB64 || ms.attB64.length<10000) fail('chưa đính kèm file Word FM01');
  if(!/^MMHSOP_009-FM01_KPI_Thang_202610_Tran_Minh_Viet\.docx$/.test(ms.attName||'')) fail('tên file FM01: '+ms.attName);
  if(!ms.reasons || ms.reasons['C1-01']!==why['C1-01']) fail('thiếu lý do từng chỉ tiêu');
  if(ms.lang) fail('Sales VN phải dùng tiếng Việt');
  if(ms.attB64) fs.writeFileSync(TMP+'/t191_fm01.docx', Buffer.from(ms.attB64,'base64'));
  const sent=await p.evaluate(()=>!!localStorage.getItem('mmh_kpi_sent:Viet:202610')); if(!sent) fail('chưa ghi nhận đã gửi');

  /* ④ nhóm Thái ⇒ tiếng Anh */
  await p.evaluate(()=>KR.open('Dao','202610')); await p.waitForTimeout(1500);
  const grTh=await p.$eval('#kr2-gr',x=>x.value); if(!/^Dear .*san, Ha san,$/.test(grTh)) fail('lời chào nhóm Thái: '+grTh);
  const en=await p.evaluate(()=>({h:document.querySelector('#kr2 .kx-l').innerText, f:KPISOP.m.lang}));
  if(en.f!=='en' || !/KPI Results Summary/.test(en.h)) fail('nhóm Thái chưa dùng mẫu tiếng Anh');
  await p.evaluate(()=>document.getElementById('kr2').classList.remove('show'));

  /* ⑤ Báo cáo KPI quý (FM02) */
  await p.evaluate(()=>SE.open('Giang',68,'Q1')); await p.waitForFunction(()=>document.querySelectorAll('#kq .ksp-det').length>0,null,{timeout:20000});
  const cap=await p.evaluate(()=>{ const r=[...document.querySelectorAll('#kq .ksp-a tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ')); return r; });
  if(!cap.some(t=>/C13-02/.test(t)&&/130%/.test(t))) fail('chưa giới hạn 130%: '+cap.join(' | '));
  await p.fill('#kq-B1a','Tăng tỉ lệ đăng bài đúng hạn lên ≥ 97%.'); await p.fill('#kq-B5','Đạt 4/4 KPI, nội dung sản phẩm vượt mục tiêu.');
  await p.click('#kq .kx-sc[data-k="B5"] button[data-n="4"]'); await p.click('#kq .kx-rate button[data-r="AE"]');
  await p.fill('#kq-good','Chủ động lên lịch nội dung cả quý.'); await p.fill('#kq-imp','Cần chuẩn bị sự kiện sớm hơn 2 tuần.');
  if(SHOTS){ await p.evaluate(()=>{ document.querySelectorAll('#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('.ksp .kx-l,.ksp .kx-r').forEach(e=>e.scrollTop=0); }); }   if(SHOTS) await p.screenshot({path:OUT+'/kpiquy.jpg',type:'jpeg',quality:82});
  const dl=p.waitForEvent('download'); await p.click('#kq-dl'); const d=await dl; await d.saveAs(TMP+'/t191_fm02.docx');
  if(!/^MMHSOP_009-FM02_KPI_Quy_FY68_Q1_Hoang_Giang\.docx$/.test(d.suggestedFilename())) fail('tên file FM02: '+d.suggestedFilename());
  await p.click('#kq-send'); await p.waitForTimeout(300); await p.click('#kq-ft .ksp-ask [data-a="yes"]'); await p.waitForTimeout(3000);
  const se=M.RPLOG[M.RPLOG.length-1]||{};
  if(!se.b64 || se.q!=='Q1' || !/FM02/.test(se.subject||'')) fail('gửi báo cáo quý: '+JSON.stringify({q:se.q,s:se.subject}).slice(0,200));
  if(p.errs.length) fail('lỗi trang: '+p.errs.join(' | '));
  await p.context().close(); srv.close();
  await b.close(); console.log(ok?'OK v19.1':'FAIL v19.1'); process.exit(ok?0:1);
})();
