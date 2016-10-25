
(function() {
  'use strict';

  var app = {
    visibleCards: {},
    container: document.querySelector('.main'),
    cardTemplate: document.querySelector('.news-card-template'),
    dateContainer: document.querySelector('.date-container'),
  };
  var dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  var initialNews = {
    "status": "ok",
    "source": "bbc-news",
    "sortBy": "top",
    "articles": [
      {
        "author": "BBC News",
        "title": "US election 2016: Clinton and Trump face final debate",
        "description": "Hillary Clinton and Donald Trump are preparing for their final televised debate in an increasingly personal and bitter fight for the US presidency.",
        "url": "http://www.bbc.co.uk/news/election-us-2016-37706499",
        "urlToImage": "http://ichef.bbci.co.uk/news/1024/cpsprodpb/68A4/production/_91988762_compo.jpg",
        "publishedAt": "2016-10-19T20:52:44Z"
      },
      {
        "author": "BBC News",
        "title": "Mosul battle: Islamic State group's leaders fleeing city, US says",
        "description": "The US military says there are signs leaders of the self-styled Islamic State have fled Mosul as the Iraqi government and its allies close in on the city.",
        "url": "http://www.bbc.co.uk/news/world-middle-east-37709970",
        "urlToImage": "http://ichef.bbci.co.uk/news/1024/cpsprodpb/F9AF/production/_91991936_035946339-1.jpg",
        "publishedAt": "2016-10-19T20:44:11Z"
      }
    ]
  };

  var pushButton = document.getElementById('activate-push-notification');
  var refreshButton = document.getElementById('refresh-button');
  var pushNotification = {
    notificationOn : false,
    subscribe: subscribeToPushNotification
  } ;

  /*
   * Demande de rafraichissement des news
   */
  refreshButton.addEventListener('click', function() {
    app.getNews();
  });

  /*
   * Activer les notifications push
   */
  pushButton.addEventListener('click', function() {
    pushNotification.notificationOn = !pushNotification.notificationOn;
    if(pushNotification.notificationOn) {
      pushButton.innerHTML = "<i class='material-icons'>notifications</i>";
      pushNotification.subscribe();
    }
  });

  /*
   * Remplir une carte de news à l'écran
   */
  app.updateNewsCards = function(data, index) {
    var card = app.visibleCards[index];
    if (card === undefined) {
      card = app.cardTemplate.cloneNode(true);
      app.container.appendChild(card);
      app.visibleCards[index] = card;
    }
    card.classList.remove('card-template');
    card.querySelector('.news-title').textContent = data.articles[index].title;
    card.querySelector('.news-description').innerHTML = data.articles[index].description;
    card.querySelector('.news-read-more').innerHTML = "<a href='" + data.articles[index].url + "'>READ MORE</a>" ;
    card.querySelector('.news-date').textContent = (new Date(data.articles[index].publishedAt)).toLocaleDateString("en-GB", dateOptions);
    card.removeAttribute('hidden');
    card.style.display = "block";
  };

  /*
   * Récupérer les données de news
   */
  app.getNews = function() {
    var url = "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=2890d006806f42309bbf7f6b93cc57aa";

    if ('caches' in window) {
      //si le service worker a enregistré un cache, afficher les données cachées
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            app.display(json);
          });
        }
      });
    }

    //envoyer la requête pour récupérer les données
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          app.display(response);
        }
      } else {
        //renvoyer les données de news par défaut
        app.display(initialNews);
      }
    };
    request.open('GET', url);
    request.send();

  };

  /*
   * Afficher les données à l'écran
   */
  app.display = function(data) {
    app.dateContainer.querySelector('.date-last-refresh').textContent = (new Date(data.articles[0].publishedAt)).toLocaleDateString("en-GB", dateOptions);
    app.updateNewsCards(data, 0);
    app.updateNewsCards(data, 1);
  };

  /*
   * S'abonner aux notifications push
   */
  function subscribeToPushNotification() {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
      //{userVisibleOnly: true} : les messages push sont toujours visibles
      serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
        .then(function (subscription) {
          //success
        })
        .catch(function (e) {
          if (Notification.permission === 'denied') {
            // l'utilisateur n'a pas voulu activer les messages push
            console.warn('Permission for Notifications was denied');
          } else {
            // erreur
            // problème réseau? pas de gcm_sender_id dans le manifest.json?
            console.error('Unable to subscribe to push.', e);
          }
        });
    });
  }

  /*
   * Initialisation de la page
   */
  function init() {
    app.getNews();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./service-worker.js')
        .then(function() { console.log('Service Worker Registered'); });
    }
  }
  init();

})();

