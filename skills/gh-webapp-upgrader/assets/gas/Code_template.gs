/**
 * MẪU BACKEND Google Apps Script cho webapp GitHub Pages (gh-webapp-upgrader)
 * ─────────────────────────────────────────────────────────────────────────────
 * · Đọc: JSONP (GET ?action=…&callback=cb) — chạy được cả khi web app giới hạn trong domain.
 * · Ghi: GET (JSONP) hoặc POST (text/plain JSON / URLSearchParams{action,payload}) — có LockService + chống trùng theo `rid`.
 * · `version`: vân tay dữ liệu rất nhẹ ⇒ client hỏi mỗi 12–20 s, chỉ tải lại khi đổi.
 * · Mỗi dòng có cột ID cố định (không dùng số thứ tự dòng làm khoá) + kiểm tra `expect` (tên hiện tại) trước khi sửa/xoá.
 * · Không ghi vào ô có công thức. Dropdown lấy từ Data validation của sheet (action=options).
 * Triển khai: Deploy ▸ New deployment ▸ Web app — Execute as: Me — Who has access:
 *   "Anyone within <domain>" (KHUYÊN DÙNG: Session.getActiveUser() cho biết ai đang thao tác) hoặc "Anyone".
 * Sửa code xong: Deploy ▸ Manage deployments ▸ Edit ▸ Version: New version ▸ Deploy (chạy trigger KHÔNG cập nhật web app).
 */
var CFG = {
  SHEET_ID: '',                 // để trống = file chứa script
  TAB: 'Data',                  // tab dữ liệu
  HEADER_ROW: 1,
  ID_COL: 'ID',                 // tên cột ID cố định (tự sinh nếu trống)
  NAME_COL: 'Name',             // cột dùng để kiểm tra `expect`
  SOURCE: 'main'                // tên nguồn — client kiểm tra để không hiển thị nhầm dữ liệu backend khác
};

/* ───────── router ───────── */
function doGet(e) { return route_(e.parameter || {}, (e.parameter || {}).callback); }
function doPost(e) {
  var p = {};
  try { p = JSON.parse(e.postData.contents); }
  catch (_) { p = e.parameter || {}; if (p.payload) { var x = JSON.parse(p.payload); for (var k in x) p[k] = x[k]; } }
  return route_(p, null);
}
var READ = {
  boot: function (p) { return { ok: true, source: CFG.SOURCE, items: rows_(), v: ver_() }; },
  version: function () { return { ok: true, source: CFG.SOURCE, v: ver_() }; },
  options: function (p) { return { ok: true, options: options_(p.col) }; }
};
var WRITE = {
  addItem: function (p) {
    var sh = sheet_(), H = head_(sh), row = [];
    var id = Utilities.getUuid().slice(0, 8);
    H.forEach(function (h) { row.push(h === CFG.ID_COL ? id : (p[h] != null ? p[h] : '')); });
    sh.appendRow(row);
    return { ok: true, no: id, row: sh.getLastRow() };
  },
  updateItem: function (p) {
    var f = find_(p.no, p.expect); if (!f.ok) return f;
    var sh = sheet_(), H = head_(sh), data = JSON.parse(p.data || '{}');
    Object.keys(data).forEach(function (k) {
      var c = H.indexOf(k); if (c < 0 || k === CFG.ID_COL) return;
      var cell = sh.getRange(f.row, c + 1);
      if (cell.getFormula()) return;                       // giữ nguyên ô công thức
      cell.setValue(data[k]);
    });
    return { ok: true, no: p.no };
  },
  deleteItem: function (p) {
    var f = find_(p.no, p.expect); if (!f.ok) return f;
    sheet_().deleteRow(f.row); return { ok: true };
  }
};
function route_(p, cb) {
  var a = p.action || '', out;
  try {
    if (READ[a]) out = READ[a](p);
    else if (WRITE[a]) out = write_(a, p);
    else out = { ok: false, error: 'Unknown action: ' + a };
  } catch (err) { out = { ok: false, error: String(err && err.message || err) }; }
  var s = JSON.stringify(out);
  return cb ? ContentService.createTextOutput(cb + '(' + s + ');').setMimeType(ContentService.MimeType.JAVASCRIPT)
            : ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}
