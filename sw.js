/*
  Belkagraph v020 — modo sin conexión.
  © 2026 Héctor Cruz Juárez · SPDX-License-Identifier: GPL-3.0-or-later
*/
const CACHE='belkagraph-v020';
const FILES=['./','index.html','manifest.webmanifest','icono.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('belkagraph-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// primero la red (para recibir versiones nuevas), y si no hay conexión, lo guardado
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));
});
