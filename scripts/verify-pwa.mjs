import {chromium} from '/Users/shon/Desktop/project/gibal-people/todo/node_modules/playwright/index.mjs';
// 빌드 결과(dist)를 띄운 서버에 대해 PWA 설치 조건과 오프라인 동작을 확인한다.
// PWA_TEST_URL: 대상 주소(기본 http://localhost:8801), PWA_SCREENSHOT: 오프라인 스크린샷 저장 경로(선택)
const base=(process.env.PWA_TEST_URL||'http://localhost:8801').replace(/\/$/,'');
const other='/recipes/kimchi-jjigae/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const ctx=await browser.newContext({viewport:{width:390,height:844}});
const page=await ctx.newPage();
const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+(m.location().url?' @ '+m.location().url:''))});page.on('pageerror',e=>errors.push(String(e)));
await page.goto(base+'/');
await page.evaluate(()=>navigator.serviceWorker.ready);
await page.reload();
const controlled=await page.evaluate(()=>!!navigator.serviceWorker.controller);
const manifest=await page.evaluate(async()=>{const r=await fetch(document.querySelector('link[rel=manifest]').href);return r.json();});
const iconsOk=await page.evaluate(async m=>Promise.all(m.icons.map(async i=>{const r=await fetch(i.src);return i.src+':'+r.status;})),manifest);
const appleIcon=await page.evaluate(async()=>{const r=await fetch(document.querySelector('link[rel=apple-touch-icon]').href);return r.status;});
const cdp=await ctx.newCDPSession(page);
const inst=await cdp.send('Page.getInstallabilityErrors').catch(e=>({err:String(e)}));
// 다른 페이지도 온라인에서 한 번 방문해 캐시에 넣는다
await page.goto(base+other);await page.waitForLoadState('load');
const mainText=async()=>((await page.textContent('#main').catch(()=>''))||'').trim().length;
const h1=async()=>(await page.textContent('h1').catch(()=>null))?.trim()||null;
const onlineOther={h1:await h1()};
await ctx.setOffline(true);
const offline={};
await page.goto(base+'/');
offline.home={title:await page.title(),h1:await h1(),mainChars:await mainText()};
await page.goto(base+other);
offline.other={title:await page.title(),h1:await h1(),mainChars:await mainText(),sameAsOnline:(await h1())===onlineOther.h1};
await page.reload();
offline.otherReload={h1:await h1(),mainChars:await mainText()};
if(process.env.PWA_SCREENSHOT)await page.screenshot({path:process.env.PWA_SCREENSHOT});
await ctx.setOffline(false);
// 오프라인 중 외부(애드센스 등) 요청 실패 로그는 정상이므로 분리해서 보여준다
const offlineNoise=e=>/ERR_INTERNET_DISCONNECTED|Failed to load resource/.test(e);
console.log(JSON.stringify({base,controlled,name:manifest.name,short_name:manifest.short_name,display:manifest.display,iconsOk,appleIcon,inst,offline,errors:errors.filter(e=>!offlineNoise(e)),offlineNetworkErrors:errors.filter(offlineNoise).length},null,1));
await browser.close();
