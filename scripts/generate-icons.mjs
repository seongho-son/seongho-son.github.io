import {chromium} from '/Users/shon/Desktop/project/gibal-people/todo/node_modules/playwright/index.mjs';
// 파비콘(public/favicon.svg)과 같은 냄비 로고로 PWA 아이콘을 생성한다. maskable은 안전 영역(72%) 안에 로고를 둔다.
const icons=[
 {file:'icon-192.png',size:192,radius:.25,scale:1},
 {file:'icon-512.png',size:512,radius:.25,scale:1},
 {file:'icon-maskable-512.png',size:512,radius:0,scale:.72},
 {file:'apple-touch-icon.png',size:180,radius:0,scale:1},
];
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 for(const {file,size,radius,scale} of icons){
  const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
  const mark=size*scale;
  await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}div{width:${size}px;height:${size}px;display:grid;place-items:center;background:#233c31;border-radius:${size*radius}px}svg{display:block}</style><div><svg width="${mark}" height="${mark}" viewBox="0 0 64 64"><g fill="none" stroke="#faf8f3" stroke-width="3" stroke-linecap="round"><path d="M17 30h30v10a12 12 0 0 1-12 12h-6a12 12 0 0 1-12-12zM11 33h6m30 0h6M24 22c-5-6 5-7 0-13m10 13c-5-6 5-7 0-13m10 13c-5-6 5-7 0-13"/></g></svg></div>`);
  await page.screenshot({path:new URL('../public/icons/'+file,import.meta.url).pathname,omitBackground:true});
  await page.close();
 }
}finally{await browser.close()}
