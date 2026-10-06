/* Bộ dựng PDF hướng dẫn ngang 16:9 (1280×720) từ ảnh chụp thật + số chú thích + hyperlink.
   Mỗi bản HDSD = 1 file nội dung (vd. build_v1.3.js):
     const K = require('./deckkit'); K.KIT.app='Tên App'; K.KIT.ver='v1.3'; K.KIT.when='01/2026'; K.KIT.url='org.github.io/app';
     K.slide({ cls:'cover', bare:true, body:'…' });
     K.slide({ sec:'BƯỚC 1', title:'Thêm việc mới', sub:'…', body: K.two( K.steps(['Bấm <b>＋ Thêm việc</b>', '…']), K.fig({img:'main', w:620}) ) });
     K.writeDeck('HDSD Tên tính năng v1.3');
   Rồi:  node tools/guide/tojpg.js && node tools/guide/build_v1.3.js && PDF=1 node tools/guide/render.js  → tools/guide/out.pdf
   Kiểm tra tràn: render.js in "số slide:đáy nội dung" — đáy > 686 là tràn xuống footer ⇒ thu nhỏ ảnh (w / maxH) hoặc bớt chữ. */
const fs = require('fs');
const DIR = __dirname;
const J = n => JSON.parse(fs.readFileSync(DIR + '/shots/' + n + '.json', 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const KIT = { app: 'Web App', ver: 'v1.0', when: '', url: 'example.github.io/app', title: 'Hướng dẫn sử dụng' };
const L = {};                                   /* link nguồn dữ liệu: L.sheet = 'https://docs.google.com/…' — dùng a(L.sheet,'File …') */
const a = (href, txt) => `<a href="${href}">${txt || esc(href.replace(/^https:\/\//, ''))}</a>`;

/* ảnh chụp kèm số chú thích. o: {img, w, crop:[x,y,w,h] (0–1), frame:'browser'|'card'|'phone'|'none', map:{cũ:mới}, boxes:[n], pos:{n:'tr'}, maxH} */
function fig(o) {
  const meta = J(o.img), crop = o.crop || [0, 0, 1, 1];
  let W = o.w, H = W * (crop[3] * meta.h) / (crop[2] * meta.w);
  if (o.maxH && H > o.maxH) { W = W * o.maxH / H; H = o.maxH; }
  const iw = W / crop[2], ih = iw * meta.h / meta.w, map = o.map || null;
  const badges = meta.marks.filter(m => !map || map[m.n] !== undefined).map(m => {
    const n = map ? map[m.n] : m.n;
    const x = (m.x - crop[0]) / crop[2] * W, y = (m.y - crop[1]) / crop[3] * H, w = m.w / crop[2] * W, h = m.h / crop[3] * H;
    const pos = (o.pos && o.pos[m.n]) || m.pos;
    let bx = pos === 'tr' || pos === 'r' ? x + w : x, by = pos === 'l' || pos === 'r' ? y + h / 2 : y;
    bx = Math.max(13, Math.min(W - 13, bx)); by = Math.max(13, Math.min(H - 13, by));
    const box = (m.box || (o.boxes && o.boxes.includes(m.n))) ? `<i class="mk-box" style="left:${x - 4}px;top:${y - 4}px;width:${w + 8}px;height:${h + 8}px"></i>` : '';
    return box + `<b class="mk" style="left:${bx}px;top:${by}px">${n}</b>`;
  }).join('');
  const inner = `<div class="shot" style="width:${W}px;height:${H}px"><img src="shots/${o.img}.jpg" style="width:${iw}px;height:${ih}px;left:${-crop[0] * iw}px;top:${-crop[1] * ih}px">${badges}</div>`;
  const fr = o.frame || 'browser';
  if (fr === 'browser') return `<div class="fr-br" style="width:${W}px"><div class="fr-bar"><i></i><i></i><i></i><span>🔒 ${esc(KIT.url)}</span></div>${inner}</div>`;
  if (fr === 'phone') return `<div class="fr-ph">${inner}</div>`;
  if (fr === 'card') return `<div class="fr-card">${inner}</div>`;
  return inner;
}
const steps = arr => '<ol class="steps">' + arr.map((s, i) => { const n = Array.isArray(s) ? s[0] : i + 1, t = Array.isArray(s) ? s[1] : s; return `<li><b class="num">${n}</b><div>${t}</div></li>`; }).join('') + '</ol>';
const tip = (t, cls) => `<div class="tip ${cls || ''}">${t}</div>`;
const two = (left, right) => `<div class="two"><div class="col-t">${left}</div><div class="col-f">${right}</div></div>`;
let page = 0; const slides = [];
function slide(o) {
  page++;
  slides.push(`<section class="sl ${o.cls || ''}" style="--acc:${o.acc || '#4E7CAF'}">
  ${o.bare ? '' : `<header><div class="kick"><span class="sec">${o.sec || ''}</span>${o.kick ? `<span class="kk">${o.kick}</span>` : ''}</div><h2>${o.title}</h2>${o.sub ? `<p class="sub">${o.sub}</p>` : ''}<span class="pg">${page}</span></header>`}
  <div class="bd">${o.body}</div>
  ${o.bare ? '' : `<footer><span><b>${esc(KIT.app)}</b> ${esc(KIT.ver)}</span><span>${esc(KIT.title)}${KIT.when ? ' · ' + esc(KIT.when) : ''}</span></footer>`}
</section>`);
}
function writeDeck(title) {
  const css = fs.readFileSync(DIR + '/deck.css', 'utf8');
  fs.writeFileSync(DIR + '/deck.html', `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="stylesheet" href="fonts/fonts.css"><style>${css}</style></head><body>${slides.join('\n')}</body></html>`);
  console.log('slides', slides.length);
}
module.exports = { fs, DIR, J, esc, L, a, fig, steps, tip, two, slide, writeDeck, KIT };
