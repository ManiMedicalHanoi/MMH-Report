/* Kiểm thử v18.9: bảng Cập nhật công việc + xem sub-task của người khác trong cùng key task */
const {chromium}=require('playwright'), path=require('path'), M=require('./mock.js');
async function page(b, o){
  const ctx=await b.newContext({viewport:{width:o.w||1920,height:o.h||1000},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'});
  const p=await ctx.newPage(); p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message));
  await p.addInitScript((o)=>{ if(sessionStorage.getItem('__i')) return; sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic',o.who); localStorage.setItem('mmh_src','marketing'); localStorage.setItem('mmh_dview',o.view||'table');
    if(o.tk) localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.'+o.tk,exp:Date.now()+864e5,user:{email:o.tk+'@mani.inc',local:o.tk,pic:o.who,level:o.lv||'pic',admin:o.tk==='mmh.product'}})); }, o);
  await p.clock.setFixedTime(new Date('2026-10-31T10:00:00+07:00'));
  await M.install(p,{noChecks:true});
  await p.goto('file://'+path.resolve(__dirname,'../../index.html'));
  await p.waitForFunction((w)=>window.S&&S.user&&S.user.pic===w&&document.getElementById('app').style.display==='block',o.who,{timeout:20000});
  await p.waitForTimeout(3000); await p.evaluate(()=>{ try{ if(window.UPD&&UPD.isOpen()) UPD.close(); }catch(_){} try{ NT.close&&NT.close(); NT.trips=[]; }catch(_){} document.querySelectorAll('#nt-letter').forEach(e=>e.remove()); });
  return p;
}
module.exports={page};
if(require.main===module)(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  for(const w of [1536,1280]){
    const p=await page(b,{who:'Minh Trang',tk:'mmh.trang',w,h:860});
    await p.evaluate(()=>{ try{ASG.close();}catch(_){} switchTab('detail'); setDetailTime('month'); });
    await p.waitForTimeout(1200);
    const r=await p.evaluate(()=>({name:Math.round(document.querySelector('.v10-tbl thead th.c-name').getBoundingClientRect().width),
      rows:[...document.querySelectorAll('.v10-tbl tbody tr[data-tno]')].map(r=>r.dataset.tno+(r.classList.contains('v189-oth')?'*':'')), ro:document.querySelectorAll('.v10-tbl td.c-pic[data-ro]').length}));
    console.log(w, JSON.stringify(r));
    if(r.name<260) fail(w+': cột Công việc quá hẹp '+r.name);
    if(!r.rows.includes('4.2*')||!r.ro) fail(w+': không thấy sub-task của Thuong (chỉ xem)');
    await p.click('#v189-team'); await p.waitForTimeout(300);
    if(await p.$('.v10-tbl tr.v189-oth')) fail(w+': tắt Xem cả key task vẫn hiện việc người khác');
    if(p.errs.length) fail('lỗi trang: '+p.errs.join(' | '));
    await p.context().close();
  }
  await b.close(); console.log(ok?'OK v18.9':'FAIL v18.9'); process.exit(ok?0:1);
})();
