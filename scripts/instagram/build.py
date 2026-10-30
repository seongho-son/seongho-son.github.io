from pathlib import Path
import json,re,html,urllib.request,concurrent.futures,zipfile,subprocess,os
from playwright.sync_api import sync_playwright
# Card layout and copy rules are unchanged from the hand-run library; only the data source and queue handling differ.
ROOT=Path(os.environ.get('INSTAGRAM_DIR',Path.home()/'Automation/instagram-library'))
DATA=json.loads((ROOT/'recipes-source.json').read_text())
def plain(s):return html.unescape(re.sub('<[^>]+>','',s or ''))
def esc(s):return html.escape(str(s))
def split_text(s,limit=240):
 s=plain(s); parts=re.split(r'(?<=[.!?요다])\s+(?=[가-힣A-Za-z0-9“「])',s) if len(s)>limit else [s]
 out=[];buf=''
 for p in parts:
  if len(buf)+len(p)>limit and buf:out.append(buf);buf=''
  buf+=((' ' if buf else '')+p)
 if buf:out.append(buf)
 return out
# Step text emphasizes only ingredient names (bold + accent), mirroring the site's RecipeBook.
MODIFIERS={'고운','굵은','다진','썬','송송','것','또는','익은','마무리','선택','고명용','양념장용','밑간용','믹서용'}
def ingredient_re(ingredients):
 names=set()
 for raw,*_ in ingredients:
  main=re.sub(r'\(.*?\)','',raw.split('·')[0]).strip()
  if main:names.add(main)
  names.update(w for w in main.split() if len(w)>=2 and w not in MODIFIERS)
 if not names:return None
 alts=[re.escape(n)+('(?=[을를이가은는과와도에만로의,·\\s.)]|$)' if len(n)==1 else '') for n in sorted(names,key=len,reverse=True)]
 return re.compile('(?<![가-힣A-Za-z])('+'|'.join(alts)+')')
def mark(text,rx):
 t=esc(text)
 return rx.sub(r'<strong class="ing">\1</strong>',t) if rx else t
CSS='''*{box-sizing:border-box}body{margin:0;color:#191919;font-family:'Apple SD Gothic Neo',sans-serif;-webkit-font-smoothing:antialiased;background:#e8e6e0}.card{width:600px;height:750px;position:relative;padding:34px;background:#fff9ed;overflow:hidden;--ink:#191919;--accent:#ffdc35;color:var(--ink)}.brand{font-size:17px;font-weight:800;display:flex;justify-content:space-between;align-items:center}.brand span{font-size:13px}.foot{position:absolute;left:34px;right:34px;bottom:23px;border-top:1.5px solid currentColor;padding-top:12px;font-size:14px;display:flex;justify-content:space-between;gap:20px}.cover{background:#ffdc35}.tag{display:inline-block;background:#191919;color:#fff9ed;font-weight:800;font-size:17px;padding:7px 12px;margin-top:25px;transform:rotate(-3deg)}h1,h2,p{margin:0}h1{font-size:57px;line-height:1.1;font-weight:900;letter-spacing:-3px;word-break:keep-all;margin-top:20px;height:140px;display:flex;align-items:center}h1 span{border-bottom:5px solid currentColor;padding-bottom:6px}.cover img{position:absolute;left:34px;top:310px;width:532px;height:299px;object-fit:contain;border:3px solid #191919;box-shadow:6px 6px 0 #191919}.credit{position:absolute;top:630px;left:34px;right:34px;font-size:13px;line-height:1.4}.label{font-size:17px;font-weight:800;margin:30px 0 12px}.label b{display:inline-grid;place-items:center;min-width:45px;height:45px;background:var(--accent);color:var(--ink);font-size:24px;margin-right:12px;transform:rotate(-4deg)}h2{font-size:43px;line-height:1.16;letter-spacing:-2px;word-break:keep-all;font-weight:900}.content{margin-top:24px}.row,.tablehead{display:grid;grid-template-columns:1.35fr 1fr 1fr;gap:10px;align-items:center}.tablehead{font-size:16px;font-weight:800;border-bottom:2px solid currentColor;padding:12px 10px;background:var(--accent)}.row{font-size:21px;line-height:1.3;border-bottom:1px solid #19191935;padding:11px 10px;word-break:keep-all}.row b{font-size:20px;font-weight:400}.note{font-size:16px;line-height:1.4;margin-top:15px;word-break:keep-all}.step .content{font-size:25px;line-height:1.5;word-break:keep-all}.step .content p{margin-bottom:20px}.step .content strong.ing{font-weight:800;color:#ac4c30}.step.alt .content strong.ing{color:#ff9d6e}.step.alt{background:#191919;color:#fff9ed}.step.alt .label b{color:#191919}.step.final{background:#ffdc35}.blue{--ink:#172fc4;--accent:#ffb59f;background:#f2f0e9}.blue .brand{border-bottom:2px solid currentColor;padding-bottom:13px}.blue.cover{background:#172fc4;color:#f2f0e9}.blue.cover .tag{position:absolute;top:89px;left:34px;margin:0;transform:none;background:#f2f0e9;color:#172fc4;font-size:16px}.blue.cover img{top:142px;border:0;box-shadow:none}.blue.cover h1{position:absolute;top:462px;left:34px;right:34px;margin:0;height:130px;color:#ffb59f;font-size:54px}.blue.cover h1 span{border:0}.blue.cover .credit{top:623px}.blue .label b{background:none;color:#172fc4;font-family:Georgia,serif;font-size:46px;transform:none}.blue .tablehead{background:none;border-top:2px solid currentColor}.blue .row{border-bottom-color:#172fc440}.blue.step.alt{background:#f2f0e9;color:#172fc4}.blue.step.final{background:#172fc4;color:#f2f0e9}.blue.step.final .label b{color:#ffb59f}.blue.step .content strong.ing{color:#c2410c}.blue.step.final .content strong.ing{color:#ffb59f}main{display:flex;gap:20px;padding:20px;width:max-content}'''

