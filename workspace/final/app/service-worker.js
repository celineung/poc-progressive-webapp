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
self.addEventListener("install", function(event) {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    //ouvrir le cache et cacher les fichiers
    //attention: si un chargement des fichiers se termine en erreur,
    //c'est toute l'étape "install" du service worker
    //qui tombe en erreur
    caches.open(appShellCacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/*
 * Supprimer les anciens caches
 */
self.addEventListener("activate", function(event) {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
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
          //clone car une réponse ne peut être consommé que une seule fois
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

/*
 * Afficher le message push
 */
self.addEventListener("push", function(event) {
  var title = "Subscription to push notification";
  var body = "HELLO, CLICK ON THE LINK BELOW FOR ANOTHER NEWS";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: "images/touch/icon-128x128.png",
      actions: [
        { action: "open", title: "READ"}
      ]
    })
  );
});

/*
 * Gérer une action sur le message push
 */
self.addEventListener("notificationclick", function(event) {
  var url;
  event.notification.close();
  if(event.action === "open") {
    url = "http://www.bbc.co.uk/news/uk-england-london-37745616";
  }
  clients.openWindow(url);
});
