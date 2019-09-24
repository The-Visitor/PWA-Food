const staticCacheName = 'site-static-v1';
const dynamicCache = 'site-dynamic-v1'
const assets = [
    '/',
    '/index.html',
    '/pages/fallback.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

//cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

// Install service worker
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching');
            cache.addAll(assets);
        })
    )
})

// activate service worker
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
            .filter(key => key !== staticCacheName && key !== dynamicCache)
            .map(key => caches.delete(key))
            )
        })
    )
})

//fetch
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cache => {
            return cache || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    limitCacheSize(dynamicCache, 3);
                    return fetchRes;
                })
            });
        }).catch(() => {
            if(evt.request.url.indexOf('.html') > -1){
                return caches.match('/pages/fallback.html');
            }
        })
    )
});