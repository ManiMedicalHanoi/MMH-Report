/* Kiểm thử v20.0 — nút "Gửi email khảo sát" trên task Report Hub (SVM).
   Chạy: NODE_PATH=$(npm root -g) node tools/guide/t200.js [--shots] */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs'), M=require('./mock.js');
const http=require('http'), root=path.resolve(__dirname,'../..'), SHOTS=process.argv.includes('--shots');
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json'};
const srv=http.createServer((q,r)=>{ const f=path.join(root,decodeURIComponent(q.url.split('?')[0])); fs.readFile(f,(e,d)=>{ if(e){ r.writeHead(404); r.end(); } else { r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'}); r.end(d); } }); }).listen(8799);
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  const ctx=await b.newContext({viewport:{width:1440,height:900},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh',deviceScaleFactor:SHOTS?2:1});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ try{ if(sessionStorage.getItem('__i')) return; }catch(_){ return; } sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic','Giang'); localStorage.setItem('mmh_src','marketing');
    localStorage.setItem('mmh_upd_hide','1');
    localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.mmh.product',exp:Date.now()+90*864e5,user:{email:'mmh.product@manimedicalhanoi.com',local:'mmh.product',pic:'Giang',level:'lead',admin:true}})); });
  await M.install(p,{noChecks:true});
  await p.clock.install({time:new Date('2026-10-08T09:00:00+07:00')});
  await p.goto('http://127.0.0.1:8799/index.html');
  await p.waitForFunction(()=>window.S&&S.user&&S.user.pic==='Giang'&&document.getElementById('app').style.display==='block',null,{timeout:20000});
  await p.waitForTimeout(2500);
  await p.addStyleTag({content:'#kpn,#upd,#dl,#nt-letter,#asg-pop,#rhn-card{display:none!important}'});
  await p.evaluate(()=>{ document.querySelectorAll('dialog[open]').forEach(d=>d.close()); try{ UPD.close&&UPD.close(); }catch(_){} ['kpn','upd','dl','asg-pop','nt-pop'].forEach(id=>{ const e=document.getElementById(id); if(e) e.remove(); }); switchTab('detail'); });
  await p.waitForTimeout(1200);
  let n=await p.locator('.svm-btn').count();
  if(!(await p.locator('.svm-btn:visible').count())){ await p.evaluate(()=>{ try{ toggleDetail('4'); }catch(_){} }); await p.waitForTimeout(800); n=await p.locator('.svm-btn:visible').count(); }
  if(!n){ await p.evaluate(()=>{ try{ toggleShowAllSubs('4'); }catch(_){} }); await p.waitForTimeout(800); n=await p.locator('.svm-btn:visible').count(); }
  console.log('nút trên trang:', n); if(!n) fail('không thấy nút Gửi email khảo sát');
  const btn=p.locator('.svm-btn:visible').first(); await btn.scrollIntoViewIfNeeded();
  if(SHOTS) await p.screenshot({path:__dirname+'/shots/v200_row.png'});
  await btn.click(); await p.waitForSelector('#svm-send',{timeout:8000});
  console.log('email:', await p.textContent('#svm-ov .svm-mh'));
  if(SHOTS) await p.screenshot({path:__dirname+'/shots/v200_modal.png'});
  await p.click('#svm-send'); await p.waitForSelector('#svm-yes');
  if(SHOTS) await p.screenshot({path:__dirname+'/shots/v200_ask.png'});
  await p.click('#svm-yes'); await p.waitForSelector('#svm-ov .svm-ok',{timeout:8000});
  console.log('sau gửi:', (await p.textContent('#svm-ov .svm-c')).trim());
  if(SHOTS) await p.screenshot({path:__dirname+'/shots/v200_sent.png'});
  await p.click('#svm-ov .x'); await p.waitForTimeout(3500);
  const st=await p.evaluate(()=>{ let s=''; (S._allKeys||S.keyTasks||[]).forEach(k=>(k.subs||[]).forEach(x=>{ if(x.no==='4.5') s=x.status; })); return s; });
  console.log('task 4.5:', st); if(!/complet/i.test(st)) fail('task chưa Completed sau khi tải lại');
  if(errs.length){ console.log(errs); fail('lỗi JS'); }
  console.log(ok?'OK — tất cả kiểm tra đạt':'CÓ LỖI'); await b.close(); srv.close(); process.exit(ok?0:1);
})();
