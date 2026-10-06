const fs=require('fs');
const D=JSON.parse(fs.readFileSync(__dirname+'/data.json','utf8'));
const ROSTER_NAMES={Giang:'mmh.product',Thuong:'mmh.marketing',Tuyen:'mmh.sales','Minh Trang':'mmh.admin',Khang:'mmh.saigon2','Viet Ha':'mmh.surgical',Vinh:'mmh.dental2',Phuong:'mmh.dental3',Viet:'mmh.dental','Duc Anh':'mmh.design','Bui Trang':'mmh.oem'};
const SESS=[
 {sid:'S20260925-01',date:'2026-09-25',timeFrom:'14:00',timeTo:'16:00',topic:'Ophthalmic Suture & Knife — kiến thức sản phẩm',trainer:'Giang',audience:'MMH - Surgical Sales team',status:'Done',type:'Internal',category:'Product',invited:true,canEdit:true,location:'Phòng họp tầng 5',folderUrl:'https://drive.google.com/drive/folders/demo1'},
 {sid:'S20261003-01',date:'2026-10-03',timeFrom:'09:00',timeTo:'10:30',topic:'Dia-burs IPR-01EF — case lâm sàng & USP',trainer:'Giang',audience:'MMH - Dental Sales team',status:'Done',type:'Internal',category:'Product',invited:true,canEdit:true,location:'Online · Google Meet',folderUrl:'https://drive.google.com/drive/folders/demo2'},
 {sid:'S20261008-01',date:'2026-10-08',timeFrom:'15:00',timeTo:'16:00',topic:'Quy trình đề xuất & báo cáo công tác trên Report Hub',trainer:'Thuong',audience:'MMH - Sales & Marketing',status:'Plan',type:'Internal',category:'SOP',invited:true,canEdit:false,location:'Phòng họp tầng 5',folderUrl:'https://drive.google.com/drive/folders/demo3'},
 {sid:'S20261014-01',date:'2026-10-14',timeFrom:'09:00',timeTo:'10:30',topic:'Mani Dental product — Key SKUs FY68',trainer:'Giang',audience:'MMH - Sales team',status:'Plan',type:'Internal',category:'Product',invited:false,canEdit:true,location:'Phòng họp tầng 5'},
 {sid:'S20261022-01',date:'2026-10-22',timeFrom:'14:00',timeTo:'15:30',topic:'Jizai — kỹ thuật nội nha cơ bản cho Sales',trainer:'Viet',audience:'MMH - Dental Sales team',status:'Plan',type:'Internal',category:'Product',invited:true,canEdit:false,location:'Lab Kim · Hà Nội',folderUrl:'https://drive.google.com/drive/folders/demo4'},
];
const FILES={
 'S20260925-01':[['Ophthalmic Suture — Product Guide FY68.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation','6.8 MB'],['Ophthalmic Knife — Catalogue.pdf','application/pdf','3.1 MB'],['Bài kiểm tra sau đào tạo','application/vnd.google-apps.form',''],['Ghi chú buổi học','application/vnd.google-apps.document','']],
 'S20261008-01':[['Hướng dẫn Business Trip trên Report Hub.pdf','application/pdf','2.4 MB'],['Mẫu báo cáo công tác','application/vnd.google-apps.document','']],
 'S20261022-01':[['Jizai — Endo basics.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation','12.6 MB']],
};
function mats(sid){ const f=(FILES[sid]||[]).map((x,i)=>({id:sid+'-'+i,name:x[0],mime:x[1],sizeText:x[2],url:'https://drive.google.com/file/d/'+sid+i+'/view',preview:'https://drive.google.com/file/d/'+sid+i+'/preview',download:'https://drive.google.com/uc?export=download&id='+sid+i}));
  return {ok:true,files:f,folderUrl:'https://drive.google.com/drive/folders/'+sid,canUpload:true}; }
const META={ok:true,me:{name:'Giang',email:'mmh.product@manimedicalhanoi.com',position:'Product Team Leader',canCreate:true},
  meta:{categories:['Product','SOP','Skill','Compliance'],types:['Internal','External'],trainers:['Giang','Thuong','Tuyen','Viet','Nguyen Ha'],locations:['Phòng họp tầng 5','Online · Google Meet','Lab Kim · Hà Nội']},
  groups:[{name:'MMH - Sales team',type:'group',count:9,emails:['a1','a2','a3','a4','a5','a6','a7','a8','a9'].map(x=>x+'@manimedicalhanoi.com')},{name:'MMH - Dental Sales team',type:'group',count:4,emails:[]},{name:'MMH - Surgical Sales team',type:'group',count:3,emails:[]},{name:'MMH - Marketing team',type:'group',count:5,emails:[]},{name:'MMH - Sales & Marketing',type:'group',count:14,emails:[]}],
  users:Object.keys(ROSTER_NAMES).map(n=>({name:n,email:ROSTER_NAMES[n]+'@manimedicalhanoi.com'}))};
