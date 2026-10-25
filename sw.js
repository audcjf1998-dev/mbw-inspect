// 오프라인 캐시 (앱 셸)
const CACHE='mbw-inspect-2026.10.25-1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./lib/html2canvas.min.js','./lib/jspdf.umd.min.js','./lib/xlsx.full.min.js','./lib/jszip.min.js','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-512-maskable.png','./icons/apple-touch-icon.png'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  if (e.request.method!=='GET') return;
  const url=new URL(e.request.url); if (url.origin!==location.origin) return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(res=>{ if(res && res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); } return res; }).catch(()=>hit || caches.match('./index.html'));
    return hit || net;
  }));
});
