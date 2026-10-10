const AD = 'isik-v1';
const DOSYALAR = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(AD).then(c => c.addAll(DOSYALAR)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== AD).map(x => caches.delete(x)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      const kopya = res.clone();
      caches.open(AD).then(c => c.put(r, kopya));
      return res;
    }).catch(() => caches.match(r))
  );
});