function tripInfo(id){
  const t=D.trip.events.find(e=>String(e.row)===String(id)||String(e.id)===String(id))||D.trip.events.find(e=>e.pic==='Giang');
  return {ok:true,trip:{id:t.row,pic:t.pic,hubPic:t.pic,dest:t.destination,start:t.date,finish:t.endDate,days:t.days,co:t.coTraveler||'No',equip:t.equipment||'Laptop',purpose:t.purpose,expect:t.expected,schedule:t.schedule,
    estCost:'Vé máy bay: 4.200.000\nKhách sạn: 2.400.000\nDi chuyển & ăn uống: 1.850.000',total:t.costTotal,approval:t.status,approved:/approv/i.test(t.status),folder:t.folder,report:t.report||'',reportDate:t.reportDate||'',canReport:t.pic==='Giang'&&/approv/i.test(t.status),canEdit:false,canDelete:false}};
}
const KEY=[
 {no:'1',row:10,keyTask:'FY68 Product plan — Dental',pic:'Giang',status:'On going',type:'Plan',start:'2026-10-01',planned:'2026-10-31',progress:40,subs:[
   {no:'1.1',row:11,subTask:'Chốt danh mục Key SKUs Dental FY68',pic:'Giang',status:'On going',start:'2026-10-05',planned:'2026-10-07',progress:60},
   {no:'1.2',row:12,subTask:'Bảng giá & chính sách KM Q3',pic:'Giang',status:'Not started',start:'2026-10-08',planned:'2026-10-09'}]},
 {no:'2',row:20,keyTask:'Ophthalmic — tender FY68',pic:'Giang',status:'On going',type:'Tender',start:'2026-10-01',planned:'2026-10-20',subs:[
   {no:'2.1',row:21,subTask:'Hồ sơ thầu BV Mắt TW',pic:'Giang',status:'On going',start:'2026-10-06',planned:'2026-10-06'},
   {no:'2.2',row:22,subTask:'Review spec chỉ khâu với NPP I Care',pic:'Giang',status:'Not started',start:'2026-10-07',planned:'2026-10-08'}]},
 {no:'3',row:30,keyTask:'Weekly report & meeting',pic:'Giang',status:'On going',type:'Routine',start:'2026-10-05',planned:'2026-10-09',subs:[
   {no:'3.1',row:31,subTask:'Weekly meeting Sales & Marketing',pic:'Giang',status:'Completed',start:'2026-10-05',planned:'2026-10-05'}]},
];
const ROSTER=require('./roster.json');
async function install(page, o){
  o=o||{};
  await page.route(/script\.google\.com/, async route=>{
    const req=route.request(); const u=new URL(req.url()); let a=u.searchParams.get('action'); const src=u.searchParams.get('src'); const cb=u.searchParams.get('callback');
    let body=null;
    if(req.method()==='POST'){ const pd=new URLSearchParams(req.postData()||''); a=pd.get('action')||a; try{ body=JSON.parse(pd.get('payload')||'{}'); }catch(_){ body={}; } }
    else { body=Object.fromEntries(u.searchParams.entries()); }
    let d={ok:true,events:[]};
    if(src==='trip') d=D.trip; else if(src==='offline') d=D.off; else if(src==='online') d=D.on;
    else if(a==='calendar') d=D.trip;
    else if(a==='boot'||a==='weekly') d={ok:true,source:'marketing',picList:ROSTER,keyTasks:JSON.parse(JSON.stringify(KEY)),monthly:[],activityLog:[]};
    else if(a==='roster') d={ok:true,picList:ROSTER};
    else if(a==='rhMeta') d=META;
    else if(a==='rhSessions') d={ok:true,sessions:SESS.concat(o.extraSess||[])};
    else if(a==='rhMaterials') d=mats(body.sid||u.searchParams.get('sid'));
    else if(a==='rhMyChecks') d={ok:true,empty:o.noChecks?[]:[{sid:'S20261003-01',topic:'Dia-burs IPR-01EF — case lâm sàng & USP',date:'2026-10-03',due:'2026-10-04',overdue:true}]};
    else if(a==='rhSaveSession') d={ok:true,sid:'S20261014-01',message:'Đã tạo buổi đào tạo mới.'};
    else if(a==='rhPreviewInvite') d={ok:true,subject:'[MMH Training] Mani Dental product — Key SKUs FY68 · 14/10/2026',html:'<p>x</p>',recipients:['a']};
    else if(a==='rhSendInvite') d={ok:true,message:'Đã gửi thư mời tới 10 người',folderUrl:'https://drive.google.com/drive/folders/new'};
    else if(a==='tripMaster') d={ok:true,to:'Nguyen Ha (Director)',cc:'Tuyen (HOD)',master:{destinations:['Ho Chi Minh','Da Nang','Nghe An','Can Tho','Hai Phong','Lao Cai','Dak Lak'],coTravelers:['Khang','Thuong','Tuyen','Viet Ha','Bui Trang'],equipment:['Laptop','Máy chiếu','Standee','Hàng mẫu']}};
    else if(a==='tripInfo') d=tripInfo(body.r||body.id);
    else if(a==='version'||a==='ping') d={ok:true};
    if(req.method()==='POST') return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(d)});
    return route.fulfill({status:200,contentType:'application/javascript',body:(cb||'cb')+'('+JSON.stringify(d)+');'});
  });
}
module.exports={install,D,SESS};
