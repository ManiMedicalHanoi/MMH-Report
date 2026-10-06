/* Tự kiểm thử các mẫu trong skill (outbox.js + mock_gas.js + update-notice + theme-kit) trên assets/demo/index.html.
   Chạy: NODE_PATH=$(npm root -g) node scripts/selftest_outbox.js      (in bảng kết quả, thoát mã 1 nếu có kịch bản hỏng)
   Cũng là ví dụ cách viết bài test cho app thật. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const M = require('./mock_gas');
const ROOT = path.resolve(__dirname, '..'), A = ROOT + '/assets';
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ghép các @include của trang demo */
function build() {
  let h = fs.readFileSync(A + '/demo/index.html', 'utf8');
  const tk = fs.readFileSync(A + '/theme-kit.html', 'utf8');
  const part = n => { const i = tk.indexOf('<!-- (' + n + ')'), j = n < 3 ? tk.indexOf('<!-- (' + (n + 1) + ')') : tk.length; return tk.slice(i, j); };
  const un = fs.readFileSync(A + '/update-notice.html', 'utf8').replace(/updates\/notes\.js\?v=[\d.]+/g, '../kit/updates/notes.js');
  h = h.replace('<!--@include ../theme-kit.html#head-->', part(1)).replace('<!--@include ../theme-kit.html#button-->', part(2))
       .replace('<!--@include ../theme-kit.html#body-->', part(3)).replace('<!--@include ../update-notice.html-->', un);
  const out = A + '/demo/_built.html'; fs.writeFileSync(out, h); return out;
}
/* backend giả lập: 2 phòng (A, B), mỗi phòng 1 danh sách */
function handlers() {
  let seq = 10;
  return {
    list: (b, ctx, src) => ({ ok: true, source: src, items: JSON.parse(JSON.stringify(ctx.view[src])) }),
    addKey: (b, ctx, src) => { const no = String(++seq); ctx.db[src].push({ no, name: b.name, subs: [] }); return { ok: true, no }; },
    addSub: (b, ctx, src) => { const k = ctx.db[src].find(x => x.no === String(b.keyNo)); if (!k) return { ok: false, error: 'Không tìm thấy việc số ' + b.keyNo };
      const no = k.no + '.' + (k.subs.length + 1); k.subs.push({ no, name: b.name }); return { ok: true, no }; },
  };
}
async function page(b, file, o) {
  const p = await (await b.newContext({ viewport: { width: 1200, height: 800 }, locale: 'vi-VN' })).newPage();
  p.errs = []; p.on('pageerror', e => p.errs.push(e.message)); p.on('dialog', d => d.accept());
  await p.addInitScript(() => { try { localStorage.setItem('app_user', 'Giang'); } catch (_) {} });
  const ctx = await M.install(p, Object.assign({ db: { a: [{ no: '1', name: 'Việc có sẵn', subs: [] }], b: [] }, handlers: handlers(),
    writes: /^add/, source: u => /DEMO_B/.test(u) ? 'b' : 'a' }, o));
  await p.goto('file://' + file);
  await p.waitForFunction(() => window.UPD && UPD.isOpen(), null, { timeout: 4000 }).catch(() => {});   /* thông báo tự mở ~1,2 s */
  await p.evaluate(() => window.UPD && UPD.isOpen() && UPD.close());
  p.ctx = ctx; return p;
}
const waitQ = async (p, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (!(await p.evaluate(() => APP_OUTBOX.list().length))) return true; await sleep(250); } return false; };
const writes = (a) => M.log.filter(x => x[0] === 'ok' && (!a || x[1] === a));

