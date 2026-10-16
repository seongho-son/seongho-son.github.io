// 앱 셸만 미리 캐시한다. 외부 요청(애드센스·YouTube 등)과 GET 외 요청은 가로채지 않는다. 셸 파일을 바꾸면 VERSION을 올린다.
// 해시가 붙은 /_astro/* 와 /images/* 는 방문 시 런타임 캐시로 저장한다.
const VERSION='recipe-ttukttak-v1';
const SHELL=['/','/favicon.svg','/manifest.webmanifest','/icons/icon-192.png','/icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==location.origin)return;
 if(req.mode==='navigate'){
  // 문서는 네트워크 우선. 방문한 페이지를 경로(쿼리 제외)별로 저장하고, 오프라인이면 그 페이지 또는 홈을 보여준다
  const key=url.origin+url.pathname;
  e.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(VERSION).then(c=>c.put(key,copy));}return r;}).catch(async()=>(await caches.match(key))||caches.match('/')));
  return;
 }
 // 정적 파일은 캐시를 먼저 쓰고 백그라운드에서 갱신
 e.respondWith(caches.open(VERSION).then(async c=>{
  const cached=await c.match(req);
  const network=fetch(req).then(r=>{if(r.ok)c.put(req,r.clone());return r;});
  if(cached){e.waitUntil(network.catch(()=>{}));return cached;}
  return network;
 }));
});
