import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
const files=[];
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p);}}
walk('dist');
let checked=0;
for(const file of files){
 const html=readFileSync(file,'utf8');
 assert.ok(!/얼마받지|장려금|adsbygoogle/.test(html),`Legacy content in ${file}`);
 for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(!raw.startsWith('/')&&!raw.startsWith('#'))continue;
  const url=new URL(raw,'https://local.test/'+file.replace(/^dist\//,''));
  const path=decodeURIComponent(url.pathname);
  const target=join('dist',path)+(extname(path)?'':(path.endsWith('/')?'index.html':'/index.html'));
  assert.ok(existsSync(target),`${file}: missing ${raw}`);
  if(url.hash&&target.endsWith('.html'))assert.ok(readFileSync(target,'utf8').includes(`id="${url.hash.slice(1)}"`),`${file}: missing anchor ${raw}`);
  checked++;
 }
}
for(const path of ['tools','guides','check','prepare','archive'])assert.ok(!existsSync(`dist/${path}`),`Retired route still exists: ${path}`);
const home=readFileSync('dist/index.html','utf8');
for(const text of ['1–2인분','3–4인분','180ml','밥숟가락','qWbHSOplcvY','AI 일러스트','백종원 김치찌개'])assert.ok(home.includes(text),`Missing recipe detail: ${text}`);
const sitemap=readFileSync('dist/sitemap-0.xml','utf8');
assert.ok(!/\/tools\/|\/guides\/|\/404/.test(sitemap),'Retired URLs in sitemap');
console.log(`Passed: ${files.length} HTML pages; ${checked} local links/assets; recipe, legacy routes and sitemap checked.`);
