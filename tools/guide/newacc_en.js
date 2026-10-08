/* Trang "New accounts" trong HDSD toàn hệ thống tiếng Anh (buildcrm_en.js) — dùng chung na_slides.js */
module.exports = { slides: (k) => require('./na_slides')(Object.assign({}, require('./deckkit'), k), 'en', { mobile: false }) };
