self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const API_CACHE = 'api-cache-v1';

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Only handle requests that include '/posters' to avoid over-caching
  try {
    const url = new URL(req.url);
    if (!url.pathname.includes('/posters')) return;
  } catch {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(API_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const resp = await fetch(req);
        if (resp && resp.status === 200) {
          cache.put(req, resp.clone()).catch(() => {});
        }
        return resp;
      } catch {
        // If network fails and there's no cache, return an empty array
        // to match the expected poster data format
        return new Response(JSON.stringify([]), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    })()
  );
});
