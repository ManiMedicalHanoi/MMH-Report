/* Kiểm thử + ảnh v19.0: nút "Nhắc tôi" (thông báo từ app Sự kiện MKT, rhnotify/rhnotify.js). NODE_PATH=$(npm root -g) node tools/guide/t190.js */
const {chromium}=require('playwright'), path=require('path'); const {page}=require('./t189.js');
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); }, out=path.resolve(__dirname,'../../updates/v19.0');
  const p=await page(b,{who:'Minh Trang',tk:'mmh.trang',w:1536,h:820});
  await p.evaluate(()=>{ try{ASG.close();}catch(_){} window.__opened=[]; window.open=function(u){ window.__opened.push(u); return null; }; });
  await p.waitForTimeout(2500);
  const n=await p.$eval('#tb-tools #rhn-btn .rhn-n',x=>x.textContent).catch(()=>''); if(n!=='2') fail('số thông báo mới = '+n+' (cần 2)');
  const toast=await p.$('#rhn-toast'); if(!toast) fail('không thấy thẻ báo có thông báo mới');
  await p.evaluate(()=>{ const t=document.getElementById('rhn-toast'); if(t) t.remove(); });
  await p.click('#rhn-btn'); await p.waitForTimeout(400);
  const items=await p.$$eval('#rhn-pop li',x=>x.length); if(items!==3) fail('danh sách = '+items);
  const box=await p.evaluate(()=>{ const r=document.getElementById('rhn-pop').getBoundingClientRect(), t=document.getElementById('topbar').getBoundingClientRect(); return {x:Math.max(0,r.left-420),y:0,width:Math.min(1536,r.right+16)-Math.max(0,r.left-420),height:r.bottom+14}; });
  await p.screenshot({path:out+'/nhactoi.jpg',type:'jpeg',quality:82,clip:box});
  await p.click('#rhn-pop li.new'); await p.waitForTimeout(300);
  const op=await p.evaluate(()=>window.__opened[0]||''); if(!/MMH-Event-MKTOnline\/#ev-EVMAU-1\/talk/.test(op)) fail('mở sai link: '+op);
  const n2=await p.$eval('#rhn-btn .rhn-n',x=>x.textContent).catch(()=>''); if(n2!=='1') fail('sau khi xem còn '+n2+' (cần 1)');
  if(p.errs.length) fail('lỗi trang: '+p.errs.join(' | '));
  await b.close(); console.log(ok?'OK v19.0':'FAIL v19.0'); process.exit(ok?0:1);
})();
