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
 {no:'4',row:40,keyTask:'20261019 Dental Products_Seminar_Dr. Nguyen Thanh Dung, Dr. Hau_Ho Chi Minh',pic:'Thuong',status:'On going',type:'Event',start:'2026-10-01',planned:'2026-10-19',subs:[
   {no:'4.1',row:41,subTask:'Truyền thông: Agenda sự kiện',pic:'Minh Trang',status:'Not started',start:'2026-10-06',planned:'2026-10-08'},
   {no:'4.2',row:42,subTask:'Đặt phòng hội thảo',pic:'Thuong',status:'On going',start:'2026-10-05',planned:'2026-10-09'}]},
 {no:'3',row:30,keyTask:'Weekly report & meeting',pic:'Giang',status:'On going',type:'Routine',start:'2026-10-05',planned:'2026-10-09',subs:[
   {no:'3.1',row:31,subTask:'Weekly meeting Sales & Marketing',pic:'Giang',status:'Completed',start:'2026-10-05',planned:'2026-10-05'}]},
];
const ROSTER=require('./roster.json');
/* ★ v15.5 — giả lập Training Hub v3.12: việc được giao (rhAssign*) */
const ASSIGN=[{id:'A2610060901',createdAt:'2026-10-06 09:01',src:'marketing',no:'4.1',name:'Truyền thông: Agenda sự kiện',keyTask:'20261019 Dental Products_Seminar_Dr. Nguyen Thanh Dung, Dr. Hau_Ho Chi Minh',pic:'Minh Trang',assigner:'Thuong',start:'2026-10-06',due:'2026-10-08',seen:false,done:false},
  {id:'A2610020800',createdAt:'2026-10-02 08:00',src:'marketing',no:'2.2',name:'Review spec chỉ khâu với NPP I Care',keyTask:'Ophthalmic — tender FY68',pic:'Giang',assigner:'Tuyen',start:'2026-10-07',due:'2026-10-08',seen:true,done:false}];
