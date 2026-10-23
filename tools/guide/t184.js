/* Kiểm thử v18.4: Gửi báo cáo tuần gửi kèm buổi đào tạo (trn) */
const {chromium}=require('playwright'), path=require('path'), M=require('./mock.js');
(async()=>{
  const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1400,height:900},locale:'vi-VN',timezoneId:'Asia/Ho_Chi_Minh'});
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ if(sessionStorage.getItem('__i')) return; sessionStorage.setItem('__i','1'); localStorage.setItem('mmh_pic','Giang'); localStorage.setItem('mmh_src','marketing'); });
  await p.clock.setFixedTime(new Date('2026-10-23T09:00:00+07:00'));
  const urls=[]; p.on('request',r=>{ const u=r.url(); if(/weeklyReport/.test(u)||(/script\.google/.test(u)&&/weeklyReport/.test(r.postData()||''))) urls.push(u+' '+(r.postData()||'')); });
  await M.install(p,{noChecks:true,extraSess:[
    {sid:'X1',date:'2026-10-21',timeFrom:'14:00',timeTo:'15:00',topic:'Buổi học thử',trainer:'Thuong',audience:'MMH - Marketing',status:'Plan',type:'Internal',category:'Skill',people:['Giang','Thuong']},
    {sid:'X2',date:'2026-10-28',timeFrom:'09:00',topic:'Giang dạy tuần sau',trainer:'Giang',audience:'MMH - Sales',status:'Plan',type:'Internal',category:'Product',people:['Giang']},
    {sid:'X3',date:'2026-10-22',topic:'Không liên quan',trainer:'Viet',status:'Plan',people:['Viet']} ]});
  await p.goto('file://'+path.resolve(__dirname,'../../index.html'));
  await p.waitForFunction(()=>window.S&&S.user&&S.user.pic==='Giang'&&document.getElementById('app').style.display==='block',null,{timeout:20000});
  await p.waitForTimeout(1500);
  await p.evaluate(()=>{ if(window.UPD&&UPD.isOpen&&UPD.isOpen()) UPD.close(); openSendReport(); });
  const note=await p.evaluate(()=>{ const n=document.querySelector('.v184-n'); return n&&n.textContent; });
  await p.evaluate(()=>doSendReport()); await p.waitForTimeout(3000);
  const u=urls.join('\n'); const m=decodeURIComponent(u);
  const ok=!!note && /Buổi học thử/.test(m) && /Giang dạy tuần sau/.test(m) && !/Không liên quan/.test(m) && /trnPic=Giang|"trnPic":"Giang"/.test(m);
  console.log('note:',note); console.log(m.slice(0,700)); console.log('errors:',errs); console.log(ok?'OK v18.4':'FAIL v18.4');
  await b.close(); process.exit(ok?0:1);
})();
