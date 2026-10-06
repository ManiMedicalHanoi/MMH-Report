/* Ghép ảnh theme thành lưới 2×2: node tools/guide/collage.js <ra.jpg> sage lavender sand rose (cần cảnh "theme" trong cap.js) */
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const ks=process.argv.slice(3), out=process.argv[2];
const NAMES={sage:'Lá xô thơm',lavender:'Oải hương',sand:'Be cát',rose:'Hồng phấn',ocean:'Biển sâu',slate:'Than chì',teal:'Ngọc bích',terracotta:'Đất nung',forest:'Rừng thông'};
(async()=>{ const html=path.join(__dirname,'_c.html');
 fs.writeFileSync(html,`<body style="margin:0;background:#F3F5F8;font-family:Aptos,Segoe UI,sans-serif"><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px;width:1272px">${ks.map(k=>`<div style="background:#fff;border:1px solid #E6EAEF;border-radius:10px;overflow:hidden"><div style="height:340px;overflow:hidden"><img src="shots/theme_${k}.png" style="width:100%;display:block"></div><div style="padding:7px 12px;font-size:15px;font-weight:700;color:#22384D">${NAMES[k]}</div></div>`).join('')}</div></body>`);
 const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1300,height:400}}); await p.goto('file://'+html);
 await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
 const h=await p.evaluate(()=>document.body.firstChild.offsetHeight); await p.setViewportSize({width:1300,height:h});
 await p.screenshot({path:path.resolve(out),type:'jpeg',quality:82}); await b.close(); fs.unlinkSync(html); })();
