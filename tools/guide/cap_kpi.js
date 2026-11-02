/* Ảnh cho HDSD "Báo cáo KPI theo MMHSOP_009" (Report Hub v19.2, dữ liệu giả lập).
   Chạy: NODE_PATH=$(npm root -g) node tools/guide/cap_kpi.js [tên cảnh…]  → shots/k_*.png + .json (số chú thích)
   rồi node tools/guide/tojpg.js → node tools/guide/build_kpi.js → PDF=1 node tools/guide/render.js */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs'), M=require('./mock.js');
process.chdir(__dirname); if(!fs.existsSync('shots')) fs.mkdirSync('shots');
const ONLY=process.argv.slice(2);
let JSZIP=''; try{ JSZIP=fs.readFileSync(require.resolve('jszip/dist/jszip.min.js'),'utf8'); }catch(_){}
const http=require('http'), root=path.resolve(__dirname,'../..');
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const srv=http.createServer((q,r)=>{ const f=path.join(root,decodeURIComponent(q.url.split('?')[0])); fs.readFile(f,(e,d)=>{ if(e){ r.writeHead(404); r.end(); } else { r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'}); r.end(d); } }); }).listen(8792);

async function page(b, o){
  const ctx=await b.newContext({viewport:o.vp||{width:1440,height:860},deviceScaleFactor:2,locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'});
  const p=await ctx.newPage(); p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message)); p.on('dialog',d=>d.accept());
  await p.addInitScript((o)=>{ try{ if(sessionStorage.getItem('__i')) return; }catch(_){ return; } sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic',o.who); localStorage.setItem('mmh_src','marketing');
    localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.'+o.tk,exp:Date.now()+90*864e5,user:{email:o.tk+'@manimedicalhanoi.com',local:o.tk,pic:o.who,level:'pic',admin:o.tk==='mmh.product'}})); }, o);
  await p.clock.setFixedTime(new Date(o.time||'2026-11-04T09:00:00+07:00'));
  if(JSZIP) await p.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip/, r=>r.fulfill({contentType:'application/javascript',body:JSZIP}));
  await M.install(p,{noChecks:true});
  await p.goto('http://127.0.0.1:8792/index.html');
  await p.waitForFunction((w)=>window.S&&S.user&&S.user.pic===w&&document.getElementById('app').style.display==='block',o.who,{timeout:20000});
  if(!o.keepUpd) await p.evaluate(()=>{ if(window.UPD) UPD.active=function(){ return []; }; });
  await p.waitForTimeout(o.wait||2500);
  if(!o.keepUpd) await close(p);
  return p;
}
const close=p=>p.evaluate(()=>{ try{ if(window.UPD&&UPD.isOpen()) UPD.close(); }catch(_){} try{ ASG.close(); }catch(_){} try{ NT.close&&NT.close(); }catch(_){} document.querySelectorAll('#nt-letter,#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('#kpn').forEach(e=>e.classList.remove('show')); });
async function shot(p, name, o){
  o=o||{};
  let clip=null;
  if(o.clip){ clip=typeof o.clip==='string'? await p.evaluate(s=>{ const r=document.querySelector(s).getBoundingClientRect(); return {x:r.left,y:r.top,width:r.width,height:r.height}; }, o.clip) : o.clip; }
  const vp=p.viewportSize(); if(!clip) clip={x:0,y:0,width:vp.width,height:vp.height};
  const marks=[];
  for(const m of (o.marks||[])){
    const r=await p.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.left,y:r.top,w:r.width,h:r.height}; }, m[0]);
    if(!r){ console.log('  !! missing mark', name, m[0]); continue; }
    marks.push({n:m[1], pos:m[2]||'tl', box:!!m[3], x:(r.x-clip.x)/clip.width, y:(r.y-clip.y)/clip.height, w:r.w/clip.width, h:r.h/clip.height});
  }
  await p.screenshot({path:'shots/'+name+'.png', clip});
  fs.writeFileSync('shots/'+name+'.json', JSON.stringify({w:clip.width,h:clip.height,marks}));
  console.log('shot', name, Math.round(clip.width)+'x'+Math.round(clip.height), marks.length+' marks', p.errs.length?p.errs:'');
}
const why={'F4-01':'Đạt nhờ 2 đơn thầu bệnh viện tỉnh về sớm.','C1-01':'Chưa đạt: 1 phòng khám mới lùi lịch ký sang tháng 11.','C3-01':'Đạt: lên lịch tuyến Bắc Ninh – Bắc Giang cả tuần.','C21-00':'Đạt theo đánh giá của quản lý.'};
async function fm01(p){
  await p.evaluate(()=>KR.open('Viet','202610'));
  await p.waitForFunction(()=>document.querySelectorAll('#kr2 .ksp-k').length>0,null,{timeout:20000});
  for(const k in why) await p.fill('#kr2-why-'+k, why[k]);
  await p.fill('#kr2-next','- Ký hợp đồng phòng khám Hà Đông trước 15/11\n- Thêm 6 lượt viếng thăm đại lý khu vực phía Bắc');
  await p.fill('#kr2-high','Doanh số NPP vượt 10% nhờ đơn thầu.'); await p.fill('#kr2-chal','Một khách hàng lớn hoãn lịch ký hợp đồng.');
  await p.fill('#kr2-supp','Cần Marketing hỗ trợ tài liệu so sánh sản phẩm cho phòng khám.').catch(()=>{});
  await p.waitForTimeout(1800);
  await p.evaluate(()=>{ document.querySelectorAll('#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('.ksp .kx-l,.ksp .kx-r').forEach(e=>e.scrollTop=0); });
}
const S={};
S.k_kpi=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product'});
  await p.evaluate(()=>switchTab('kpi')); await p.waitForFunction(()=>document.querySelector('#tab-kpi .kp-btn'),null,{timeout:20000}); await p.waitForTimeout(1500); await close(p);
  await shot(p,'k_kpi',{marks:[['#tab-kpi .kp-seg',1,'tl'],['#tab-kpi .kp-at',2,'tl'],['#tab-kpi .kp-btn[onclick="KR.open()"]',3,'tr',1],['#tab-kpi .kp-btn[onclick="SE.open()"]',4,'tr',1],['#tab-kpi .kp-btn.pri',5,'tl']]});
  await p.context().close(); };
S.k_menu=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product'});
  await p.evaluate(()=>{ if(!document.getElementById('c10-repm')) switchTab('calendar'); }); await p.waitForTimeout(800);
  await p.evaluate(()=>c10RepMenu()); await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{ const m=document.getElementById('c10-repm'); const r=m.getBoundingClientRect(); return {x:Math.max(0,r.left-260),y:Math.max(0,r.top-70),width:Math.min(760,r.width+520),height:r.height+110}; });
  await shot(p,'k_menu',{clip:r,marks:[['#c10-repm button[data-kpi="1"]',1,'tr',1],['#c10-repm button[data-kpi="2"]',2,'tr',1]]});
  await p.context().close(); };
S.k_popup=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product',time:'2026-11-05T09:00:00+07:00',wait:1000,keepUpd:true});
  await p.evaluate(()=>{ window.UPD&&(UPD.active=function(){ return []; }); try{ if(UPD.isOpen()) UPD.close(); }catch(_){} });
  await p.waitForFunction(()=>document.querySelector('#kpn.show'),null,{timeout:60000}).catch(()=>{});
  await p.evaluate(()=>document.querySelectorAll('#rhn-toast,#nt-letter').forEach(e=>e.remove()));
  const r=await p.evaluate(()=>{ const r=document.querySelector('#kpn .c').getBoundingClientRect(); return {x:r.left-24,y:r.top-24,width:r.width+48,height:r.height+48}; });
  await shot(p,'k_popup',{clip:r,marks:[['#kpn .c button, #kpn .c .go',1,'tr']]});
  await p.context().close(); };
S.k_fm01=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product',time:'2026-11-04T09:00:00+07:00',vp:{width:1440,height:900}}); await fm01(p);
  await shot(p,'k_fm01',{marks:[['#kr2 .ksp-due',1,'tl'],['#kr2-to',2,'tl',1],['#kr2-frame',3,'tl'],['#kr2-test, #kr2 button[id$="test"]',4,'tr'],['#kr2-send',5,'tr',1]]});
  /* phần dưới của cột trái: điểm nổi bật / khó khăn / hỗ trợ */
  await p.evaluate(()=>{ const l=document.querySelector('#kr2 .kx-l'); l.scrollTop=l.scrollHeight; }); await p.waitForTimeout(300);
  await shot(p,'k_fm01b',{clip:'#kr2 .kx-l',marks:[['#kr2-next',1,'tl',1],['#kr2-high',2,'tl',1],['#kr2-chal',3,'tl',1],['#kr2-supp',4,'tl',1]]});
  /* xác nhận gửi trên khung */
  await p.evaluate(()=>{ const l=document.querySelector('#kr2 .kx-l'); l.scrollTop=0; });
  await p.click('#kr2-send'); await p.waitForTimeout(400);
  const cb=await p.evaluate(()=>{ const c=document.querySelector('#kr2 .kx-card').getBoundingClientRect(); return {x:c.left+c.width*0.36,y:c.top+c.height*0.55,width:c.width*0.64,height:c.height*0.45}; });
  await shot(p,'k_ask',{clip:cb,marks:[['#kr2-ft .ksp-ask [data-a="yes"]',1,'tr',1]]});
  await p.click('#kr2-ft .ksp-ask [data-a="yes"]'); await p.waitForTimeout(3000);
  const cd=await p.evaluate(()=>{ const c=document.querySelector('#kr2 .kx-card').getBoundingClientRect(), d=document.querySelector('#kr2 .ksp-due').getBoundingClientRect(); return {x:c.left,y:c.top,width:Math.min(c.width,620),height:d.bottom-c.top+16}; });
  await shot(p,'k_sent',{clip:cd,marks:[['#kr2 .ksp-due',1,'tl',1]]});
  if(M.KPIMAIL.length){ const ms=M.KPIMAIL[M.KPIMAIL.length-1]; if(ms.attB64) fs.writeFileSync('shots/k_fm01.docx', Buffer.from(ms.attB64,'base64')); }
  await p.context().close(); };
S.k_th=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product',vp:{width:1440,height:900}});
  await p.evaluate(()=>KR.open('Dao','202610')); await p.waitForFunction(()=>document.querySelectorAll('#kr2 .ksp-k').length>0,null,{timeout:20000}); await p.waitForTimeout(1200);
  await p.fill('#kr2-gr','Dear Shuhei san, Ha san,'); await p.fill('#kr2-why-F4-02','Not achieved: one distributor delayed its order to November.').catch(()=>{}); await p.waitForTimeout(1500);
  await p.evaluate(()=>{ document.querySelectorAll('#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('.ksp .kx-l,.ksp .kx-r').forEach(e=>e.scrollTop=0); });
  await shot(p,'k_th',{marks:[['#kr2-gr',1,'tl',1],['#kr2-frame',2,'tl']]});
  await p.context().close(); };
S.k_mail=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product',vp:{width:1440,height:1400}}); await fm01(p);
  const html=await p.evaluate(()=>document.getElementById('kr2-frame').srcdoc||'');
  await p.context().close();
  const ctx=await b.newContext({viewport:{width:820,height:1200},deviceScaleFactor:2}); const q=await ctx.newPage();
  await q.setContent(html); await q.waitForTimeout(600);
  const h=await q.evaluate(()=>Math.min(1500,document.documentElement.scrollHeight)); await q.setViewportSize({width:820,height:h}); q.errs=[];
  await shot(q,'k_mail',{marks:[]}); await ctx.close(); };
S.k_fm02=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product',time:'2026-12-02T09:00:00+07:00',vp:{width:1440,height:900}});
  await p.evaluate(()=>SE.open('Giang',68,'Q1')); await p.waitForFunction(()=>document.querySelectorAll('#kq .ksp-det').length>0,null,{timeout:20000});
  await p.fill('#kq-B1a','Tăng tỉ lệ đăng bài đúng hạn lên ≥ 97%.'); await p.fill('#kq-B5','Đạt 4/4 KPI, nội dung sản phẩm vượt mục tiêu.');
  await p.click('#kq .kx-sc[data-k="B5"] button[data-n="4"]'); await p.click('#kq .kx-rate button[data-r="AE"]');
  await p.fill('#kq-good','Chủ động lên lịch nội dung cả quý.'); await p.fill('#kq-imp','Cần chuẩn bị sự kiện sớm hơn 2 tuần.');
  await p.evaluate(()=>{ document.querySelectorAll('#rhn-toast').forEach(e=>e.remove()); document.querySelectorAll('.ksp .kx-l,.ksp .kx-r').forEach(e=>e.scrollTop=0); }); await p.waitForTimeout(800);
  await shot(p,'k_fm02',{marks:[['#kq .ksp-a',1,'tl',1],['#kq-dl',2,'tr'],['#kq-send',3,'tr',1]]});
  /* phần B năng lực + C tự đánh giá */
  await p.evaluate(()=>{ const s=document.querySelector('#kq .kx-rate'); s&&s.scrollIntoView({block:'end'}); }); await p.waitForTimeout(300);
  await shot(p,'k_fm02b',{clip:'#kq .kx-l',marks:[['#kq .kx-sc[data-k="B5"]',1,'tl',1],['#kq .kx-rate',2,'tl',1]]});
  await p.context().close(); };
S.k_total=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product'});
  await p.evaluate(()=>switchTab('kpi')); await p.waitForFunction(()=>document.querySelector('#tab-kpi .kp-btn.pri'),null,{timeout:20000}).catch(()=>{});
  await p.evaluate(()=>KT.open()); await p.waitForTimeout(2500); await close(p);
  await shot(p,'k_total',{marks:[]});
  await p.evaluate(()=>{ const b=[...document.querySelectorAll('button,[data-t]')].find(x=>/Thành viên/.test(x.textContent)&&x.offsetParent); b&&b.click(); }); await p.waitForTimeout(1500);
  await shot(p,'k_total_mem',{marks:[]});
  await p.context().close(); };
S.k_stat=async b=>{ const p=await page(b,{who:'Giang',tk:'mmh.product'});
  await p.evaluate(()=>RPSTAT.open()); await p.waitForTimeout(800);
  await p.evaluate(()=>{ const f=document.getElementById('rps-f'), t=document.getElementById('rps-t'); f.value='202609'; t.value='202610'; document.getElementById('rps-load').click(); }); await p.waitForTimeout(3500);
  await shot(p,'k_stat',{clip:'#rps-ov > div',marks:[['#rps-load',1,'tr'],['#rps-out',2,'tl'],['#rps-xls',3,'tr',1]]});
  await p.context().close(); };

(async()=>{
  const b=await chromium.launch();
  for(const k of Object.keys(S)){ if(ONLY.length && !ONLY.includes(k)) continue; try{ await S[k](b); }catch(e){ console.log('ERR', k, e.message.split('\n')[0]); } }
  await b.close(); srv.close();
})();
