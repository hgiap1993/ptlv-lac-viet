const CACHE_NAME = 'lacviet-daoquan-v1.0';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data-lyhoc.js',
  './js/engine-amlich.js',
  './js/engine-luantuoi.js',
  './js/engine-trachcat.js',
  './js/engine-tuvi-phongthuy.js',
  './js/app.js',
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
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
