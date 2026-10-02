const CACHE_NAME = 'worldnotes-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ne jamais cacher les requêtes Firebase / Cloudinary
  if (
    event.request.url.includes('firebase') ||
    event.request.url.includes('cloudinary') ||
    event.request.url.includes('nominatim') ||
    event.request.url.includes('arcgisonline')
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
