// Patch only the published home sharing tags, preserving all other deployed content.
import {readFileSync,writeFileSync,copyFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
const target=process.argv[2];
if(!target||resolve(target)===process.cwd())throw new Error('Separate deployment checkout required');
const path=join(target,'index.html'),before=readFileSync(path,'utf8'),built=readFileSync('dist/index.html','utf8');
const keys=['og:image','og:image:alt','og:image:type','og:image:width','og:image:height','twitter:card','twitter:image','twitter:image:alt'];
let next=before;
for(const key of keys){
 const pattern=new RegExp(`<meta\\s+(?:property|name)=["']${key}["'][^>]*>`,'g');
 const tags=built.match(pattern);assert.equal(tags?.length,1,`Expected one ${key} in build`);
 next=next.replace(pattern,'').replace('</head>',tags[0]+'</head>');
}
assert.equal(next.slice(next.indexOf('<body')),before.slice(before.indexOf('<body')),'Published body must stay unchanged');
const strip=html=>keys.reduce((value,key)=>value.replace(new RegExp(`<meta\\s+(?:property|name)=["']${key}["'][^>]*>`,'g'),''),html);
assert.equal(strip(next),strip(before),'Only sharing tags may change');
writeFileSync(path,next);
mkdirSync(join(target,'images'),{recursive:true});copyFileSync('dist/images/og-home-v1.png',join(target,'images/og-home-v1.png'));
console.log('Verified: only home sharing metadata and image updated');
