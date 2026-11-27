import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--no-proxy-server'] });
const p = await b.newPage({ viewport:{width:1440,height:900} });
const codes = {};
p.on('response', r => { const u=r.url(); if (u.includes('/logos/')) codes[r.status()]=(codes[r.status()]||0)+1; });
await p.goto('http://127.0.0.1:3190/', { waitUntil:'networkidle', timeout:45000 });
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=350){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,90));}});
await p.waitForTimeout(2500);
const out = await p.evaluate(async ()=>{
  const bad=[...document.querySelectorAll('img')].filter(i=>i.naturalWidth===0);
  const first = bad[0];
  let decodeErr = null;
  try { await first.decode(); } catch(e) { decodeErr = String(e).slice(0,100); }
  const rect = first.getBoundingClientRect();
  return {
    total: bad.length,
    totalImgs: document.querySelectorAll('img').length,
    first: { complete: first.complete, nw: first.naturalWidth, loading: first.loading,
             rectW: rect.width, rectH: rect.height, decodeErr,
             inViewport: rect.top < innerHeight*3 },
    // how many bad ones are actually visible on screen now
    offscreen: bad.filter(i=>{const r=i.getBoundingClientRect(); return r.width===0||r.height===0;}).length,
  };
});
console.log(JSON.stringify({codes, ...out},null,2));
await b.close();
