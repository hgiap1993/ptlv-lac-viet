const CACHE_NAME = 'lacviet-daoquan-v8.1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css?v=8.1',
  './js/data-lyhoc.js?v=8.1',
  './js/engine-amlich.js?v=8.1',
  './js/engine-luantuoi.js?v=8.1',
  './js/engine-trachcat.js?v=8.1',
  './js/engine-tuvi-phongthuy.js?v=8.1',
  './js/app.js?v=8.1',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
