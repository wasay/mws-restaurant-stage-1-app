var cachePrefix = 'mws-restaurant-stage-1';
var staticCacheName = cachePrefix + '-v15';
var contentImgsCache = cachePrefix + '-content-imgs';
var allCaches = [
  staticCacheName,
  contentImgsCache
];
    //console.log('staticCacheName=' + (staticCacheName));

self.addEventListener('install', function(event) {
    //console.log('install()');
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
    //console.log('cache=' + (cache));
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/js/sw-reg.js',
        '/js/sw.js',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/css/styles.css',
        'https://fonts.googleapis.com/css?family=Roboto',
        'https://raw.githubusercontent.com/udacity/mws-restaurant-stage-1/master/data/restaurants.json'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
    //console.log('activate()');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-restaurant-stage-1') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetch()');
  var requestUrl = new URL(event.request.url);
  console.log('requestUrl=' + (requestUrl));

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '' || requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
    if (requestUrl.pathname.startsWith('img/') || requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  event.respondWith(serveRequest(event.request));
});

self.addEventListener('message', function(event) {
    //console.log('message()');
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

function servePhoto(request) {

  //console.log('servePhoto()');
  //console.log('request.url=' + (request.url));

  var storageUrl = request.url.replace(/^(\d+-?)+\d+$\.jpg$/, '');
  //console.log('storageUrl=' + (storageUrl));

  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

function serveRequest(request) {

  //console.log('serveRequest()');
  //console.log('request.url=' + (request.url));

  var storageUrl = request.url;
  //console.log('storageUrl=' + (storageUrl));

  return caches.open(staticCacheName).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}