/* ───────── ghi an toàn: khoá + chống trùng rid + vân tay ───────── */
function write_(a, p) {
  var cache = CacheService.getScriptCache(), key = p.rid ? 'rid_' + p.rid : '';
  if (key) { var hit = cache.get(key); if (hit) { var d = JSON.parse(hit); d.dedup = true; return d; } }   // gửi lại ⇒ trả kết quả cũ, không ghi lại
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);                                     // quá thời gian ⇒ lỗi "Lock timeout" ⇒ client tự thử lại
  try {
    if (key) { var hit2 = cache.get(key); if (hit2) { var d2 = JSON.parse(hit2); d2.dedup = true; return d2; } }
    p.actor = actor_(p);
    var out = WRITE[a](p);
    if (out && out.ok !== false) {
      bump_();
      if (key) cache.put(key, JSON.stringify(out), 21600);  // nhớ 6 giờ
      log_(a, p, out);
    }
    out.v = ver_();
    return out;
  } finally { lock.releaseLock(); }
}
function actor_(p) {
  var em = ''; try { em = Session.getActiveUser().getEmail(); } catch (_) {}
  return em || p.actor || '';                               // web app trong domain ⇒ email thật, không giả mạo được
}
function ver_() { return PropertiesService.getScriptProperties().getProperty('v') || '0'; }
function bump_() { PropertiesService.getScriptProperties().setProperty('v', String(Date.now())); }
function log_(a, p, out) {                                  // nhật ký ghi (tuỳ chọn): tab _log
  try {
    var ss = CFG.SHEET_ID ? SpreadsheetApp.openById(CFG.SHEET_ID) : SpreadsheetApp.getActive();
    var sh = ss.getSheetByName('_log') || ss.insertSheet('_log');
    sh.appendRow([new Date(), p.actor || '', a, p.no || out.no || '', JSON.stringify(p).slice(0, 2000)]);
  } catch (_) {}
}
/* ───────── tiện ích sheet ───────── */
function sheet_() { var ss = CFG.SHEET_ID ? SpreadsheetApp.openById(CFG.SHEET_ID) : SpreadsheetApp.getActive(); return ss.getSheetByName(CFG.TAB); }
function head_(sh) { return sh.getRange(CFG.HEADER_ROW, 1, 1, sh.getLastColumn()).getValues()[0].map(String); }
function rows_() {
  var sh = sheet_(), H = head_(sh), n = sh.getLastRow() - CFG.HEADER_ROW; if (n < 1) return [];
  return sh.getRange(CFG.HEADER_ROW + 1, 1, n, H.length).getDisplayValues().map(function (r, i) {
    var o = { row: CFG.HEADER_ROW + 1 + i }; H.forEach(function (h, c) { o[h] = r[c]; }); o.no = o[CFG.ID_COL]; return o;
  });
}
function find_(id, expect) {
  var sh = sheet_(), H = head_(sh), ci = H.indexOf(CFG.ID_COL), cn = H.indexOf(CFG.NAME_COL);
  var vals = sh.getRange(CFG.HEADER_ROW + 1, 1, Math.max(1, sh.getLastRow() - CFG.HEADER_ROW), H.length).getDisplayValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][ci]) === String(id)) {
      if (expect && cn >= 0 && norm_(vals[i][cn]) !== norm_(expect)) return { ok: false, error: 'Dòng ' + id + ' đã thay đổi (không khớp tên) — tải lại rồi thử lại' };
      return { ok: true, row: CFG.HEADER_ROW + 1 + i };
    }
  }
  return { ok: false, error: 'Không tìm thấy dòng ' + id + ' (có thể đã bị xoá trên sheet)' };
}
function norm_(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim(); }
function options_(col) {                                    // danh sách chọn từ Data validation của cột
  var sh = sheet_(), H = head_(sh), c = H.indexOf(col); if (c < 0) return [];
  var dv = sh.getRange(CFG.HEADER_ROW + 1, c + 1).getDataValidation(); if (!dv) return [];
  var t = dv.getCriteriaType(), v = dv.getCriteriaValues();
  if (t === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) return v[0];
  if (t === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) return v[0].getDisplayValues().map(function (r) { return r[0]; }).filter(String);
  return [];
}
