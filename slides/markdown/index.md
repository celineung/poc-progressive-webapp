##  Progressive Web Apps
<!-- .slide:data-background="images/applications.png" height="100%" -->

### Un nouveau mode de développement mobile
<!-- .element: style="color: #cc5f7f;" -->

27/10/2016 - Olivier Laporte & Céline Ung

---

## Les développement mobile aujourd'hui

<blockquote class="fragment fixed" data-fragment-index="1"  data-transition="slide">
NATIF
</blockquote>

<blockquote class="fragment fixed" data-fragment-index="2"  data-transition="slide">
HTML
</blockquote>

<blockquote class="fragment fixed" data-fragment-index="3"  data-transition="slide">
HYBRIDE
</blockquote>

Notes:
Natif
+ accès au fonctionalité du téléphone
- à faire pour chaque OS
HTML
- accès à rien
HYBRIDE
+ mélange des deux

---

## Les problèmes

<blockquote class="fragment fixed" data-fragment-index="1"  data-transition="slide">
"Ah je suis dans le métro, je n'ai pas de réseau pour récupérer le numéro de téléphone."
</blockquote>

<blockquote class="fragment fixed" data-fragment-index="2"  data-transition="slide">
"Qu'est-ce que ça rame ce site !"
</blockquote>

<blockquote class="fragment fixed" data-fragment-index="3"  data-transition="slide">
"L'application mobile est vachement mieux."
</blockquote>

--- 

## Ce dont nous avons besoin

- **progressive** : fluidité améliorée au fur et à mesure de l'utilisation du site
- **responsive** : s'adapter à différents types d'appareils
- **connectivity-independent** : fonctionner offline
- **safe** : utiliser HTTPS
- **installable** : possibilité de rajouter l'application sur l'écran d'accueil

> “Use modern web capabilities to deliver an app-like user experience.”
<!-- .element: class="fragment" data-fragment-index="1" -->

Notes:
PWA permet de travailler pour obtenir une meilleure expérience utilisateur

---

## App shell

![App shell](images/app-shell.png)
<!-- .element: height="500px" -->

---

## [TP] app shell

> **objectif:** avoir une webapp ready rapidement

Notes:
On veut proposer à l'utilisateur le plus rapidement possible une coquille du site, pour que l'utilisateur voit une information.
Ensuite en javascript, on va charger davantage d'info.

---

## Service worker : introduction

- joue le rôle de **proxy**
- script chargé en **parallèle** des scripts de notre application
- fonctionne en **HTTPS**
- asynchrone, utilise des **promesses**

Notes:
Attention, pas accès au DOM
Attention au scope

---

## Service worker : introduction

![Service worker](images/service-worker.png)

---

## Service worker : support

![Service worker support](images/sw-support.png)

---

## Service worker : cycle de vie

![Service worker life cycle](images/service-worker-life.png)

Notes:
idle -> terminate to preserve memory and processor power
sw redémarré automatiquement pour répondre à des events (onfetch par exemple)


---

## [TP] Service worker

> **objectif:** réduire le temps de chargement du app-shell

1. enregistrer un service worker
2. charger les fichiers nécéssaires au app shell dans le cache
3. charger le app-shell depuis le cache
4. vérifier les données dans le cache et le fonctionnement offline



## 1. enregistrer un service worker

```
if ('serviceWorker' in navigator) {
   navigator.serviceWorker
     .register('./service-worker.js')
     .then(function() { console.log('[Service Worker] Registered'); });
 }
```



## 2. charger les fichiers nécéssaires au app shell

```
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
```

Notes:
SW pas considéré comme installé avant que la promesse n'est pas résolue (waitUntil).



## 3. charger le app-shell depuis le cache

```
self.addEventListener("fetch", function(event) {
  console.log("[ServiceWorker] Fetch", event.request.url);
  event.respondWith(
    caches.match(event.request.url).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
```

```
chrome://serviceworker-internals/
```
<!-- .element: class="fragment" data-fragment-index="1" -->



## 4. vérifier les données dans le cache et le fonctionnement offline

Notes:
Des news sont affichés car fallback initialNews

---

## [TP] Service worker

> **objectif:** réduire le temps de chargement des données

1. créer la variable *dataCacheName*
2. intercepter la requête vers l'api et cacher la réponse
3. charger les données de *dataCacheName*
4. vérifier les données dans le cache et le fonctionnement offline



## 1. créer la variable dataCacheName qui contiendra le nom du nouveau cache



## 2. intercepter la requête vers l'api et cacher la réponse

```
self.addEventListener("fetch", function(e) {
  console.log("[ServiceWorker] Fetch", e.request.url);
  var dataUrl = "https://newsapi.org/v1/articles";

  if (e.request.url.indexOf(dataUrl) > -1) {
    //si l'on demande dataUrl,
    //adopter la stratégie "Cache then network"
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          //clone car une réponse ne
          //peut être consommé que une seule fois
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
```



## 3. dans app.getNews(), charger les données de dataCacheName

```
if ('caches' in window) {
  // TODO: si le service worker a enregistré un cache,
  // afficher les données cachées en appelant app.display()
  caches.match(url).then(function(response) {
    if (response) {
      response.json().then(function(json) {
        app.display(json);
      });
    }
  });
}`
```



## 4. vérifier les données dans le cache et le fonctionnement offline


---

## Ajouter le site web au homescreen

- pas besoin de passer par le app store
- être accessible directement depuis le homescreen
- full-screen (pas de barre URL)
- requiert service-worker et manifest.json

Notes:
- On mobile, only Chrome and Opera Mobile supports manifest
- manifest fournit des informations concernant celle-ci (comme son nom, son auteur, une icône et une description)
- un écran de lancement (splashscreen) est affiché pour une appplication lancée depuis l'écran d'accueil.
Cet écran est généré automatiquement en utilisant les propriétés du manifeste de l'application web, particulièrement:
name, background_color, et l'icône du tableau `icons`qui est la plus proche de 128dp pour l'appareil.
- améliorer l'expérience utilisateur pendant le chargement de l'application (peut définir le background-color par exemple)

---

## [TP] Web app dans la homepage

> **objectif:** raccéder à la webapp depuis la homepage du téléphone

1. Ajouter la dépendance au manifest.json dans le index.html
2. Ajouter le site au homescreen
3. Tester le mode offline

Notes:
Erreur en offline car le site n'est pas désservi en HTTPS
Service workers are only available to "secure origins" (HTTPS sites, basically)



## 1. Ajouter la dépendance au manifest.json dans le index.html

```
<link rel="manifest" href="manifest.json">
```



## 2. Ajouter le site au homescreen



## 3. Tester le mode offline

---

## Notifications push

- nécéssite un service worker
- enregistrement aux notifications en utilisant **PushManager.subscribe()**
- listener **onpush** écoutent les messages push

---

## Notification push : support

![Service worker support](images/push-support.png)

---

## [TP] Notification push

> **objectif:** recevoir une notification push

1. Ajouter l'event listener onpush dans le service worker
2. Implémenter la fonction *subscribeToPushNotification()* qui va s'abonner à un serveur de notifications



## 1. Ajouter l'event listener onpush dans le service worker

```
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
```



## 2. S'abonner à un serveur de notifications

```
function subscribeToPushNotification() {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      //{userVisibleOnly: true} : les messages push sont toujours visibles
      serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true});
    });
}
```


---

# MERCI =)
