import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
const files=[];
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p);}}
walk('dist');
let checked=0;
for(const file of files){
 const html=readFileSync(file,'utf8');
 assert.ok(!/얼마받지|장려금/.test(html),`Legacy content in ${file}`);
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
const detail=readFileSync('dist/recipes/kimchi-jjigae/index.html','utf8');
for(const text of ['1–2인분','3–4인분','180ml','밥숟가락','qWbHSOplcvY','AI 일러스트','백종원 김치찌개'])assert.ok(detail.includes(text),`Missing recipe detail: ${text}`);
const sitemap=readFileSync('dist/sitemap-0.xml','utf8');
assert.ok(!/\/tools\/|\/guides\/|\/404/.test(sitemap),'Retired URLs in sitemap');
console.log(`Passed: ${files.length} HTML pages; ${checked} local links/assets; recipe, legacy routes and sitemap checked.`);

const recipeUrl='https://gibalpeople.com/recipes/kimchi-jjigae/';
assert.ok(home.includes('href="/recipes/kimchi-jjigae/"'), 'Home must link to recipe');
assert.ok(detail.includes(`rel="canonical" href="${recipeUrl}"`), 'Recipe canonical must use detail URL');
assert.ok(sitemap.includes(recipeUrl), 'Recipe must be in sitemap');
const schemas=[...detail.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
const recipe=schemas.find(schema=>schema['@type']==='Recipe');
assert.equal(recipe.url,recipeUrl);
assert.equal(recipe.recipeInstructions.length,5);
assert.equal(recipe.recipeIngredient.length,10);
for(const step of recipe.recipeInstructions) {
  assert.ok(step.url.startsWith(recipeUrl+'#step-'));
  assert.ok(detail.includes(`id="${new URL(step.url).hash.slice(1)}"`));
  assert.ok(existsSync(join('dist',new URL(step.image).pathname)));
}
const rss=readFileSync('dist/rss.xml','utf8');
assert.ok(rss.includes(`<link>${recipeUrl}</link>`));
assert.ok(rss.includes('<content:encoded>'));
assert.ok(!home.includes('"@type":"Recipe"'), 'Home is a listing, not a recipe');
console.log('Passed: recipe canonical, schema steps/images, listing and RSS.');

const adUrl='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5644793210860513';
for(const file of files.filter(file=>!file.includes('google3e65fdcffb6e8ea4'))) {
 const html=readFileSync(file,'utf8');
 const scripts=[...html.matchAll(/<script\b[^>]*src="([^"]*adsbygoogle\.js[^"]*)"[^>]*>/g)];
 assert.equal(scripts.length,file.endsWith('/404.html')?0:1,`AdSense count: ${file}`);
 for(const [tag,src] of scripts) {
  assert.equal(src,adUrl);
  assert.ok(/\basync(?:[\s=>])/.test(tag)&&tag.includes('crossorigin="anonymous"'));
  assert.ok(html.indexOf(tag)<html.indexOf('</head>'));
 }
}
assert.ok(readFileSync('dist/ads.txt','utf8').includes('google.com, pub-5644793210860513, DIRECT, f08c47fec0942fa0'));
assert.ok(readFileSync('dist/privacy/index.html','utf8').includes('Google 애드센스 광고'));
console.log('Passed: AdSense publisher, head placement, async, single script, 404 exclusion, ads.txt and privacy.');
