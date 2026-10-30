from pathlib import Path
import subprocess,json,time,base64,sys,datetime,os
ROOT=Path(os.environ.get('INSTAGRAM_DIR',Path.home()/'Automation/instagram-library'))
PROFILE='https://www.instagram.com/recipe__ttukttak/'
def find_page():
 # Use the logged-in Instagram tab in Orca; its page id changes when the tab is reopened.
 p=subprocess.run(['orca','tab','list','--json'],capture_output=True,text=True)
 tabs=json.loads(p.stdout)['result']['tabs'] if p.returncode==0 else []
 hit=[t['browserPageId'] for t in tabs if 'instagram.com' in (t.get('url') or '')]
 if not hit:raise RuntimeError('Orca에 열린 Instagram 탭이 없음 (로그인된 탭을 열어둘 것)')
 return hit[0]
PAGE=find_page()
manifest=json.loads((ROOT/'manifest.json').read_text())
def save(): (ROOT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
def call(*args):
 p=subprocess.run(['orca',*args,'--page',PAGE,'--json'],capture_output=True,text=True)
 if p.returncode:raise RuntimeError(p.stdout[-2000:]+p.stderr[-500:])
 r=json.loads(p.stdout)
 if not r.get('ok'):raise RuntimeError(r)
 return r['result']
def ev(js):return call('eval','--expression',js).get('result')
def wait(text,seconds=90):
 end=time.time()+seconds
 while time.time()<end:
  s=call('snapshot')['snapshot']
  if text in s:return s
  if any(x in s for x in ['나중에 다시 시도','활동이 제한','문제가 발생','로그인하기']):raise RuntimeError(s)
  time.sleep(1)
 raise RuntimeError('Timed out waiting '+text+'\n'+s[-3000:])
def click(t):ev('Array.from(document.querySelectorAll("button,[role=button]")).find(x=>x.textContent==='+json.dumps(t)+').click()')
def shot(path=None):
 r=call('screenshot')
 if path:path.write_bytes(base64.b64decode(r['data']))
def profile():
 call('goto','--url',PROFILE);wait('프로필 편집');call('wait','--selector','a[href*="/p/"]')
 return json.loads(ev('Array.from(document.querySelectorAll(\'a[href*="/p/"]\')).map(x=>x.href)'))
def caption(entry):
 expected=Path(entry['caption']).read_text().strip()
 ev("""(()=>{const e=document.querySelector('[role=textbox][contenteditable]');e.focus();const r=document.createRange();r.selectNodeContents(e);const s=window.getSelection();s.removeAllRanges();s.addRange(r);document.dispatchEvent(new Event('selectionchange'));})()""")
 time.sleep(.5)
 ev("(()=>{const e=document.querySelector('[role=textbox][contenteditable]');const d=new DataTransfer();d.setData('text/plain',"+json.dumps(expected)+");e.dispatchEvent(new ClipboardEvent('paste',{clipboardData:d,bubbles:true,cancelable:true}));})()")
 time.sleep(.5)
 assert ev('document.querySelector("[role=textbox][contenteditable]").innerText').strip()==expected
 ev('document.querySelector("[role=textbox][contenteditable]").blur()')
 shot();time.sleep(1)
 return expected
limit=int(sys.argv[1]) if len(sys.argv)>1 else 29
n=0
for entry in manifest:
 if entry['status'].startswith('published'):continue
 if entry['status']!='prepared_not_published':raise RuntimeError('Reconcile before retry: '+entry['slug']+' '+entry['status'])
 if n>=limit:break
 p=ROOT/entry['slug'];print('START',entry['slug'],entry['concept'],entry['slide_count'],flush=True)
 before=profile()
 ev('document.querySelector(\'[aria-label="새로운 게시물"]\').closest("a").click()');wait('컴퓨터에서 선택')
 result=call('upload','--element','input[type="file"][multiple]','--files',','.join(entry['slides']))
 assert result.get('uploaded')==entry['slide_count'],result
 wait('자르기 선택');ev('document.querySelector(\'[aria-label="자르기 선택"]\').closest("button").click()');wait('세로 방향 자르기 아이콘')
 ev('document.querySelector(\'[aria-label="세로 방향 자르기 아이콘"]\').closest("button,[role=button]").click()')
 shot();click('다음');wait('필터: Normal');click('다음');wait('캡션 추가')
 expected=caption(entry)
 entry['status']='publish_submitted';entry['submitted_at']=datetime.datetime.now(datetime.timezone.utc).isoformat();save()
 click('공유하기');wait('게시물이 공유되었습니다',120)
 print('SHARED',entry['slug'],flush=True)
 after=profile();new=[x for x in after if x not in before]
 assert len(new)==1,(before,after)
 entry['url']=new[0];entry['status']='published_pending_verification';save()
 code=new[0].rstrip('/').split('/')[-1]
 ev('document.querySelector('+json.dumps('a[href*="'+code+'"]')+').click()');shot();wait('옵션 더 보기')
 text=ev('document.querySelector("article").innerText')
 if expected not in text:
  ev('document.querySelector(\'[aria-label="옵션 더 보기"]\').closest("button,[role=button]").click()');wait('수정');click('수정');wait('캡션 추가');caption(entry);click('완료');shot();time.sleep(1)
  text=ev('document.querySelector("article").innerText')
 assert expected in text,('Caption not saved',entry['slug'],text)
 call('wait','--selector','article button[aria-label="다음"]')
 for i in range(entry['slide_count']-1):
  ev('document.querySelector(\'article button[aria-label="다음"]\').click()');shot();time.sleep(.25)
 url=ev('location.href');assert 'img_index='+str(entry['slide_count']) in url,url
 assert ev('!!document.querySelector(\'article button[aria-label="다음"]\')')=='false'
 shot(p/'published-last-slide.png')
 entry['status']='published_verified';entry['published_at']=datetime.datetime.now(datetime.timezone.utc).isoformat();entry['published_caption_verified']=True;entry['published_slide_count_verified']=entry['slide_count'];save()
 print('VERIFIED',entry['slug'],entry['url'],flush=True);n+=1
print('DONE',n,'total',sum(x['status']=='published_verified' for x in manifest),flush=True)
profile()
