/* Kiểm tra bài hướng dẫn (tour/tours.js): chạy MỌI bài với backend giả lập, báo bước nào không tìm thấy phần tử.
   Chạy: NODE_PATH=$(npm root -g) node tools/tour_check.js [--mobile] [id …]   ·  thoát mã 1 nếu có bước hỏng (để chặn push).
   Mỗi lần sửa / thêm chức năng ⇒ sửa tours.js cho khớp rồi chạy lại tới khi "Tất cả bài hướng dẫn đều khớp". */
const { chromium } = require("playwright"); const path=require("path");
process.chdir(path.join(__dirname,"guide")); const M=require("./guide/mock");
const ARGS=process.argv.slice(2), MOB=ARGS.includes("--mobile"), ONLY=ARGS.filter(a=>!a.startsWith("--"));   /* --mobile: khung điện thoại 390×844 */
(async()=>{
  const b=await chromium.launch(); const p=await (await b.newContext(MOB?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{viewport:{width:1440,height:900}})).newPage();
  const errs=[]; p.on("pageerror",e=>errs.push(e.message));
  await p.addInitScript(()=>{ if(sessionStorage.getItem("__i")) return; sessionStorage.setItem("__i",1);
    localStorage.setItem("mmh_pic","Giang"); localStorage.setItem("mmh_src","marketing");
    localStorage.setItem("mmh_tk",JSON.stringify({tk:"mocktk.mmh.product",exp:Date.now()+864e5,user:{email:"mmh.product@mani.inc",local:"mmh.product",pic:"Giang",level:"lead",admin:true}})); });
  await M.install(p,{});
  await p.goto("file://"+path.resolve(__dirname,"../index.html"));
  await p.waitForFunction(()=>window.S&&S.user&&document.getElementById("app").style.display==="block",null,{timeout:20000});
  await p.waitForTimeout(2500);
  await p.evaluate(()=>{ try{ UPD.close(); }catch(_){} try{ NT.close(); }catch(_){} });
  const ids=await p.evaluate(()=>TOUR.list().map(t=>t.id));
  const btn=await p.evaluate(()=>!!document.querySelector("[data-tour-btn]"));
  let bad=0;
  console.log("Nút Hướng dẫn:", btn?"có":"KHÔNG THẤY"); if(!btn) bad++;
  for(const id of ids){ if(ONLY.length && !ONLY.includes(id)) continue;
    const r=await p.evaluate(id=>TOUR.check(id), id);
    const steps=await p.evaluate(id=>{ const t=TOUR.list().filter(t=>t.id===id)[0]; return t.steps.filter(s=>{ try{ return !s.when||s.when(); }catch(_){ return false; } }).map(s=>typeof s.t==="string"?s.t:(s.t.vi||s.t.en)); }, id);
    if(r.miss && r.miss.length){ bad++; console.log("✗ "+id+": không thấy bước "+r.miss.map(i=>(i+1)+" ("+steps[i]+")").join(", ")); }
    else console.log("✓ "+id+" ("+r.steps+" bước)");
    await p.evaluate(()=>window.__tourClean&&__tourClean()); await p.waitForTimeout(300);
  }
  if(errs.length) console.log("Lỗi JavaScript:", errs.slice(0,5));
  console.log(bad?("Có "+bad+" bài cần sửa."):"Tất cả bài hướng dẫn đều khớp.");
  await b.close(); process.exit(bad?1:0);
})();
