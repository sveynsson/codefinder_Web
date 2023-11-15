// Pfad zu deinem GitHub Pages Repository
var GHPATH = '/codefinder_Web';

// Ein Präfix für den Namen deiner App
var APP_PREFIX = 'codefinder_';

// Version des Cache
var VERSION = 'version_01';

// Dateien, die offline verfügbar gemacht werden sollen
var URLS = [
  `/`,
  `/index.html`,
  `/script.js`,
  `/style.css`,
  `/data.csv`,
  `/manifest.json`,
  `/icon/lowres.webp`,
  `/icon/hd_hi.ico`
]

// Installiere den Service Worker und cache alle App-Assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(APP_PREFIX + VERSION)
      .then(function (cache) {
        return cache.addAll(URLS);
      })
  )
});

// Aktiviere den Service Worker und lösche alte Caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheWhitelist.push(APP_PREFIX + VERSION);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});

// Hole Ressourcen aus dem Cache oder vom Netzwerk
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