const LOG=[];
/* ★ v15.5 — giả lập MMH Calendar Feed v3.2: danh mục chọn + ghi dữ liệu Marketing */
const MKOPT={
  offline:{type:['Seminar','Workshop','Exhibition','Presentation','Webinar'],prod:['Jizai','Composite','Dental Products','Acrylic','Dental Suture',"Bleach'N Shine",'Ophthalmic Suture','Ophthalmic knife','Ophthalmic Products'],
    seg:['Dental/MMG','Surgical/Eyeless'],place:['Hanoi','Hai Phong','Hue','Da Nang','Ho Chi Minh','Can Tho','Nghe An','Quang Ninh'],plan:['Fixed','Not yet fixed'],action:['As planned','Change schedule','Additional','Cancel']},
  event:{format:['Design post','Photo','Video','Reels','Album'],pillar:['Before event','At event','After event','Seasonal'],page:['Mani Dental','Mani Ophthalmic','Mani Thailand'],
    status:['Cancel','Phát sinh','Pending','On air đúng hạn','On air muộn','Chờ duyệt'],kol:['Dr. Lam Dai Phong','Dr. Nguyen Thanh Dung','Dr. Dinh Vu Hieu'],event:['20260927 Jizai_Seminar_Dr. Nguyet Anh, Dr. Phong_Ho Chi Minh','20261019 Dental Products_Seminar_Dr. Nguyen Thanh Dung, Dr. Hau_Ho Chi Minh','20261026-29 Jizai_Workshop_Contemporary Endodontics_Hanoi']},
  product:{ptype:['Burs','Composite','Endo','Dental Suture','Ophthalmic Knife','Ophthalmic Suture'],pillar:['Feature & Benefit','Promotion','Clinical case','How to use'],format:['Design post','Photo','Video','Reels'],
    reason:['New product','Clear stock','Push sales','Brand awareness'],page:['Mani Dental','Mani Ophthalmic'],status:['Cancel','Phát sinh','Pending','On air đúng hạn','On air muộn','Chờ duyệt']}
};
function ymdIso(s){ s=String(s||''); const m=s.match(/^(\d{4})(\d{2})(\d{2})(?:-(\d{2,4}))?/); if(!m) return ['','']; const a=m[1]+'-'+m[2]+'-'+m[3]; let b=a; if(m[4]) b=m[4].length===4?m[1]+'-'+m[4].slice(0,2)+'-'+m[4].slice(2):m[1]+'-'+m[2]+'-'+m[4]; return [a,b]; }
function mkWrite(body){
  const kind=body.kind, op=body.op, data=JSON.parse(body.data||'{}'), src=kind==='offline'?'off':'on', list=D[src].events;
  let row=+body.row||0, it=null;
  if(op==='add'){ row=Math.max(0,...list.filter(x=>kind==='offline'||x.kind===kind).map(x=>x.row))+1; it={kind:kind==='offline'?'offline':kind,row}; list.push(it); }
  else { it=list.find(x=>x.row===row&&(kind==='offline'||x.kind===kind)); if(!it) return {ok:false,error:'Không tìm thấy dòng '+row}; }
  if(op==='delete'){ D[src].events=list.filter(x=>x!==it); return {ok:true,op,kind,row,src:kind==='offline'?'offline':'online',data:D[src]}; }
  const M={offline:{type:'type',prod:'product',seg:'segment',place:'place',topic:'topic',kol:'kol',partner:'partner',plan:'planStatus',action:'actionStatus',tPart:'targetParticipant',tJizai:'targetJizai',tComp:'targetComposite',aSales:'actualSales',folder:'folder',review:'review'},
    event:{event:'event',ctype:'ctype',kol:'kol',format:'format',pillar:'pillar',page:'page',status:'status',plan:'planned',actual:'actual',link:'link',main:'main',note:'note'},
    product:{topic:'topic',ptype:'ptype',pillar:'pillar',format:'format',reason:'reason',page:'page',status:'status',plan:'planned',actual:'actual',link:'link',main:'main'}}[kind];
  Object.keys(data).forEach(k=>{ if(M[k]) it[M[k]]=data[k]; });
  if(data.month) it.month=data.month.slice(0,4)+'-'+data.month.slice(4);
  if(kind==='offline'){ if(data.date){ const [a,b]=ymdIso(data.date); it.date=a; it.endDate=b; } it.status=/cancel/i.test(it.actionStatus||'')?'Cancel':(/^fixed$/i.test(it.planStatus||'')?'Fixed':(it.planStatus||'Plan'));
    it.title=[it.product,it.type,it.kol,it.place].filter(Boolean).join('_'); it.fullName=(it.date||'').replace(/-/g,'')+' '+it.title; }
  else { it.date=it.actual||it.planned||''; it.design=/design/i.test(it.format||''); it.title=kind==='event'?((it.ctype?it.ctype+' · ':'')+(it.event||'').replace(/^\d{8}(?:\s*-\s*\d{2,4})?\s*/,'')):(it.topic||it.ptype); }
  return {ok:true,op,kind,row,src:kind==='offline'?'offline':'online',data:D[src]};
}

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
    else if(a==='addSub') d={ok:true,no:'1.3',row:13,task:{}};
    else if(a==='mmhOptions') d={ok:true,kind:body.kind,options:MKOPT[body.kind]||{}};
    else if(a==='mmhWrite'){ LOG.push(['mk',{op:body.op,kind:body.kind,row:body.row,check:body.check,actor:body.actor,data:JSON.parse(body.data||'{}')}]); d=mkWrite(body); }
    else if(a==='rhAssignList'){ const me=(body.actor||'').toLowerCase(); d={ok:true,items:ASSIGN,mine:ASSIGN.filter(x=>x.pic.toLowerCase()===me&&!x.done)}; }
    else if(a==='rhAssignAdd'){ LOG.push(['add',body]); const id='A'+Date.now(); ASSIGN.push({id,createdAt:'2026-10-06 10:00',src:body.src,no:body.no,name:body.name,keyTask:body.keyTask,pic:body.pic,assigner:body.actor,start:body.start,due:body.due,seen:false,done:false}); d={ok:true,id}; }
    else if(a==='rhAssignSeen'){ LOG.push(['seen',body]); String(body.ids||'').split(',').forEach(id=>{ const x=ASSIGN.find(y=>y.id===id); if(x) x.seen=true; }); d={ok:true}; }
    else if(a==='rhAssignDone'){ LOG.push(['done',body]); const sent=[]; String(body.ids||'').split(',').forEach(id=>{ const x=ASSIGN.find(y=>y.id===id); if(x&&!x.done){ x.done=true; sent.push(id); } }); d={ok:true,sent}; }
    else if(a==='tripMaster') d={ok:true,to:'Nguyen Ha (Director)',cc:'Tuyen (HOD)',master:{destinations:['Ho Chi Minh','Da Nang','Nghe An','Can Tho','Hai Phong','Lao Cai','Dak Lak'],coTravelers:['Khang','Thuong','Tuyen','Viet Ha','Bui Trang'],equipment:['Laptop','Máy chiếu','Standee','Hàng mẫu']}};
    else if(a==='tripInfo') d=tripInfo(body.r||body.id);
    else if(a==='version'||a==='ping') d={ok:true};
    if(req.method()==='POST') return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(d)});
    return route.fulfill({status:200,contentType:'application/javascript',body:(cb||'cb')+'('+JSON.stringify(d)+');'});
  });
}
module.exports={install,D,SESS,ASSIGN,LOG};
