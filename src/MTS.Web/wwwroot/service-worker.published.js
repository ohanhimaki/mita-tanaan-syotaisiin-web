self.importScripts('./service-worker-assets.js');
self.addEventListener('install', event => event.waitUntil(onInstall(event)));
self.addEventListener('activate', event => event.waitUntil(onActivate(event)));
self.addEventListener('fetch', event => event.respondWith(onFetch(event)));
self.addEventListener('push', function (event) {
  const payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: 'android-chrome-192x192.png'
    })
  );
});

const cacheNamePrefix = 'mts-cache-';
const cacheName = `${cacheNamePrefix}${self.assetsManifest.version}`;
const offlineAssetsInclude = [/\.dll$/, /\.pdb$/, /\.wasm/, /\.html/, /\.js$/, /\.json$/, /\.css$/, /\.woff$/, /\.woff2$/, /\.png$/, /\.jpe?g$/, /\.gif$/, /\.ico$/, /\.blat$/, /\.dat$/];
const offlineAssetsExclude = [/^service-worker\.js$/];

async function onInstall(event) {
  console.info('Service worker: Install, cache version', cacheName);
  const assetsRequests = self.assetsManifest.assets
    .filter(asset => offlineAssetsInclude.some(p => p.test(asset.url)))
    .filter(asset => !offlineAssetsExclude.some(p => p.test(asset.url)))
    .map(asset => new Request(asset.url, { integrity: asset.hash, cache: 'no-cache' }));
  await caches.open(cacheName).then(cache => cache.addAll(assetsRequests));
}

async function onActivate(event) {
  console.info('Service worker: Activate');
  const cacheKeys = await caches.keys();
  await Promise.all(
    cacheKeys
      .filter(key => key.startsWith(cacheNamePrefix) && key !== cacheName)
      .map(key => caches.delete(key))
  );
}

async function onFetch(event) {
  let cachedResponse = null;
  if (event.request.method === 'GET') {
    const shouldServeIndexHtml = event.request.mode === 'navigate';
    const request = shouldServeIndexHtml ? 'index.html' : event.request;
    const cache = await caches.open(cacheName);
    cachedResponse = await cache.match(request);
  }
  return cachedResponse || fetch(event.request);
}
