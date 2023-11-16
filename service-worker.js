var GHPATH = '/codefinder_Web';
var APP_PREFIX = 'codefinder_';
var VERSION = 'version_01';

var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/script.js`,
  `${GHPATH}/style.css`,
  `${GHPATH}/data.csv`,
  `${GHPATH}/manifest.json`
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(APP_PREFIX + VERSION)
      .then(function (cache) {
        return cache.addAll(URLS);
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX) === 0;
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

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
