const PREFIX='onda-shell-'+encodeURIComponent(new URL(self.registration.scope).pathname)+'-';
const CACHE=PREFIX+'v4';
const ASSETS=['./','./index.html','./style.css','./core.js','./app.js','./pwa.js','./icon.svg','./manifest.webmanifest','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./vendor/d3.v7.min.js','./globe.js','./catalog.js','./vendor/lucide-icons.js','./vendor/hls.light.min.js','./data/countries.geojson'];
const URLS=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()])));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(!URLS.has(url.href))return;event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request);return cached||fetch(event.request);}));});
