const SHELL='ahorita-shell-2ecw90wv0ky';
const AUDIO='ahorita-audio-v1';
const FILES=["./","./assets/alfa-slab-one-latin-400-normal-CbTZiZTW.woff2","./assets/alfa-slab-one-latin-400-normal-UIGeWgec.woff","./assets/alfa-slab-one-latin-ext-400-normal-DZhSYPC8.woff2","./assets/alfa-slab-one-latin-ext-400-normal-Dg9tQUb7.woff","./assets/alfa-slab-one-vietnamese-400-normal-BeSfPuN6.woff","./assets/alfa-slab-one-vietnamese-400-normal-C0oZnEo7.woff2","./assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff","./assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2","./assets/atkinson-hyperlegible-latin-700-normal-BK6Glc0m.woff","./assets/atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2","./assets/atkinson-hyperlegible-latin-ext-400-normal-Bbz-b3yf.woff","./assets/atkinson-hyperlegible-latin-ext-400-normal-DRk46D-x.woff2","./assets/atkinson-hyperlegible-latin-ext-700-normal-BoVPHkS0.woff2","./assets/atkinson-hyperlegible-latin-ext-700-normal-CKkU2Dpt.woff","./assets/index-BjOKvvyZ.css","./assets/index-x-IWkBH7.js","./audio-manifest.json","./content.json","./icon-180.png","./icon-192.png","./icon-512.png","./index.html","./manifest.webmanifest"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('ahorita-shell-')&&n!==SHELL).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(u.pathname.includes('/audio/')){
    e.respondWith(caches.open(AUDIO).then(async c=>{
      let res=await c.match(u.pathname,{ignoreVary:true});
      if(!res){res=await fetch(u.pathname);if(res.ok)await c.put(u.pathname,res.clone())}
      const range=r.headers.get('range');
      if(!range||!res.ok)return res;
      const buf=await res.arrayBuffer(),m=/bytes=(\d*)-(\d*)/.exec(range)||[],len=buf.byteLength;
      const start=m[1]?+m[1]:0,end=Math.min(m[2]?+m[2]:len-1,len-1);
      return new Response(buf.slice(start,end+1),{status:206,headers:{'Content-Type':res.headers.get('Content-Type')||'audio/mp4','Content-Range':'bytes '+start+'-'+end+'/'+len,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}});
    }));
    return;
  }
  if(r.mode==='navigate'){e.respondWith(caches.match('./index.html',{ignoreVary:true}).then(h=>h||fetch(r)));return}
  e.respondWith(caches.match(r,{ignoreSearch:true,ignoreVary:true}).then(h=>h||fetch(r)));
});
