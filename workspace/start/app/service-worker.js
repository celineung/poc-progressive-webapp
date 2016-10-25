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

  // TODO mettre les fichiers statiques dans le cache

});

/*
 * Activate
 */
self.addEventListener("activate", function() {
  console.log("[ServiceWorker] Activate");
});

/*
 * Ici on joue le rôle proxy
 */
self.addEventListener("fetch", function(event) {

  // TODO retourner les fichiers cachés quand ils sont cachés

});

/*
 * Afficher le message push
 */
self.addEventListener("push", function(event) {
  var title = "Subscription to push notification";
  var body = "HELLO, CLICK ON THE LINK BELOW FOR ANOTHER NEWS";

  // TODO: Construire la notification à afficher

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
