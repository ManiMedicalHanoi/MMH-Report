/* Kiểm thử + ảnh v19.6: báo cáo công tác — người báo cáo tự gửi email từ hộp thư (tripmail/tripmail.js). NODE_PATH=$(npm root -g) node tools/guide/t196.js [--shots] */
const {chromium}=require('playwright'), path=require('path'), M=require('./mock.js'); const {page}=require('./t189.js');
const SH=process.argv.includes('--shots'), out=path.resolve(__dirname,'../../updates/v19.6');
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  const p=await page(b,{who:'Giang',tk:'mmh.product',w:1440,h:900});
  await p.evaluate(()=>{ try{ASG.close();}catch(_){} window.__opened=[]; });
  const open=async(row)=>{ await p.evaluate((row)=>{ TR6={no:'x',id:String(row),r:row}; showModal('<div class="modal-box modal-lg" id="tr6"><div class="modal-head"><h3>Chuyến công tác</h3><button class="modal-close" onclick="closeModal()">✕</button></div><div class="modal-body"></div></div>');
      return tripCallHere({action:'tripInfo',id:String(row),r:row}).then(r=>tripViewPaint(r.trip)); }, row); await p.waitForTimeout(500); };
  /* 1) chuyến chưa có báo cáo: nhãn mới, lưu ⇒ khung gửi email */
  await open(999);
  const lb=await p.$eval('#tr6-mail',x=>x.closest('label').textContent).catch(()=>''); if(!/hộp thư của tôi/.test(lb)) fail('nhãn ô gửi email: '+lb);
  if(SH) await p.screenshot({path:out+'/form.jpg',type:'jpeg',quality:82,clip:await p.$eval('#tr6',x=>{const r=x.getBoundingClientRect();return{x:r.x,y:Math.max(0,r.bottom-420),width:r.width,height:Math.min(420,r.height)};})});
  await p.fill('#tr6-ka','Gặp 6 phòng khám, demo JIZAI'); await p.fill('#tr6-kf','2 phòng khám muốn dùng thử'); await p.fill('#tr6-fu','Gửi mẫu tuần sau');
  await p.click('#tr6-save'); await p.waitForSelector('#tpm-ov',{timeout:15000}).catch(()=>fail('không mở khung gửi email'));
  const rep=M.LOG.filter(x=>x[0]==='tripReport').pop(); if(!rep||rep[1].mailMode!=='self') fail('tripReport không gửi mailMode=self');
  const info=await p.evaluate(()=>({to:document.querySelectorAll('#tpm-ov .tpm-r div')[0].textContent, links:[...document.querySelectorAll('#tpm-ov a[data-k]')].map(a=>a.dataset.k+':'+(a.classList.contains('pri')?'pri':'')+':'+a.href.slice(0,60))}));
  console.log(JSON.stringify(info)); if(!/nt\.ha@/.test(info.to)) fail('To sai'); if(info.links.length!==3) fail('thiếu nút hộp thư');
  if(SH){ await p.waitForTimeout(400); await p.screenshot({path:out+'/gui-email.jpg',type:'jpeg',quality:82,clip:await p.$eval('#tpm-ov .tpm-box',x=>{const r=x.getBoundingClientRect();return{x:r.x-10,y:r.y-10,width:r.width+20,height:r.height+20};})}); }
  await p.click('#tpm-ov [data-a="done"]'); await p.waitForTimeout(500);
  if(await p.$('#tpm-ov')) fail('Đã gửi không đóng khung');
  if(!M.LOG.some(x=>x[0]==='tripReportSent')) fail('không gọi tripReportSent');
  /* 2) mở lại chuyến đã có báo cáo ⇒ dải "đã gửi" + Gửi lại; chuyến khác chưa gửi ⇒ Soạn email */
  await open(543);
  const bar2=await p.$eval('#tr6 .tpm-bar',x=>x.className+' | '+x.textContent).catch(()=>''); console.log('bar543:',bar2); if(!/Soạn email/.test(bar2)) fail('thiếu dải Soạn email');
  if(SH){ await p.evaluate(()=>document.querySelector('#tr6 .tpm-bar').scrollIntoView({block:'center'})); await p.waitForTimeout(200);
    await p.screenshot({path:out+'/dai-chua-gui.jpg',type:'jpeg',quality:82,clip:await p.$eval('#tr6 .tpm-bar',x=>{const r=x.getBoundingClientRect();return{x:r.x-20,y:r.y-170,width:r.width+40,height:r.height+190};})}); }
  await p.click('#tr6 .tpm-bar button'); await p.waitForSelector('#tpm-ov',{timeout:8000}).catch(()=>fail('Soạn email không mở khung'));
  await p.click('#tpm-ov [data-a="done"]'); await p.waitForTimeout(300); await p.evaluate(()=>closeModal()); await open(543);
  const bar3=await p.$eval('#tr6 .tpm-bar',x=>x.className+' | '+x.textContent).catch(()=>''); console.log('bar543 sau:',bar3); if(!/done/.test(bar3)||!/Gửi lại/.test(bar3)) fail('dải đã gửi sai');
  await p.click('#tr6 .tpm-bar button'); await p.waitForSelector('#tpm-ov',{timeout:8000});
  /* 3) nhờ hệ thống gửi thay */
  await p.click('#tpm-ov [data-a="sys"]'); await p.click('#tpm-ov [data-a="sysgo"]'); await p.waitForTimeout(800);
  const sys=M.LOG.filter(x=>x[0]==='tripReportSent').pop(); if(!sys||sys[1].system!=='1') fail('gửi thay không gửi system=1');
  /* điện thoại */
  const q=await page(b,{who:'Giang',tk:'mmh.product',w:390,h:844});
  await q.evaluate(()=>{ try{ASG.close();}catch(_){} TRIPMAIL.open({to:['nt.ha@manimedicalhanoi.com'],cc:['tt.tuyen@manimedicalhanoi.com'],subject:'Business Trip Report - Giang - Da Nang',html:'<p>Dear Ha-san,</p><p>Report…</p>'},{id:'1',row:1},{saved:true}); });
  await q.waitForTimeout(400); const ov=await q.$eval('#tpm-ov .tpm-box',x=>x.getBoundingClientRect().width); if(ov>390) fail('điện thoại tràn '+ov);
  if(SH) await q.screenshot({path:out+'/dien-thoai.jpg',type:'jpeg',quality:82});
  const E=p.errs.concat(q.errs).filter(e=>!/sandboxed/.test(e)); if(E.length) fail('lỗi trang: '+E.join(' | '));
  await b.close(); console.log(ok?'OK v19.6':'FAIL v19.6'); process.exit(ok?0:1);
})();
