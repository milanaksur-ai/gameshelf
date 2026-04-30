// Self-destructing SW: always serve from network, then kill itself
self.addEventListener('install', () => self.skipWaiting());

// Pass all fetches through to the network (no cache)
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));

self.addEventListener('activate', e => {
  e.waitUntil(
    (async () => {
      // 1. Clear all caches
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      // 2. Navigate all clients BEFORE unregistering
      const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
      await Promise.all(clients.map(c => c.navigate(c.url)));
      // 3. Unregister this SW
      await self.registration.unregister();
    })()
  );
});
