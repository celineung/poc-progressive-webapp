
(function() {
  'use strict';

  // Your custom JavaScript goes here
  var app = {
    visibleCards: {},
    container: document.querySelector('.main'),
    cardTemplate: document.querySelector('.news-card-template'),
    dateContainer: document.querySelector('.date-container')
  };
  var dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  var initialNews = {
    "item": [
      {
        "title": "Q&A: The Clintons and Haiti, what you need to know",
        "description": "<p><a href=\"http://news.yahoo.com/q-clintons-haiti-know-211223323--election.html\"><img src=\"http://l1.yimg.com/bt/api/res/1.2/ob.w5r4rAbzNRL0kCrqdug--/YXBwaWQ9eW5ld3NfbGVnbztmaT1maWxsO2g9ODY7cT03NTt3PTEzMA--/http://media.zenfs.com/en_us/News/ap_webfeeds/abfab3dab8b44b94a60e116353eea5dc.jpg\" width=\"130\" height=\"86\" alt=\"FILE - In this Oct. 6, 2010, file photo, former president and UN special envoy to Haiti, Bill Clinton, center, talks with a member of the J/P NGO as he visits the Petionville Golf Club that is being used as a camp for people who were displaced by the Jan. 12 earthquake in Port-au-Prince, Haiti. Donald Trump is accusing the Clintons of cashing in on Haiti’s deadly 2010 earthquake. The Republican nominee cited State Department emails obtained by the Republican National Committee through a public records request and detailed in an ABC news story. At issue is whether friends of former President Clinton, referred to as “friends of Bill,” or “FOB,” in the emails, received preferential treatment from the State Department in the immediate aftermath of the 7.0-magnitude earthquake. (AP Photo/Ramon Espinosa, File)\" align=\"left\" title=\"FILE - In this Oct. 6, 2010, file photo, former president and UN special envoy to Haiti, Bill Clinton, center, talks with a member of the J/P NGO as he visits the Petionville Golf Club that is being used as a camp for people who were displaced by the Jan. 12 earthquake in Port-au-Prince, Haiti. Donald Trump is accusing the Clintons of cashing in on Haiti’s deadly 2010 earthquake. The Republican nominee cited State Department emails obtained by the Republican National Committee through a public records request and detailed in an ABC news story. At issue is whether friends of former President Clinton, referred to as “friends of Bill,” or “FOB,” in the emails, received preferential treatment from the State Department in the immediate aftermath of the 7.0-magnitude earthquake. (AP Photo/Ramon Espinosa, File)\" border=\"0\" /></a>WASHINGTON (AP) — Donald Trump is accusing the Clintons of cashing in on Haiti&#039;s deadly 2010 earthquake.</p><br clear=\"all\"/>",
        "link": "http://news.yahoo.com/q-clintons-haiti-know-211223323--election.html",
        "pubDate": "Wed, 12 Oct 2016 17:12:23 -0400",
        "content": {
          "height": "86",
          "type": "image/jpeg",
          "url": "image/news-icon.png",
          "width": "130"
        },
        "credit": {
          "role": "publishing company"
        }
      },
      {
        "title": "Mike Dee out as Padres president following miserable season",
        "description": "<p><a href=\"http://news.yahoo.com/padres-fire-mike-dee-following-another-miserable-season-174018043--spt.html\"><img src=\"http://l.yimg.com/bt/api/res/1.2/D54epnXVRuv0CwhP1dRjUQ--/YXBwaWQ9eW5ld3NfbGVnbztmaT1maWxsO2g9ODY7cT03NTt3PTEzMA--/http://media.zenfs.com/en_us/News/ap_webfeeds/b930196977b44042b7e8d1266256f31d.jpg\" width=\"130\" height=\"86\" alt=\"FILE - In this June 1, 2016, file photo, San Diego Padres president Mike Dee walks on the field before a baseball game against the Seattle Mariners in San Diego. Dee has been fired as president of the Padres, the team announced Wednesday, Oct. 12, 2016. (AP Photo/Alex Gallardo, File)\" align=\"left\" title=\"FILE - In this June 1, 2016, file photo, San Diego Padres president Mike Dee walks on the field before a baseball game against the Seattle Mariners in San Diego. Dee has been fired as president of the Padres, the team announced Wednesday, Oct. 12, 2016. (AP Photo/Alex Gallardo, File)\" border=\"0\" /></a>SAN DIEGO (AP) — Mike Dee is out as president of the San Diego Padres, who were embroiled in a major controversy toward the end of another miserable season.</p><br clear=\"all\"/>",
        "link": "http://news.yahoo.com/padres-fire-mike-dee-following-another-miserable-season-174018043--spt.html",
        "pubDate": "Wed, 12 Oct 2016 17:11:21 -0400",
        "content": {
          "height": "86",
          "type": "image/jpeg",
          "url": "http://l.yimg.com/bt/api/res/1.2/D54epnXVRuv0CwhP1dRjUQ--/YXBwaWQ9eW5ld3NfbGVnbztmaT1maWxsO2g9ODY7cT03NTt3PTEzMA--/http://media.zenfs.com/en_us/News/ap_webfeeds/b930196977b44042b7e8d1266256f31d.jpg",
          "width": "130"
        },
        "credit": {
          "role": "publishing company"
        }
      }
    ],
    "created": "2016-10-12T21:23:32Z"
  };

  /*
   *
   */
  document.getElementById('refresh-button').addEventListener('click', function() {
    app.getNews();
  });

  app.updateNewsCards = function(data, index) {
    var card = app.visibleCards[index];
    if (card === undefined) {
      card = app.cardTemplate.cloneNode(true);
      app.container.appendChild(card);
      app.visibleCards[index] = card;
    }
    card.classList.remove('card-template');
    card.querySelector('.news-title').textContent = data.item[index].title;
    card.querySelector('.news-description').innerHTML = data.item[index].description;
    card.querySelector('.news-read-more').innerHTML = "<a href='" + data.item[index].link + "'>READ MORE</a>" ;
    card.querySelector('.news-date').textContent = (new Date(data.item[index].pubDate)).toLocaleDateString("en-GB", dateOptions);
    card.removeAttribute('hidden');
    card.style.display = "block";
    debugger;
  };

  /*
   *
   */
  app.getNews = function() {
    var statement = "select * from rss where url='http://news.yahoo.com/rss/topstories' order by pubDate desc limit 2";
    var url = "https://query.yahooapis.com/v1/public/yql?format=json&q=" + statement;

    if ('caches' in window) {
      //si le service worker a enregistré un cache, afficher les données cachées
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json.query.results;
            results.key = key;
            results.label = label;
            results.created = json.query.created;
            app.updateForecastCard(results);
          });
        }
      });
    }

    //send request to get the data
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          debugger;
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.created = response.query.created;
          app.dateContainer.querySelector('.date-last-refresh').textContent = (new Date(results.created)).toLocaleDateString("en-GB", dateOptions);
          app.updateNewsCards(results, 0);
          app.updateNewsCards(results, 1);
        }
      } else {
        // Return the initial news data
        console.log("initialNews");
        console.log(initialNews);
        app.dateContainer.querySelector('.date-last-refresh').textContent = (new Date(initialNews.created)).toLocaleDateString("en-GB", dateOptions);
        app.updateNewsCards(initialNews, 0);
        app.updateNewsCards(initialNews, 1);
      }
    };
    request.open('GET', url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
    request.send();

  };
  app.getNews();

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function() { console.log('Service Worker Registered'); });
  }

})();

