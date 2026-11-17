/* Kiểm thử v19.8 — sửa liên tiếp không kéo theo tải lại cả danh sách sau mỗi lần (lrAfterWrite).
   Chạy: NODE_PATH=$(npm root -g) node tools/guide/t198.js */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs'), M=require('./mock.js');
const http=require('http'), root=path.resolve(__dirname,'../..');
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json'};
const srv=http.createServer((q,r)=>{ const f=path.join(root,decodeURIComponent(q.url.split('?')[0])); fs.readFile(f,(e,d)=>{ if(e){ r.writeHead(404); r.end(); } else { r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'}); r.end(d); } }); }).listen(8798);
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  const ctx=await b.newContext({viewport:{width:1440,height:900},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ try{ if(sessionStorage.getItem('__i')) return; }catch(_){ return; } sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic','Giang'); localStorage.setItem('mmh_src','marketing');
    localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.mmh.product',exp:Date.now()+90*864e5,user:{email:'mmh.product@manimedicalhanoi.com',local:'mmh.product',pic:'Giang',level:'lead',admin:true}})); });
  await M.install(p,{noChecks:true});
  const calls=[]; p.on('request',q=>{ const u=q.url(); if(/script\.google\.com/.test(u)){ const a=(u.match(/[?&]action=([^&]+)/)||[])[1]; calls.push([Date.now(),a]); } });
  await p.goto('http://127.0.0.1:8798/index.html');
  await p.waitForFunction(()=>window.S&&S.user&&S.user.pic==='Giang'&&document.getElementById('app').style.display==='block',null,{timeout:20000});
  await p.waitForTimeout(3000);
  const n=()=>calls.filter(c=>c[1]==='weekly').length;
  /* 3 lần sửa liên tiếp */
  const w0=n(); const t0=Date.now();
  await p.evaluate(async()=>{ for(const pr of [10,20,30]) await apiPost({action:'updateProgress',no:'1.1',progress:pr,pic:'Giang'}); });
  await p.waitForTimeout(3000);
  const w1=n()-w0; console.log('weekly sau 3 lần sửa (3 giây):', w1);
  if(w1!==0) fail('sửa liên tiếp vẫn tải lại cả danh sách ngay');
  await p.waitForTimeout(7000);
  const w2=n()-w0; console.log('weekly sau ~10 giây:', w2);
  if(w2!==1) fail('phải gộp còn đúng 1 lần đối chiếu, có '+w2);
  /* thêm sub ⇒ vẫn tải lại sớm */
  const a0=n();
  await p.evaluate(async()=>{ await apiPost({action:'addSub',keyNo:'1',name:'Thử v19.8',pic:'Giang',start:'2026-11-17',planned:'2026-11-17'}); });
  await p.waitForTimeout(2500);
  const a1=n()-a0; console.log('weekly sau thêm sub (2,5 giây):', a1); if(a1<1) fail('thêm mới phải tải lại sớm');
  if(errs.length){ console.log(errs); fail('lỗi JS'); }
  console.log(ok?'OK — tất cả kiểm tra đạt':'CÓ LỖI'); await b.close(); srv.close(); process.exit(ok?0:1);
})();
