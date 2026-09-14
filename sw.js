// Офлайн-кэш «За стойкой». Версия меняется при каждой публикации — старый кэш удаляется.
const V='bk-20260923224441';
const CORE=['./','./index.html','./manifest.webmanifest','./assets/pack/models3d.js','./assets/pack/anims3d.js','./assets/pack/avatars3d.js','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(e.request.method!=='GET' || u.origin!==location.origin) return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=> hit || fetch(e.request).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(V).then(c=>c.put(e.request,cp)); } return r; }).catch(()=>caches.match('./index.html')))); });
