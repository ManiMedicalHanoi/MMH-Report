/* Ảnh thông báo v18.9 (dữ liệu giả lập): NODE_PATH=$(npm root -g) node tools/guide/cap189.js */
const {chromium}=require('playwright'), path=require('path'); const {page}=require('./t189.js');
(async()=>{
  const b=await chromium.launch(), out=path.resolve(__dirname,'../../updates/v18.9');
  const p=await page(b,{who:'Minh Trang',tk:'mmh.trang',w:1536,h:820});
  await p.evaluate(()=>{ try{ASG.close();}catch(_){} switchTab('detail'); setDetailTime('month'); document.querySelectorAll('.au-nudge,#au-nudge,[id*=nudge]').forEach(e=>e.remove()); });
  await p.evaluate(()=>{ const a=[...document.querySelectorAll('#tabnav button, #tabnav a, #tabnav [onclick]')].find(e=>/Cập nhật công việc/.test(e.textContent)); a&&a.click(); });
  await p.waitForTimeout(900);
  const clean=()=>p.evaluate(()=>{ [...document.querySelectorAll('body > div')].forEach(d=>{ if(/Xác thực email đăng nhập/.test(d.innerText||'')&&d.innerText.length<400) d.remove(); }); const f=document.getElementById('fab')||document.querySelector('.fab'); if(f) f.style.display='none'; });
  await clean();
  const box=await p.evaluate(()=>{ const r=document.querySelector('.detail-stchips').getBoundingClientRect(), t=document.querySelector('.v10-tbl-wrap').getBoundingClientRect(); return {x:0,y:Math.max(0,r.top-10),width:1536,height:Math.min(820,t.bottom+10)-Math.max(0,r.top-10)}; });
  await p.screenshot({path:out+'/bang.jpg',type:'jpeg',quality:82,clip:box});
  await p.evaluate(()=>{ setDetailView('list'); }); await p.waitForTimeout(400); await p.evaluate(()=>toggleDetail('4')); await p.waitForTimeout(500); await clean();
  const box2=await p.evaluate(()=>{ const r=document.querySelector('.detail-stchips').getBoundingClientRect(), t=document.querySelector('#detail-list .kt-panel').getBoundingClientRect(); return {x:0,y:Math.max(0,r.top-10),width:1536,height:t.bottom+10-Math.max(0,r.top-10)}; });
  await p.screenshot({path:out+'/danhsach.jpg',type:'jpeg',quality:82,clip:box2});
  console.log(p.errs); await b.close();
})();
