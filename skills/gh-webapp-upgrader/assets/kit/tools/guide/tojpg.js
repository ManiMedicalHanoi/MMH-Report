const { chromium } = require('playwright'); const fs=require('fs'); process.chdir(__dirname);
(async()=>{ const b=await chromium.launch(); const p=await b.newPage();
  for(const f of fs.readdirSync('shots').filter(x=>x.endsWith('.png'))){
    const j=JSON.parse(fs.readFileSync('shots/'+f.replace('.png','.json'))); const w=Math.round(j.w*2), h=Math.round(j.h*2);
    await p.setViewportSize({width:w,height:h});
    fs.writeFileSync(__dirname+'/_v.html',`<body style="margin:0"><img src="shots/${f}" style="display:block;width:${w}px;height:${h}px"></body>`);
    await p.goto('file://'+__dirname+'/_v.html'); await p.waitForFunction(()=>document.images[0].complete&&document.images[0].naturalWidth>0);
    await p.screenshot({path:'shots/'+f.replace('.png','.jpg'),type:'jpeg',quality:84});
  } await b.close(); })();
