const fs = require('fs');
const DIR = __dirname;
const J = n => JSON.parse(fs.readFileSync(DIR + '/shots/' + n + '.json', 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const L = {
  app: 'https://manimedicalhanoi.github.io/MMH-Report/',
  hub: 'https://manimedicalhanoi.github.io/Training-Hub/',
  trnSheet: 'https://docs.google.com/spreadsheets/d/1byCL6NjhqBuEcd-K5pxYRrQj2XXs6GMIvR79x45mHRQ',
  trip: 'https://docs.google.com/spreadsheets/d/15dAQYOG1aJRX-jByVmRFeSFOIPRtdVW7wDvwC_nxJUA',
  off: 'https://docs.google.com/spreadsheets/d/16vIDYRhm6Cj9DN4C26rvbBPW1hF3vAnZ7lgl6Bd02w8',
  on: 'https://docs.google.com/spreadsheets/d/1JbuvmdfJAX2f8fl49tpcJhgepyGLm81GOS4xXiEKSfc',
  hubApi: 'https://script.google.com/macros/s/AKfycbwsX4cQEoH4LNlmcNfe8qWIM9K6EiDEXy7PjhP9bHY2citL6xHn5L1unsAlQJHyL9EP/exec',
  feedOn: 'https://script.google.com/macros/s/AKfycbx-eZ0sORVEdQs_gh3mRwJJjmOROY2DuwiWdWNO_EjyNrIR8Nrq0rvkJhgO-x1V_ukQjA/exec',
  guide: 'https://drive.google.com/drive/folders/1qrY9IGdSRSOUZnIkJSvjLaEXYJceBfY6',
  feedOff: 'https://script.google.com/macros/s/AKfycbwvH5YqDfVkYLgJiF2x712-fVaQO1neggdE-7VGhOXgAofCv3wRproagHoFj7PBdnEftA/exec',
};
const a = (href, txt) => `<a href="${href}">${txt || esc(href.replace(/^https:\/\//, ''))}</a>`;

/* ── screenshot figure with numbered callouts ──
   o: {img, w (px on slide), crop:[x,y,w,h] fractions, frame:'browser'|'card'|'phone'|'none', keep:[n..] or map {old:new}, maxH} */
function fig(o) {
  const meta = J(o.img);
  const crop = o.crop || [0, 0, 1, 1];
  let W = o.w;
  let H = W * (crop[3] * meta.h) / (crop[2] * meta.w);
  if (o.maxH && H > o.maxH) { W = W * o.maxH / H; H = o.maxH; }
  const iw = W / crop[2], ih = iw * meta.h / meta.w;
  const map = o.map || null;
  let marks = meta.marks.filter(m => !map || map[m.n] !== undefined);
  const badges = marks.map(m => {
    const n = map ? map[m.n] : m.n;
    const x = (m.x - crop[0]) / crop[2] * W, y = (m.y - crop[1]) / crop[3] * H;
    const w = m.w / crop[2] * W, h = m.h / crop[3] * H;
    const pos = (o.pos && o.pos[m.n]) || m.pos;
    let bx = pos === 'tr' ? x + w : pos === 'l' ? x : x, by = pos === 'l' ? y + h / 2 : y;
    if (pos === 'r') { bx = x + w; by = y + h / 2; }
    bx = Math.max(13, Math.min(W - 13, bx)); by = Math.max(13, Math.min(H - 13, by));
    const box = (m.box || (o.boxes && o.boxes.includes(m.n))) ? `<i class="mk-box" style="left:${x - 4}px;top:${y - 4}px;width:${w + 8}px;height:${h + 8}px"></i>` : '';
    return box + `<b class="mk" style="left:${bx}px;top:${by}px">${n}</b>`;
  }).join('');
  const inner = `<div class="shot" style="width:${W}px;height:${H}px"><img src="shots/${o.img}.jpg" style="width:${iw}px;height:${ih}px;left:${-crop[0] * iw}px;top:${-crop[1] * ih}px">${badges}</div>`;
  const fr = o.frame || 'browser';
  if (fr === 'browser') return `<div class="fr-br" style="width:${W}px"><div class="fr-bar"><i></i><i></i><i></i><span>🔒 ${KIT.host || 'manimedicalhanoi.github.io/MMH-Report'}</span></div>${inner}</div>`;
  if (fr === 'phone') return `<div class="fr-ph">${inner}</div>`;
  if (fr === 'card') return `<div class="fr-card">${inner}</div>`;
  return inner;
}

const steps = (arr) => '<ol class="steps">' + arr.map((s, i) => {
  const n = Array.isArray(s) ? s[0] : i + 1, t = Array.isArray(s) ? s[1] : s;
  return `<li><b class="num">${n}</b><div>${t}</div></li>`;
}).join('') + '</ol>';

let page = 0;
let slides = [];
function slide(o) {
  page++;
  slides.push(`<section class="sl ${o.cls || ''}" style="--acc:${o.acc || '#4E7CAF'}">
  ${o.bare ? '' : `<header><div class="kick"><span class="sec">${o.sec || ''}</span>${o.kick ? `<span class="kk">${o.kick}</span>` : ''}</div><h2>${o.title}</h2>${o.sub ? `<p class="sub">${o.sub}</p>` : ''}<span class="pg">${page}</span></header>`}
  <div class="bd">${o.body}</div>
  ${o.bare ? '' : `<footer><span><b>MANI</b> ${KIT.app || 'MMH Report Hub'} · ${KIT.ver}</span><span>${KIT.foot || 'Hướng dẫn cập nhật'} · ${KIT.when}</span></footer>`}
</section>`);
}
const tip = (t, cls) => `<div class="tip ${cls || ''}">${t}</div>`;

const KIT = { ver:'v15.2', when:'10/2026' };
/** Ghi deck.html (title = tiêu đề tab trình duyệt / PDF) */
function writeDeck(title) {
  const css = fs.readFileSync(DIR + '/deck.css', 'utf8');
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${title}</title>
<link rel="stylesheet" href="fonts/fonts.css"><style>${css}</style></head><body>${slides.join('\n')}</body></html>`;
  fs.writeFileSync(DIR + '/deck.html', html);
  console.log('slides', slides.length);
}
module.exports = { fs, DIR, J, esc, L, a, fig, steps, slide, tip, writeDeck, KIT };
