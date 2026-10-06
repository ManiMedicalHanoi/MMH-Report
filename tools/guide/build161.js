/* Ảnh thông báo v16.1 (Tìm nhanh) — node cap.js v161qs → tojpg.js → build161.js → noteimg.js updates/v16.1 '[[1,0,"tim-nhanh"],[2,0,"tim-viec"]]' */
const { fig, slide, writeDeck, KIT } = require('./deckkit');
KIT.ver = 'v16.1';
slide({ sec:'TÌM NHANH', title:'Tìm nhanh', body: fig({ img:'v161qs', w:1100, frame:'browser', crop:[0,0,0.75,0.72] }) });
slide({ sec:'TÌM NHANH', title:'Tìm việc', body: fig({ img:'v161task', w:900, frame:'browser', crop:[0.26,0.1,0.48,0.36] }) });
writeDeck('v16.1');
