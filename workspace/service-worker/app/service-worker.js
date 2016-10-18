var cacheName = "appFiles";
var filesToCache = [
	"/",
	"/index.html",
	"/scripts/main.js",
	"/styles/main.css",
	"/styles/custom.css",
	"/favicon.ico",
	"/images/news-icon.png"
];

/*
 * Durant cette étape, le app shell est caché
 */
self.addEventListener("install", function(e) {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/*
 * Mettre à jour le cache lorsque l'un des fichiers du app-shell est modifié
 */
self.addEventListener("activate", function(e) {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log("[ServiceWorker] Removing old cache", key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener("fetch", function(e) {
  console.log("[ServiceWorker] Fetch", e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

