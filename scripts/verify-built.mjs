import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {join, extname} from 'node:path';
import {CORE_GUIDES} from '../src/lib/editorial.js';
import {RETIRED_TOOLS} from '../src/lib/retired-tools.js';
const files=[];
function walk(dir) {for(const entry of readdirSync(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())walk(p);else if(p.endsWith('.html')) files.push(p);}}
walk('dist');
let links=0;
for(const file of files) {
 const html=readFileSync(file,'utf8');
 for(const [,href] of html.matchAll(/href="([^"]+)"/g)) {
  if(!href.startsWith('/') || href.startsWith('//'))continue;
  const url=new URL(href.replaceAll('&amp;','&'),'https://local.test');
  const path=decodeURIComponent(url.pathname);
  const target=join('dist',path)+(extname(path)?'':(path.endsWith('/')?'index.html':'/index.html'));
  assert.ok(existsSync(target),`${file}: broken link ${href}`);links++;
  if(url.hash && target.endsWith('.html')) assert.ok(readFileSync(target,'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${file}: missing anchor ${href}`);
 }
 const route=file.replace(/^dist/,'').replace(/index.html$/,'').replace(/\/$/,'');
 const slug=route.startsWith('/guides/')?route.split('/').pop():null;
 const ads=html.includes('pagead/js/adsbygoogle.js');
 assert.equal(ads,slug!==null&&CORE_GUIDES.includes(slug),`${file}: ad scope`);
 if(slug && !CORE_GUIDES.includes(slug)) {
  assert.ok(html.includes('noindex, follow'),file);
  assert.ok(html.includes('과거 안내 · 현재 신청 기준으로 사용하지 마세요'),file);
 }
}
const sitemap=readFileSync('dist/sitemap-0.xml','utf8');
for(const slug of CORE_GUIDES)assert.ok(sitemap.includes(`/guides/${slug}/`));
for(const slug of Object.keys(RETIRED_TOOLS)) {
 assert.ok(!sitemap.includes(`/tools/${slug}/`));
 const html=readFileSync(`dist/tools/${slug}/index.html`,'utf8');
 assert.ok(html.includes('운영 종료'));assert.ok(!html.includes('<input'));
}
assert.ok(!sitemap.includes('/archive/'));assert.ok(!sitemap.includes('/check/'));
assert.ok(readFileSync('dist/guides/labor-tax-credit-examples/index.html','utf8').includes('139만 6천원'));
assert.ok(readFileSync('dist/prepare/index.html','utf8').includes('id="prepare-form"'));
console.log(`Built-site checks passed: ${files.length} HTML files, ${links} internal links; ads, archives, retired tools, sitemap and corrected example.`);