(async () => {
  const file = build(); const b = await chromium.launch(); const R = [];
  const ok = (name, cond, info) => { R.push([cond ? '✓' : '✗', name, info || '']); };

  { M.log.length = 0; const p = await page(b, file, { lag: 1500, flaky: { addKey: ['drop'] } });   // 1. cha + con ngay + đổi phòng; phản hồi hỏng
    const t = Date.now(); await p.evaluate(() => { APP.addKey('Cha 1'); const k = APP.items[APP.items.length - 1]; APP.addSub(k.no, 'Con 1'); });
    const vis = await p.evaluate(() => !!document.querySelector('#list').textContent.match(/Cha 1[\s\S]*Con 1/)); ok('hiện ngay (cha + con)', vis, (Date.now() - t) + ' ms');
    await p.evaluate(() => APP.switchSrc('b'));
    ok('hàng đợi xong', await waitQ(p, 30000));
    const a = p.ctx.db.a.find(k => k.name === 'Cha 1');
    ok('đúng 1 cha + 1 con ở phòng A', p.ctx.db.a.filter(k => k.name === 'Cha 1').length === 1 && a && a.subs.length === 1, JSON.stringify(a));
    ok('không ghi nhầm phòng B', p.ctx.db.b.length === 0);
    ok('không lỗi JS', !p.errs.length, p.errs.join('; ')); await p.context().close(); }

  { M.log.length = 0; const p = await page(b, file, { flaky: { addSub: ['busy', 'busy'], addKey: ['lost'] } });   // 2. bận ×2 · 3. mất lệnh
    await p.evaluate(() => { APP.addSub('1', 'Con bận'); APP.addKey('Cha mất'); }); await sleep(2600);
    const chip = await p.evaluate(() => (document.getElementById('ob-chip') || {}).textContent || '');
    ok('chip báo đang tự thử lại', /thử lại|Đang lưu/.test(chip), chip);
    ok('hàng đợi xong', await waitQ(p, 40000));
    ok('máy chủ bận ⇒ vẫn ghi được 1 lần', writes('addSub').filter(x => x[4].name === 'Con bận').length === 1);
    ok('mất lệnh ⇒ gửi lại, đúng 1 dòng', p.ctx.db.a.filter(k => k.name === 'Cha mất').length === 1);
    await p.context().close(); }

  { M.log.length = 0; const p = await page(b, file, { lag: 4000 });                               // 4. tải lại trang giữa chừng
    await p.evaluate(() => { APP.addKey('Cha reload'); const k = APP.items[APP.items.length - 1]; APP.addSub(k.no, 'Con reload'); });
    await sleep(300); await p.reload(); await sleep(900);
    const shown = await p.evaluate(() => /Cha reload[\s\S]*Con reload/.test(document.querySelector('#list').textContent));
    ok('sau tải lại: thao tác dở vẫn hiện', shown);
    ok('hàng đợi xong', await waitQ(p, 40000)); await sleep(300);
    const k = p.ctx.db.a.filter(x => x.name === 'Cha reload');
    ok('đúng 1 cha + 1 con, không trùng', k.length === 1 && k[0].subs.length === 1, 'log: ' + M.log.map(x => x[0] + ':' + x[1]).join(' '));
    ok('không lỗi JS', !p.errs.length, p.errs.join('; ')); await p.context().close(); }

  { const p = await page(b, file, {});                                                            // 5. lỗi thật ⇒ chip đỏ ⇒ Bỏ
    await p.evaluate(() => { APP.items.push({ no: '999', name: 'Việc đã bị xoá trên sheet', subs: [] }); APP.render(); APP.addSub('999', 'Con lỗi'); });
    await sleep(1500);
    const cls = await p.evaluate(() => document.getElementById('ob-chip').className);
    ok('lỗi thật ⇒ chip đỏ', /fail/.test(cls), cls);
    await p.click('#ob-chip'); await sleep(150);
    ok('bảng chi tiết có lý do', await p.evaluate(() => /Không tìm thấy việc số 999/.test(document.getElementById('ob-pan').textContent)));
    await p.evaluate(() => APP_OUTBOX.drop(APP_OUTBOX.list()[0].id)); await sleep(200);
    ok('Bỏ ⇒ gỡ khỏi giao diện', await p.evaluate(() => !/Con lỗi/.test(document.querySelector('#list').textContent) && !APP_OUTBOX.list().length));
    await p.context().close(); }

  { const p = await page(b, file, {});                                                            // 6. thông báo + chủ đề màu
    ok('thông báo cập nhật mở được', await p.evaluate(() => UPD.open(true) && UPD.isOpen())); await p.evaluate(() => UPD.close());
    const ms = await p.evaluate(() => { const t = performance.now(); THEME.set('sage'); document.body.offsetHeight; return Math.round(performance.now() - t); });
    const pri = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--t-pri').trim());
    ok('đổi chủ đề màu tức thì', pri.toUpperCase() === '#4A7A64', ms + ' ms · ' + pri);
    ok('không lỗi JS', !p.errs.length, p.errs.join('; ')); await p.context().close(); }

  await b.close(); try { fs.unlinkSync(file); } catch (_) {}
  R.forEach(r => console.log(r[0], r[1], r[2] ? '— ' + r[2] : ''));
  const bad = R.filter(r => r[0] === '✗').length; console.log(R.length - bad + '/' + R.length + ' đạt'); process.exit(bad ? 1 : 0);
})();
