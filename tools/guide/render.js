const { chromium } = require('playwright'); process.chdir(__dirname); if(!require('fs').existsSync('prev')) require('fs').mkdirSync('prev');
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
  await p.goto('file://'+__dirname+'/deck.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(800);
  const n=await p.evaluate(()=>document.querySelectorAll('.sl').length);
  const sel=process.argv.slice(2).map(Number);
  for(let i=0;i<n;i++){ if(sel.length && !sel.includes(i+1)) continue; const el=(await p.$$('.sl'))[i]; await el.screenshot({path:'prev/s'+(i+1)+'.png'}); }
  // overflow check
  console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.sl')].map((s,i)=>{ const bd=s.querySelector('.bd'); const ft=s.querySelector('footer'); let max=0; bd.querySelectorAll('*').forEach(e=>{ const r=e.getBoundingClientRect(); if(r.height) max=Math.max(max,r.bottom-s.getBoundingClientRect().top); }); return (i+1)+':'+Math.round(max); }))));
  if(process.env.PDF){ await p.pdf({path:'out.pdf',width:'1280px',height:'720px',printBackground:true}); console.log('pdf ok'); }
  await b.close();
})();
