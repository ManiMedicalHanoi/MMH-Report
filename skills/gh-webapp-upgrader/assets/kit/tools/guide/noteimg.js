const { chromium } = require('playwright');
const OUT=require('path').resolve(process.argv[2]); process.chdir(__dirname);
let PICK=[];   /* [[số slide, thứ tự khung trong slide, "tên-file"], …] */
/* tuỳ chọn: node noteimg.js <thư mục ra> '[[số slide, thứ tự khung, "tên-file"], …]' */
if(process.argv[3]) PICK=JSON.parse(process.argv[3]);
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1.5});
  await p.goto('file://'+__dirname+'/deck.html'); await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(600);
  for(const [sl,i,name] of PICK){ const el=await p.evaluateHandle(([sl,i])=>document.querySelectorAll('.sl')[sl-1].querySelectorAll('.fr-br,.fr-card')[i],[sl,i]);
    await el.asElement().screenshot({path:OUT+'/'+name+'.jpg',type:'jpeg',quality:82}); }
  await b.close(); })();
