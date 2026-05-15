const CACHE = 'educakids-v2';

const PRECACHE = [
  '/',
  '/index.html',
];

// ── Install: pré-cachear shell da app ──────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── Activate: limpar caches antigos ───────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Ignorar chamadas de API e recursos externos (YouTube, etc.)
  if (
    url.port === '3000' ||
    url.hostname.includes('youtube') ||
    url.hostname.includes('googlevideo') ||
    url.hostname.includes('ytimg') ||
    url.protocol === 'chrome-extension:'
  ) {
    return;
  }

  // Navegação SPA → sempre retorna index.html cacheado
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html').then((r) => r || fetch(e.request))
    );
    return;
  }

  // Cache-first para assets estáticos (JS, CSS, imagens)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;

      return fetch(e.request).then((response) => {
        if (response.ok && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
