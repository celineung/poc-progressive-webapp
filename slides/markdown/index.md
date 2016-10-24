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

> **objectif:** injecter les données de news

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

---

## [TP] Service worker

> **objectif:** réduire le temps de chargement du app-shell

1. enregistrer un service worker
2. charger les fichiers nécéssaires au app shell
3. charger le app-shell depuis le cache

---

## [TP] Service worker

> **objectif:** réduire le temps de chargement des données

1. créer la variable *dataCacheName*
2. ajouter une condition pour ne pas supprimer les données de *dataCacheName*
3. récupérer les données de *yahooapis* puis les mettre dans *dataCacheName*
4. charger les données de *dataCacheName*



## 1. créer la variable dataCacheName qui contiendra le nom du nouveau cache



## 2. dans le "activate" du service-worker, ajouter la condition pour ne pas supprimer les données de dataCacheName



## 3. dans le "fetch" du service-worker, *fetch* les données récupérées de *yahooapis* puis les mettre dans dataCacheName



## 4. dans app.getNews(), charger les données de dataCacheName

---

## Ajouter le site web au homescreen

- être accessible directement depuis le homescreen
- pas besoin de passer par le app store
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



## Détails sur tous vos services workers

```
chrome://serviceworker-internals/
```

---

## Notifications push

- nécéssite un service worker
- enregistrement aux notifications en utilisant **PushManager.subscribe()**
- listener **onpush** écoutent les messages push

---

## Notification push : support

![Service worker support](images/sw-support.png)

---

## [TP] Notification push

> **objectif:** recevoir une notification push

1. Ajouter l'event listener onpush dans le service worker
2. Implémenter la fonction *subscribeToPushNotification()* qui va s'abonner à un serveur de notifications

---

# MERCI =)
