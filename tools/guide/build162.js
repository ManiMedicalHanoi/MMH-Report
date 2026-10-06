/* Ảnh thông báo v16.2 (Phân quyền) — node cap.js v162adm → tojpg.js → build162.js → noteimg.js updates/v16.2 '[[1,0,"phan-quyen"],[2,0,"menu-phan-quyen"]]' */
const { fig, slide, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v16.2';
slide({ sec:'PHÂN QUYỀN', title:'Phân quyền', body: fig({ img:'v162adm', w:1150, frame:'browser' }) });
slide({ sec:'PHÂN QUYỀN', title:'Menu', body: fig({ img:'v162menu', w:700, frame:'browser', crop:[0.6,0,0.4,0.62] }) });
writeDeck('v16.2');
