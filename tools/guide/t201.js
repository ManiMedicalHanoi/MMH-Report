/* Kiểm thử v20.1 — sub-task / key task "đang lưu" KHÔNG bị nhân bản khi danh sách được tải lại trong lúc chờ lưu.
   Lỗi cũ: applyWeekly giữ bản tạm + overlay() của OUTBOX cũng thêm 1 bản ⇒ mỗi lần tải lại thêm 1 dòng trùng (cùng số tmp-…).
   Chạy: NODE_PATH=$(npm root -g) node tools/guide/t201.js */
const {chromium}=require('playwright'), path=require('path'), fs=require('fs'), M=require('./mock.js');
const http=require('http'), root=path.resolve(__dirname,'../..');
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json'};
const srv=http.createServer((q,r)=>{ const f=path.join(root,decodeURIComponent(q.url.split('?')[0])); fs.readFile(f,(e,d)=>{ if(e){ r.writeHead(404); r.end(); } else { r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'}); r.end(d); } }); }).listen(8799);
const BUSY=Array(40).fill('busy');
(async()=>{
  const b=await chromium.launch(); let ok=true; const fail=m=>{ ok=false; console.log('FAIL:',m); };
  const ctx=await b.newContext({viewport:{width:1440,height:900},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ try{ if(sessionStorage.getItem('__i')) return; }catch(_){ return; } sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic','Giang'); localStorage.setItem('mmh_src','marketing');
    localStorage.setItem('mmh_tk',JSON.stringify({tk:'mocktk.mmh.product',exp:Date.now()+90*864e5,user:{email:'mmh.product@manimedicalhanoi.com',local:'mmh.product',pic:'Giang',level:'lead',admin:true}})); });
  const flaky={addSub:BUSY.slice(), addKey:BUSY.slice()};
  await M.install(p,{noChecks:true, flaky});
  await p.goto('http://127.0.0.1:8799/index.html');
  await p.waitForFunction(()=>window.S&&S.user&&S.user.pic==='Giang'&&document.getElementById('app').style.display==='block',null,{timeout:20000});
  await p.waitForTimeout(2500);
  const cnt=()=>p.evaluate(()=>{ const c={sub:0,key:0}; const seen=new Set();
    (S._allKeys||[]).concat(S.keyTasks||[]).forEach(k=>{ if(seen.has(k)) return; seen.add(k); if(k.keyTask==='Key thử v20.1') c.key++; (k.subs||[]).forEach(s=>{ if((s.name||s.subTask)==='Sub thử v20.1') c.sub++; }); }); return c; });
  await p.evaluate(()=>{ doAddSub({kno:'1',name:'Sub thử v20.1',pic:'Giang',status:'To Do',start:'2026-11-21',planned:'2026-11-21'});
    doAddKey({name:'Key thử v20.1',type:'',pic:'Giang',start:'2026-11-21',planned:'2026-11-21'}); });
  await p.waitForTimeout(600);
  /* tải lại danh sách nhiều lần trong lúc lệnh còn chờ (máy chủ bận) — như mở trang Báo cáo tuần / dữ liệu mới từ máy chủ */
  for(let i=0;i<5;i++){ await p.evaluate(()=>apiGet('weekly',{fresh:1}).then(r=>applyWeekly(r.keyTasks,r.v))); await p.waitForTimeout(300); }
  const c1=await cnt(); console.log('trong lúc chờ lưu:',c1);
  if(c1.sub!==1) fail('sub-task đang lưu hiện '+c1.sub+' lần');
  if(c1.key!==1) fail('key task đang lưu hiện '+c1.key+' lần');
  const dom=await p.evaluate(()=>[...document.querySelectorAll('.sr-name')].filter(e=>/Sub thử v20.1/.test(e.textContent)).length);
  console.log('dòng trên màn hình:',dom); if(dom>1) fail('màn hình có '+dom+' dòng trùng');
  /* hết bận ⇒ lưu xong ⇒ còn đúng 1 */
  flaky.addSub.length=0; flaky.addKey.length=0;
  await p.evaluate(()=>OUTBOX.retry());
  await p.waitForFunction(()=>!OUTBOX.pending(),null,{timeout:90000});
  await p.waitForTimeout(3000);
  for(let i=0;i<2;i++){ await p.evaluate(()=>apiGet('weekly',{fresh:1}).then(r=>applyWeekly(r.keyTasks,r.v))); await p.waitForTimeout(300); }
  const c2=await cnt(); console.log('sau khi lưu xong:',c2);
  if(c2.sub!==1) fail('sau khi lưu xong sub hiện '+c2.sub+' lần');
  if(c2.key!==1) fail('sau khi lưu xong key hiện '+c2.key+' lần');
  const pend=await p.evaluate(()=>{ let n=0; (S.keyTasks||[]).forEach(k=>{ if(k.__pending) n++; (k.subs||[]).forEach(s=>{ if(s.__pending) n++; }); }); return n; });
  if(pend) fail('còn '+pend+' dòng "đang lưu"');
  if(errs.length){ console.log(errs); fail('lỗi JS'); }
  console.log(ok?'OK — tất cả kiểm tra đạt':'CÓ LỖI'); await b.close(); srv.close(); process.exit(ok?0:1);
})();
