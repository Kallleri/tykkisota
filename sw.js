const CACHE='tsota-1795767092';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),same=u.origin===location.origin,font=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font)return; // esim. moninpelin yhteyskirjasto ja välityspalvelin menevät suoraan verkkoon
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit;}
    return (await net)||(r.mode==='navigate'?await c.match('index.html'):Response.error());
  }));
});
