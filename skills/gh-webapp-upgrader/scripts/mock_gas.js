/* Backend Google Apps Script GIẢ LẬP cho Playwright — dùng để test & chụp ảnh khi không gọi được script.google.com.
   const M = require('./mock_gas');
   await M.install(page, {
     handlers: { boot:(b,ctx)=>({ok:true,items:ctx.db.items}), addItem:(b,ctx)=>{ … return {ok:true,no:'12'}; } },
     db: { items:[…] },                 // dữ liệu có trạng thái — handler đọc / ghi vào ctx.db
     writes: /^(add|update|delete)/,     // action nào là lệnh ghi (khoá tuần tự + chống trùng theo rid)
     lag: 0,                             // ms trễ cho lệnh ghi (giả lập Apps Script chậm)
     staleMs: 0,                         // lệnh đọc trả bản chụp cũ trong N ms sau mỗi lần ghi
     flaky: { addItem:['drop','busy','lost'] },   // sự cố lần lượt cho từng lần gọi
     dedupNoNo: false,                   // phản hồi trùng rid không kèm "no" (backend cũ)
     source: url => 'main'               // tên backend theo URL (nhiều phòng ban / nhiều sheet)
   });
   M.log  — nhật ký: ['ok'|'dup'|'drop'|'lost'|'busy', action, rid, source, body]
   Sự cố:  drop = ĐÃ ghi nhưng phản hồi hỏng (500) · lost = KHÔNG ghi, phản hồi hỏng · busy = {ok:false,error:'Lock timeout…'}
   Hỗ trợ JSONP (GET ?callback=) và POST (text/plain JSON hoặc URLSearchParams{action,payload}). */
const log = [];
async function install(page, o) {
  o = o || {};
  const db = o.db || {}, H = o.handlers || {}, writes = o.writes || /^(add|update|delete|save|send|move|set)/;
  const RIDS = {}; let lockP = Promise.resolve(); let stale = null, staleUntil = 0;
  const clone = x => JSON.parse(JSON.stringify(x));
  const ctx = { db, get view() { return (o.staleMs && Date.now() < staleUntil && stale) ? stale : db; } };
  const reply = (route, cb, d, status) => status
    ? route.fulfill({ status, contentType: 'text/html', body: '<html>Error</html>' })
    : cb ? route.fulfill({ status: 200, contentType: 'application/javascript', body: cb + '(' + JSON.stringify(d) + ');' })
         : route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(d) });
  async function handle(route) {
    const req = route.request(), u = new URL(req.url());
    let body = Object.fromEntries(u.searchParams.entries());
    if (req.method() === 'POST') {
      const raw = req.postData() || '';
      try { body = JSON.parse(raw); } catch (_) { const pd = new URLSearchParams(raw); body = Object.assign({ action: pd.get('action') }, JSON.parse(pd.get('payload') || '{}')); }
    }
    const a = body.action || '', cb = u.searchParams.get('callback'), src = o.source ? o.source(req.url()) : 'main';
    const isW = writes.test(a);
    if (isW && body.rid && RIDS[body.rid]) { const d = Object.assign({}, RIDS[body.rid], { dedup: true }); if (o.dedupNoNo) delete d.no; log.push(['dup', a, body.rid, src, body]); return reply(route, cb, d); }
    const fl = (o.flaky && o.flaky[a] && o.flaky[a].length) ? o.flaky[a].shift() : null;
    if (fl === 'busy') { log.push(['busy', a, body.rid, src, body]); return reply(route, cb, { ok: false, error: 'Lock timeout: another process was holding the lock for too long.' }); }
    if (fl === 'lost') { log.push(['lost', a, body.rid, src, body]); return reply(route, cb, null, 500); }
    if (isW && o.lag) await new Promise(r => setTimeout(r, o.lag));
    if (isW && o.staleMs) { stale = clone(db); staleUntil = Date.now() + o.staleMs; }
    let d;
    try { d = H[a] ? await H[a](body, ctx, src) : { ok: false, error: 'Unknown action: ' + a }; }
    catch (e) { d = { ok: false, error: String(e.message || e) }; }
    if (isW && d && d.ok !== false) { if (body.rid) RIDS[body.rid] = d; log.push(['ok', a, body.rid, src, body]); }
    if (fl === 'drop') { log.push(['drop', a, body.rid, src, body]); return reply(route, cb, null, 500); }
    return reply(route, cb, d);
  }
  await page.route(o.match || /script\.google\.com/, async route => {
    const u = new URL(route.request().url()); let a = u.searchParams.get('action') || '';
    if (!a && route.request().method() === 'POST') { try { a = JSON.parse(route.request().postData() || '{}').action || ''; } catch (_) {} }
    if (!writes.test(a)) return handle(route);
    const prev = lockP; let rel; lockP = new Promise(r => rel = r); await prev;   /* như LockService: ghi lần lượt */
    try { await handle(route); } catch (_) {} finally { rel(); }
  });
  return ctx;
}
module.exports = { install, log };
