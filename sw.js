// ══════════════════════════════════════════════════════════
// TEST RIDE FARELLONES — Service Worker
// Versión: 1.0.0
// Cache offline: landing, registro, mapa, ruta.js
// Compatible: Chrome Android, Safari iOS, pantallas moto Android
// ══════════════════════════════════════════════════════════

const CACHE_NAME = 'test-ride-farellones-v1';

// Todos los archivos que se cachean al instalar
const PRECACHE = [
  '/FARELLONES-PWA/landing.html',
  '/FARELLONES-PWA/index.html',
  '/FARELLONES-PWA/registro.html',
  '/FARELLONES-PWA/mapa.html',
  '/FARELLONES-PWA/assets/ruta.js',
  '/FARELLONES-PWA/manifest.json',
  '/FARELLONES-PWA/icons/icon-192.png',
  '/FARELLONES-PWA/icons/icon-512.png'
];

// Recursos externos que se cachean si hay conexión
const RUNTIME_CACHE = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://unpkg.com/leaflet'
];

// ── INSTALL: precachear todos los archivos críticos ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precacheando archivos del Test Ride...');
        return cache.addAll(PRECACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar caches viejas ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Eliminando cache antigua:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: estrategia Cache First para archivos del proyecto ──
// Offline first: sirve desde cache, actualiza en background
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorar requests no GET
  if (event.request.method !== 'GET') return;

  // Estrategia para archivos del proyecto: Cache First
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          // Servir desde cache e intentar actualizar en background
          fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, response));
              }
            })
            .catch(() => {}); // Sin internet: silencioso
          return cached;
        }
        // No está en cache: buscar en red y cachear
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200) return response;
          const toCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, toCache));
          return response;
        });
      })
    );
    return;
  }

  // Estrategia para fuentes y recursos externos: Network First con fallback
  if (RUNTIME_CACHE.some(domain => url.href.includes(domain))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const toCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, toCache));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
