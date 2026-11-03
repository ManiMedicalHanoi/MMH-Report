/* MGM 2026 — service worker: works offline in Japan. Pages = network first (always newest), fall back to saved copy.
   Emergency removal: replace this file with:  self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',()=>self.registration.unregister()); */
const V = 'mgm26-v2';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mgm26-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const fonts = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (u.origin === location.origin && u.pathname.startsWith(new URL('./', self.registration.scope).pathname)) {
    if (r.mode === 'navigate' || /\.(html|webmanifest|js)$/.test(u.pathname) || u.pathname.endsWith('/')) {
      e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r.mode === 'navigate' ? 'index.html' : r, cp)); } return res; })
        .catch(() => caches.match(r.mode === 'navigate' ? 'index.html' : r, {ignoreSearch: true}).then(m => m || caches.match('index.html'))));
    } else {
      e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })));
    }
  } else if (fonts) {
    e.respondWith(caches.open(V).then(c => c.match(r).then(m => { const f = fetch(r).then(res => { c.put(r, res.clone()); return res; }).catch(() => m); return m || f; })));
  }
});
