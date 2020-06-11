const cacheName = 'news-v1';
const staticAssets = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.webmanifest',
    './heroes.jpg'
];
self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
})

self.addEventListener('activate', e => {
    self.clients.claim();
})

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    // Differentiate traffic on where it is going
    if (url.origin === location.origin) {
        // check first if it is in cache
        e.respondWith(cacheFirst(req));
    } else {
        // else go to the network
        e.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    // open cache file
    const cache = await caches.open(cacheName);
    // check if there is any match
    const cached = await cache.match(req);
    // match then return, else go to network
    return cached || fetch(req);
}

async function networkAndCache(req) {
    // open cache file
    const cache = await caches.open(cacheName);
    try{
        // check if data can be fetched from network
        const fresh = await fetch(req);
        // if yes put it in the cache as a clone
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        // if not go back to cache to find match
        const cached = await cache.match(req);
        return cached;
    }
}