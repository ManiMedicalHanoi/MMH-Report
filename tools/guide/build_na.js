/* HDSD cập nhật CRM v30.5 — MỞ MỚI ĐỊA BÀN & SKU MỚI (2 bản: LANG=vi | LANG=en)
   Chạy: LANG=vi node tools/guide/build_na.js → PDF=1 node tools/guide/render.js → MMH-CRM/docs/HD_Mo_moi_SKU_moi_v30.5_VN.pdf
         LANG=en …                                                         → MMH-CRM/docs/Guide_New_accounts_v30.5_EN.pdf */
const K = require('./deckkit'); const lang = process.env.LANG === 'en' ? 'en' : 'vi';
K.KIT.ver = 'v30.5'; K.KIT.app = 'MMH CRM'; K.KIT.host = 'manimedicalhanoi.github.io/MMH-CRM'; K.KIT.when = '10/2026';
K.KIT.foot = lang === 'en' ? 'Update guide' : 'Hướng dẫn cập nhật';
require('./na_slides')(K, lang, { cover: true, end: true });
K.writeDeck(lang === 'en' ? 'Guide New accounts v30.5' : 'HD Mở mới v30.5');
