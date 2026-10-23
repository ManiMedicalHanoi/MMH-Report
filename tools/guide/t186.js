/* Kiểm thử v18.6: Thống kê gửi báo cáo (rpstat.js) + email tự đánh giá quý */
const {chromium}=require('playwright'), path=require('path'), M=require('./mock.js');
async function page(b, o){
  const ctx=await b.newContext({viewport:{width:1440,height:900},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh',acceptDownloads:true});
  const p=await ctx.newPage(); p.errs=[]; p.on('pageerror',e=>p.errs.push(e.message));
  await p.addInitScript((o)=>{ if(sessionStorage.getItem('__i')) return; sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic',o.who); localStorage.setItem('mmh_src','marketing');
    if(o.tk) localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.'+o.tk,exp:Date.now()+864e5,user:{email:o.tk+'@mani.inc',local:o.tk,pic:o.who,level:o.lv||'pic',admin:o.tk==='mmh.product'}})); }, o);
  await p.clock.setFixedTime(new Date('2026-10-24T10:00:00+07:00'));
  await M.install(p,{noChecks:true});
  await p.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/xlsx/, r=>r.fulfill({status:200,contentType:'application/javascript',body:require('fs').readFileSync(process.env.XLSX_JS||'/home/user/Theo-doi-hanh-kiem-11D3-nam-hoc-2026-2027/vendor/xlsx.full.min.js','utf8')}));
  await p.goto('file://'+path.resolve(__dirname,'../../index.html'));
  await p.waitForFunction((w)=>window.S&&S.user&&S.user.pic===w&&document.getElementById('app').style.display==='block',o.who,{timeout:20000});
  await p.waitForTimeout(3500); await p.evaluate(()=>{ try{ if(window.UPD&&UPD.isOpen()) UPD.close(); }catch(_){} try{ NT.close&&NT.close(); NT.trips=[]; }catch(_){} document.querySelectorAll('#nt-letter').forEach(e=>e.remove()); });
  return p;
}
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  /* 1. Admin: có nút, đọc 8 nguồn, Excel */
  const p=await page(b,{who:'Giang',tk:'mmh.product'});
  if(!await p.$('#tb-tools #rps-btn')) fail('Admin không thấy nút Thống kê báo cáo');
  await p.click('#rps-btn');
  await p.waitForFunction(()=>document.getElementById('rps-xls')&&!document.getElementById('rps-xls').disabled,null,{timeout:30000});
  const sum=await p.evaluate(()=>document.getElementById('rps-out').innerText);
  console.log(sum.replace(/\n+/g,' | ').slice(0,400));
  const R=await p.evaluate(()=>{ const R=RPSTAT._st.R, g=n=>R.list.find(x=>x.p.pic===n);
    const w=x=>x?x.W.filter(j=>j.k!=='na'&&j.k!=='wait').map(j=>j.mon+':'+j.k).join(','):'(none)';
    return { n:R.list.length, giang:w(g('Giang')), trang:w(g('Minh Trang')), miew:w(g('Miew'))+' cal='+(g('Miew')||{p:{}}).p.cal, kpiG:g('Giang').K.map(j=>j.ym+':'+j.k).join(','), kpiT:g('Minh Trang').K.map(j=>j.ym+':'+j.k).join(','), q:g('Giang').Q.map(j=>j.per+':'+j.k).join(',') }; });
  console.log(R);
  if(!/2026-10-05:late/.test(R.giang)||!/2026-10-12:ok/.test(R.giang)||!/2026-10-19:ok/.test(R.giang)) fail('Giang tuần sai');
  if(!/2026-10-12:late/.test(R.trang)||!/2026-10-19:miss/.test(R.trang)) fail('Minh Trang tuần sai');
  if(!/2026-10-19:late/.test(R.miew)||!/cal=TH/.test(R.miew)) fail('Miew (TH) sai');
  if(!/202609:ok/.test(R.kpiG)||!/202609:late/.test(R.kpiT)) fail('KPI tháng sai');
  const [dl]=await Promise.all([p.waitForEvent('download',{timeout:30000}), p.click('#rps-xls')]);
  const fp=path.resolve(__dirname,'out_rpstat.xlsx'); await dl.saveAs(fp); console.log('excel:',dl.suggestedFilename());
  const info=await p.evaluate(async(b64)=>{ const wb=XLSX.read(b64,{type:'base64'}); const o={}; wb.SheetNames.forEach(n=>{ o[n]=XLSX.utils.sheet_to_json(wb.Sheets[n],{header:1}).slice(0,4); }); return o; }, require('fs').readFileSync(fp).toString('base64'));
  Object.keys(info).forEach(n=>console.log('#',n,JSON.stringify(info[n]).slice(0,300)));
  if(Object.keys(info).length!==7) fail('Excel thiếu sheet');
  /* 2. Email tự đánh giá quý: giả lập form #se + nút Tải (seDownload) */
  await p.evaluate(()=>{ document.querySelectorAll('.rps-ov').forEach(o=>o.classList.remove('show'));
    const o=document.createElement('div'); o.id='se'; o.innerHTML='<div class="kx-ft"><button id="se-dl">Tải</button></div>'; document.body.appendChild(o);
    document.getElementById('se-dl').onclick=function(){ const x={blob:new Blob(['docx'],{type:'application/octet-stream'}),nm:'Giang-Setting_Expectation-Term_68_Q1.docx',pic:'Giang',fy:68,q:'Q1',qm:['202609','202610','202611'],name:'Nguyen Giang'};
      if(window.SE_NODL){ window.SE_NODL=0; window.SE_ONBUILT&&SE_ONBUILT(x); } }; });
  await p.waitForSelector('#se-mail',{timeout:5000}).catch(()=>fail('Không có nút Gửi email ở form tự đánh giá'));
  await p.evaluate(()=>document.getElementById('se-mail').click()); await p.waitForSelector('#rps-se.show',{timeout:5000});
  await p.waitForFunction(()=>document.getElementById('rse-to').value==='hod@example.com',null,{timeout:8000}).catch(()=>fail('Không tự điền người nhận'));
  await p.click('#rse-send'); await p.waitForTimeout(1500);
  const se=M.RPLOG[M.RPLOG.length-1]||{}; console.log('rhSeSend:',se.pic,se.fy,se.q,se.to,se.name,(se.b64||'').length);
  if(se.q!=='Q1'||se.to!=='hod@example.com'||!se.b64) fail('rhSeSend sai');
  if(p.errs.length) fail('lỗi trang: '+p.errs.join(' | '));
  /* 3. PIC thường: không có nút */
  const p2=await page(b,{who:'Minh Trang',tk:'mmh.trang'});
  if(await p2.$('#rps-btn')) fail('PIC thường thấy nút Thống kê');
  await b.close(); console.log(ok?'OK v18.6':'FAIL v18.6'); process.exit(ok?0:1);
})();
