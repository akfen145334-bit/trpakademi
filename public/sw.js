// TRP Akademi servis çalışanı: uygulama kabuğunu çevrimdışı açar.
const CACHE = 'trp-akademi-v2';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'manifest.webmanifest', 'icon-192.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin) return;
  // Ses dosyaları (Range istekleri) ve ses dizini ağdan doğrudan alınır; önbelleğe alınmaz
  if (u.pathname.includes('/audio/')) return;
  // Görsel dizini her zaman ağdan (yeni görseller görünsün); ağ yoksa önbellek
  if (u.pathname.endsWith('/data/img/index.json') || u.pathname.endsWith('/data/imza.json') || u.pathname.endsWith('/data/packs.json')) {
    e.respondWith(fetch(req).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return res; }).catch(() => caches.match(req)));
    return;
  }
  const isPage = req.mode === 'navigate';
  e.respondWith(
    (isPage
      ? fetch(req).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./'))
      : caches.match(req).then((hit) => hit || fetch(req).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return res; })))
  );
});
