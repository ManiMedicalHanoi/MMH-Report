/* Chụp ảnh THẬT từ app (dữ liệu giả lập) để làm thông báo cập nhật & PDF hướng dẫn.
   Chạy:  NODE_PATH=$(npm root -g) node tools/guide/cap.js [tên cảnh …]   → ảnh ở tools/guide/shots/<tên>.png + .json (vị trí số chú thích)
   Thêm cảnh: S.tenCanh = async b => { const p = await newPage(b, {...}); …thao tác…; await shot(p, 'ten', {clip:'#selector', marks:[[sel, số, 'tl'|'tr', khung?]]}); };
   Backend giả lập: sửa HANDLERS / DB bên dưới (hoặc tách ra mock.js). Không gọi được script.google.com thật trong môi trường build. */
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
process.chdir(__dirname); if (!fs.existsSync('shots')) fs.mkdirSync('shots');
const M = require('./mock_gas');
const APP = path.resolve(__dirname, '../../index.html');
const ONLY = process.argv.slice(2);
const W = 1440, H = 860;

/* ── dữ liệu & backend giả lập — CHỈNH CHO APP CỦA BẠN ── */
const DB = fs.existsSync(__dirname + '/data.json') ? JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8')) : { items: [] };
const HANDLERS = {
  boot: (b, ctx) => ({ ok: true, items: ctx.view.items || [] }),
  version: () => ({ ok: true, v: 'mock' }),
};

async function newPage(b, o) {
  o = o || {};
  const ctx = await b.newContext({ viewport: o.vp || { width: W, height: H }, deviceScaleFactor: 2, locale: o.locale || 'vi-VN',
    timezoneId: o.tz || 'Asia/Ho_Chi_Minh', isMobile: !!o.mobile, hasTouch: !!o.mobile });
  const p = await ctx.newPage(); p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); p.on('dialog', d => d.accept());
  if (o.init) await p.addInitScript(o.init, o.initArg);               /* ví dụ: đặt localStorage người dùng đã đăng nhập */
  if (o.time) await p.clock.setFixedTime(new Date(o.time));           /* giả lập ngày */
  await M.install(p, Object.assign({ db: JSON.parse(JSON.stringify(DB)), handlers: HANDLERS }, o.mock || {}));
  await p.goto('file://' + APP);
  if (o.ready) await p.waitForFunction(o.ready, null, { timeout: 20000 });
  await p.waitForTimeout(o.settle || 600);
  return p;
}
/* marks: [[selector, số, 'tl'|'tr'|'l'|'r', khung?]] — lưu toạ độ tương đối để deckkit vẽ số cam lên ảnh */
async function shot(p, name, o) {
  o = o || {};
  let clip = null;
  if (o.clip) clip = typeof o.clip === 'string' ? await p.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }, o.clip) : o.clip;
  const vp = p.viewportSize(); if (!clip) clip = { x: 0, y: 0, width: vp.width, height: vp.height };
  const marks = [];
  for (const m of (o.marks || [])) {
    const r = await p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, m[0]);
    if (!r) { console.log('  !! thiếu', name, m[0]); continue; }
    marks.push({ n: m[1], pos: m[2] || 'tl', box: !!m[3], x: (r.x - clip.x) / clip.width, y: (r.y - clip.y) / clip.height, w: r.w / clip.width, h: r.h / clip.height });
  }
  await p.screenshot({ path: 'shots/' + name + '.png', clip });
  fs.writeFileSync('shots/' + name + '.json', JSON.stringify({ w: clip.width, h: clip.height, marks }));
  console.log('shot', name, Math.round(clip.width) + 'x' + Math.round(clip.height), marks.length + ' marks', p.errs.length ? p.errs : '');
}
const ev = (p, f, a) => p.evaluate(f, a);

/* ── CẢNH CHỤP ── */
const S = {};
S.main = async b => { const p = await newPage(b, {}); await shot(p, 'main', { marks: [['#ver-badge', 1, 'tr']] }); };
S.notice = async b => { const p = await newPage(b, {}); await ev(p, () => window.UPD && UPD.open(true)); await p.waitForTimeout(400);
  await shot(p, 'notice', { clip: '#upd .upd-box' }); };
S.theme = async b => { const p = await newPage(b, {}); if (!(await ev(p, () => !!window.THEME))) return;
  await ev(p, () => THEME.open()); await p.waitForTimeout(250); await shot(p, 'themepick', { marks: [['#th-btn', 1, 'tl']] });
  for (const k of ['sage', 'lavender', 'sand', 'rose', 'ocean', 'slate', 'teal', 'terracotta', 'forest']) { await ev(p, k => { THEME.set(k); THEME.close(); }, k); await p.waitForTimeout(150); await shot(p, 'theme_' + k, {}); }
  await ev(p, () => THEME.set('base')); };

module.exports = { S, newPage, shot, ev };
if (require.main === module) (async () => {
  const b = await chromium.launch({ args: ['--lang=vi-VN'] });
  for (const k of Object.keys(S)) { if (ONLY.length && !ONLY.includes(k)) continue; try { await S[k](b); } catch (e) { console.log('ERR', k, e.message.split('\n')[0]); } }
  await b.close();
})();
