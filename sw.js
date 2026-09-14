// Офлайн-кэш «За стойкой». Версия меняется при каждой публикации — старый кэш удаляется.
const V='bk-20261016200846';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./assets/pack/gen/three3d.js']; // three.js (0,2 МБ) — сразу: без него «Смена» без сети не построится; остальные 3D-файлы — не при первом визите: кэшируются, когда человек впервые откроет «Смену»
self.addEventListener('install',e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
// Фото и голоса гостей (mp3) названы по содержимому и не меняются: свой кэш, переживает публикации. Манифест voice.js — в обычном (V).
const M='bk-media', isMedia=p=>p.includes('/assets/photos/') || (p.includes('/assets/voice/') && p.endsWith('.mp3'));
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V && k!==M).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
// Запросы с Range (звук, видео) — мимо: кусок файла (206) в кэш не кладём и целым файлом на них не отвечаем (Safari такой звук не играет).
// Без сети запасная index.html — только при открытии страницы; скрипту или звуку — ошибка сети (загрузчик повторит, звук — голос браузера).
self.addEventListener('fetch',e=>{ const u=new URL(e.request.url); if(e.request.method!=='GET' || u.origin!==location.origin || e.request.headers.has('range')) return;
  const K=isMedia(u.pathname) ? M : V;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=> hit || fetch(e.request).then(r=>{ if(r.status===200){ const cp=r.clone(); caches.open(K).then(c=>c.put(e.request,cp)); } return r; }).catch(()=> e.request.mode==='navigate' ? caches.match('./index.html') : Response.error()))); });
