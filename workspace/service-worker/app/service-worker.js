var appShellCacheName = "appFiles";
var dataCacheName = "dataFiles";
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
    caches.open(appShellCacheName).then(function(cache) {
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
        if (key !== appShellCacheName && key !== dataCacheName) {
          console.log("[ServiceWorker] Removing old cache", key);
          return caches.delete(key);
        }
      }));
    })
  );
});

/*
 * Ici on joue le rôle proxy
 */
self.addEventListener("fetch", function(e) {
  console.log("[ServiceWorker] Fetch", e.request.url);
  var dataUrl = "https://newsapi.org/v1/articles";

  if (e.request.url.indexOf(dataUrl) > -1) {
    //si l'on demande dataUrl, adopter la stratégie "Cache then network"
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  }
  else {
    //sinon on demande des fichiers app-shell
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }

});

self.addEventListener('push', function(event) {
  var title = "Subscription to push notification";
  var body = "SUCCESS";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body
    })
  );
});
