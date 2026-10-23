/* Ảnh phát hành v18.6 / CRM v33.3 — hộp Thống kê gửi báo cáo + Gửi email tự đánh giá (dữ liệu giả) */
const {chromium}=require('playwright'), path=require('path'), M=require('./mock.js');
(async()=>{
  const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1300,height:860},deviceScaleFactor:1,locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'});
  const p=await ctx.newPage();
  await p.addInitScript(()=>{ if(sessionStorage.getItem('__i')) return; sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic','Giang'); localStorage.setItem('mmh_src','marketing');
    localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.mmh.product',exp:Date.now()+864e5,user:{email:'mmh.product@mani.inc',local:'mmh.product',pic:'Giang',level:'pic',admin:true}})); });
  await p.clock.setFixedTime(new Date('2026-10-24T10:00:00+07:00'));
  await M.install(p,{noChecks:true});
  await p.goto('file://'+path.resolve(__dirname,'../../index.html'));
  await p.waitForFunction(()=>window.S&&S.user&&document.getElementById('app').style.display==='block',null,{timeout:20000});
  await p.waitForTimeout(3500); await p.evaluate(()=>{ try{ UPD.close(); }catch(_){} try{ NT.close(); NT.trips=[]; }catch(_){} document.querySelectorAll('#nt-letter').forEach(e=>e.remove()); });
  const out=process.argv[2]||'updates/v18.6';
  for(const lang of ['vi','en']){
    await p.evaluate(l=>{ RPSTAT_CFG.lang=()=>l; document.querySelectorAll('.rps-ov').forEach(o=>o.classList.remove('show')); RPSTAT.open(); }, lang);
    await p.waitForFunction(()=>!document.getElementById('rps-xls').disabled,null,{timeout:30000}); await p.waitForTimeout(300);
    await p.evaluate(()=>{ const r=document.querySelector('#rps-ov .rps-card').getBoundingClientRect(); window.__c={x:r.left-14,y:r.top-14,width:r.width+28,height:r.height+28}; });
    const c=await p.evaluate(()=>window.__c);
    await p.screenshot({path:path.resolve(out, lang==='vi'?'v186stat.jpg':'v186stat_en.jpg'),type:'jpeg',quality:82,clip:c});
  }
  /* hộp gửi email tự đánh giá (giả lập file Word vừa tạo) */
  await p.evaluate(()=>{ RPSTAT_CFG.lang=()=>'vi'; document.querySelectorAll('.rps-ov').forEach(o=>o.classList.remove('show'));
    const o=document.createElement('div'); o.id='se'; o.style.display='none'; o.innerHTML='<div class="kx-ft"><button id="se-dl">Tải</button></div>'; document.body.appendChild(o);
    document.getElementById('se-dl').onclick=function(){ const x={blob:new Blob(['x']),nm:'Nguyen_Giang-Setting_Expectation-Term_68_Q1.docx',pic:'Giang',fy:68,q:'Q1',qm:['202609','202610','202611'],name:'Nguyen Giang'}; if(window.SE_NODL){ SE_NODL=0; SE_ONBUILT(x); } }; });
  await p.waitForSelector('#se-mail',{state:'attached'}); await p.evaluate(()=>document.getElementById('se-mail').click());
  await p.waitForFunction(()=>document.getElementById('rse-to')&&document.getElementById('rse-to').value,null,{timeout:8000}); await p.waitForTimeout(300);
  const c2=await p.evaluate(()=>{ const r=document.querySelector('#rps-se .rps-card').getBoundingClientRect(); return {x:r.left-14,y:r.top-14,width:r.width+28,height:r.height+28}; });
  await p.screenshot({path:path.resolve(out,'v186se.jpg'),type:'jpeg',quality:82,clip:c2});
  await b.close(); console.log('ok');
})();
