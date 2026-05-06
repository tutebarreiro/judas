const CACHE_NAME = "mi-app-v2"; // 👈 cambiá esto cuando actualices

self.addEventListener("install", event => {
  self.skipWaiting(); // 👈 fuerza instalar ya
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 👈 borra versiones viejas
          }
        })
      );
    })
  );

  self.clients.claim(); // 👈 toma control inmediato
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