def thumb(r):
 slug=r.get('slug') or r['recipeMeta']['path'].strip('/').split('/')[-1];p=ROOT/slug;p.mkdir(exist_ok=True)
 f=p/'thumbnail.jpg'
 if not f.exists():
  for quality in ['maxresdefault','hqdefault']:
   try:
    req=urllib.request.Request(f'https://i.ytimg.com/vi/{r["videoId"]}/{quality}.jpg',headers={'User-Agent':'Mozilla/5.0'})
    b=subprocess.check_output(["curl","-fsSL","--max-time","30",req.full_url])
    from PIL import Image
    import io
    im=Image.open(io.BytesIO(b))
    if im.width<400:continue
    f.write_bytes(b);break
   except Exception:pass
  assert f.exists(),slug
 return slug
existing_list=json.loads((ROOT/'manifest.json').read_text()) if (ROOT/'manifest.json').exists() else []
existing_manifest={x['slug']:x for x in existing_list}
def slug_of(r):return r.get('slug') or r['recipeMeta']['path'].strip('/').split('/')[-1]
# Published posts keep their entry as is; queued ones are re-rendered; new blog posts join the end of the queue.
queue=[r for r in DATA if not existing_manifest.get(slug_of(r),{}).get('status','').startswith('published')]
order={x['slug']:i for i,x in enumerate(existing_list)}
queue.sort(key=lambda r:(order.get(slug_of(r),len(order)),-DATA.index(r)))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(thumb,queue))
last=existing_list[-1]['concept'] if existing_list else 'blue'
manifest=[x for x in existing_list if x['status'].startswith('published')]
for r in queue:
 slug=slug_of(r);p=ROOT/slug;published=False
 # Yellow and blue alternate; a queued post keeps the concept it was first given.
 color=existing_manifest.get(slug,{}).get('concept') or ('yellow' if last=='blue' else 'blue');last=color;dish=r.get('dish') or ('제육볶음' if 'jeyuk' in slug else '김치찌개')
 title=r['recipeMeta']['title'];hook=title.split(', ',1)[-1] if ', ' in title else title
 if slug=='kim-seoul-jeyuk':hook='밑간부터 차근차근,\n매콤달콤 한 접시.'
 items=[]
 items.append(('cover',f'<div class="tag">{esc(dish)}</div><h1><span>{esc(hook).replace(chr(10),"<br>")}</span></h1><img src="thumbnail.jpg" alt="{esc(dish)} 원본 영상 썸네일"><p class="credit">영상·썸네일: {esc(r["channel"])}<br>비공식 레시피 정리</p>'))
 ingredients=r['ingredients'];rx=ingredient_re(ingredients)
 # Six rows keep both serving columns readable, including long alternative quantities.
 for n in range(0,len(ingredients),6):
  rows=ingredients[n:n+6]
  content='<div class="label">INGREDIENTS · 재료 체크</div><h2>요리 전에,<br>이것부터 챙겨요.</h2><div class="content"><div class="tablehead"><span>재료</span><span>1–2인분</span><span>3–4인분</span></div>'
  content+=''.join(f'<div class="row"><span>{esc(a)}</span><b>{esc(b)}</b><b>{esc(c)}</b></div>' for a,b,c in rows)+'</div>'
  content+='<p class="note">블로그의 인분별 분량 기준 · 계량 설명은 다음 장</p>' if n+6>=len(ingredients) else '<p class="note">재료가 더 있어요. 다음 장에서 이어서 확인 →</p>'
  items.append(('ingredients',content))
 notes=[plain(r.get('measureNote','')),plain(r.get('portionNote',''))]
 notes=[t for t in notes if t]
 chunks=[]
 for t in notes:chunks+=split_text(t,260)
 for j in range(0,len(chunks),2):
  items.append(('step', '<div class="label">재료 · 계량 기준</div><h2>분량은 이렇게<br>맞춰주세요.</h2><div class="content">'+''.join('<p>'+esc(x)+'</p>' for x in chunks[j:j+2])+'</div>'))
 for k,step in enumerate(r['steps']):
  paragraphs=[]
  for txt in step['paragraphs']:paragraphs+=split_text(txt,260)
  groups=[];buf=[]
  for txt in paragraphs:
   if sum(len(t) for t in buf)+len(txt)>330 and buf:groups.append(buf);buf=[]
   buf.append(txt)
  if buf:groups.append(buf)
  for part,group in enumerate(groups):
   classes='step'+(' alt' if k%2==0 else '')
   if k==len(r['steps'])-1 and part==len(groups)-1:classes='step final'
   content=f'<div class="label"><b>{k+1:02}</b>조리 순서'+(' · 이어서' if part else '')+f'</div><h2>{esc(step["name"])}</h2><div class="content">'+''.join('<p>'+mark(t,rx)+'</p>' for t in group)+'</div>'
   items.append((classes,content))
 assert len(items)<=20,(slug,len(items))
 cards=[]
 for n,(cls,body) in enumerate(items):
  foot='재료부터 순서까지, 넘겨서 저장 →' if n==0 else ('자세한 레시피 · gibalpeople.com' if n==len(items)-1 else dish+' · 저장해두고 따라 해요')
  cards.append(f'<section class="card {color} {cls}"><div class="brand">레시피 나와라 뚝딱!<span>@recipe__ttukttak</span></div>{body}<div class="foot"><span>{esc(foot)}</span><span>{n+1:02} / {len(items):02}</span></div></section>')
 doc='<!doctype html><html lang="ko"><meta charset="utf-8"><title>'+esc(title)+'</title><style>'+CSS+'</style><body><main>'+''.join(cards)+'</main></body></html>'
 if not published:p.joinpath('preview.html').write_text(doc)
 caption=f'{dish}, 오늘은 이걸로 🍳\n\n{plain(r["recipeMeta"]["description"])}\n\n재료는 1–2인분 / 3–4인분으로, 조리 순서는 카드에 담았어요.\n저장해두고 요리할 때 꺼내보세요.\n\n자세한 레시피: https://gibalpeople.com{r["recipeMeta"]["path"]}\n원본 영상·썸네일: {r["channel"]}\nhttps://www.youtube.com/watch?v={r["videoId"]}\n\n#{dish.replace(" ","")} #집밥레시피 #오늘뭐먹지 #레시피나와라뚝딱'
 # Do not repeat first-person cooking claims from legacy blog copy.
 if slug=='kim-seoul-jeyuk':caption=caption.replace(plain(r['recipeMeta']['description']),'앞다리살에 밑간하고, 채소와 양념을 더해 볶는 제육볶음이에요.')
 if not published:
  p.joinpath('caption.txt').write_text(caption+'\n')
  p.joinpath('source.json').write_text(json.dumps(r,ensure_ascii=False,indent=2))
 manifest.append({'slug':slug,'dish':dish,'concept':color,'status':'prepared_not_published','slide_count':len(items),'slides':[str(p/f'{n+1:02}.png') for n in range(len(items))],'caption':str(p/'caption.txt'),'source_url':'https://gibalpeople.com'+r['recipeMeta']['path']})
