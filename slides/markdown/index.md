##  Progressive Web Apps
<!-- .slide:data-background="images/applications.png" height="100%" -->

### Sensibilisation UX pour les développeurs
<!-- .element: style="color: #cc5f7f;" -->

27/10/2016 - Olivier Laporte & Céline Ung

---

## Problèmes Web Apps *on browser*

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

> “Use modern web capabilities to deliver an app-like user experience.”

--- 

## Ce dont nous avons besoin

- **progressive** : fluidité améliorée au fur et à mesure de l'utilisation du site
- **responsive** : s'adapter à différents types d'appareils
- **connectivity-independent** : fonctionner offline
- **safe** : utiliser HTTPS
- **installable** : possibilité de rajouter l'application sur l'écran d'accueil

> \# progressive web app \#
<!-- .element: class="fragment" data-fragment-index="1" -->

---

## App shell

![App shell](images/app-shell.png)
<!-- .element: height="500px" -->

---

## [TP] app shell

> **objectif:** injecter les données de news

---

## Service worker : introduction

- permet de rendre l'application web disponible offline
- script chargé en parallèle des scripts de notre application
- joue le rôle de proxy
- utiliser HTTPS

---

## Service worker : introduction

![Service worker](images/service-worker.png)

---

## Service worker : cycle de vie


to do schéma

---

## [TP] Service worker

> **objectif:** réduire le temps de chargement du app-shell

1. enregistrer un service worker
2. charger les fichiers nécéssaires au app shell
3. charger le app-shell depuis le cache