for entry in manifest:
 old=existing_manifest.get(entry['slug'],{})
 for key in ['status','url','submitted_at','published_at','published_caption_verified','published_slide_count_verified']:
  if key in old:entry[key]=old[key]
ROOT.joinpath('manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless=True)
 page=browser.new_page(viewport={'width':640,'height':800},device_scale_factor=1.8)
 for entry in manifest:
  if entry.get('status','').startswith('published'):continue
  p=ROOT/entry['slug'];page.goto(p.joinpath('preview.html').as_uri());page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
  # Fit within each card without cropping; preserve a minimum readable body size.
  result=page.evaluate('''()=>Array.from(document.querySelectorAll('.card')).map(c=>{const foot=c.querySelector('.foot');const end=foot.offsetTop-18;const blocks=c.querySelectorAll('.content,.note');for(let attempt=0;attempt<12;attempt++){const last=blocks[blocks.length-1];if(!last||last.offsetTop+last.offsetHeight<=end)break;for(const e of c.querySelectorAll('.content,.content .row,.content .row b,.note')){const fs=parseFloat(getComputedStyle(e).fontSize);e.style.fontSize=(fs-.5)+'px'}for(const e of c.querySelectorAll('.content p'))e.style.marginBottom='14px'}const last=blocks[blocks.length-1];return {overflow:last?last.offsetTop+last.offsetHeight>end:false,minFont:Math.min(...Array.from(c.querySelectorAll('.content,.row,.row b')).map(e=>parseFloat(getComputedStyle(e).fontSize))),h1:c.querySelector('h1')?.scrollHeight}})''')
  assert not any(x['overflow'] for x in result),(entry['slug'],result)
  for n,card in enumerate(page.locator('.card').all()):card.screenshot(path=str(p/f'{n+1:02}.png'))
  entry['layout_checks']=result
  with zipfile.ZipFile(p/'cards.zip','w',zipfile.ZIP_DEFLATED) as z:
   for path in entry['slides']:z.write(path,Path(path).name)
   z.write(p/'caption.txt','caption.txt')
  print(entry['slug'],entry['concept'],entry['slide_count'],'rendered',flush=True)
 browser.close()
ROOT.joinpath('manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
