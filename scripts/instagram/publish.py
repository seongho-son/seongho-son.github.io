from pathlib import Path
import subprocess,json,time,base64,sys,datetime,os
ROOT=Path(os.environ.get('INSTAGRAM_DIR',Path.home()/'Automation/instagram-library'))
PROFILE='https://www.instagram.com/recipe__ttukttak/'
def target_workspace():
 workspace=os.environ.get('ORCA_WORKSPACE_ID')
 worktree=os.environ.get('ORCA_WORKTREE_ID')
 if workspace and worktree and workspace!=worktree:raise RuntimeError('Workspace IDs disagree')
 if workspace or worktree:return workspace or worktree
 config=ROOT/'browser-workspace.json'
 if not config.exists():raise RuntimeError('Instagram browser workspace is not configured')
 return json.loads(config.read_text())['workspace_id']

def list_tabs():
 p=subprocess.run(['orca','tab','list','--json'],capture_output=True,text=True,timeout=30)
 r=json.loads(p.stdout)
 if p.returncode or not r.get('ok'):raise RuntimeError('Cannot list browser tabs')
 return r['result']['tabs']

def find_page():
 workspace=target_workspace()
 hit=[t['browserPageId'] for t in list_tabs() if t.get('worktreeId')==workspace and 'instagram.com/' in (t.get('url') or '')]
 if hit:return hit[0]
 p=subprocess.run(['orca','tab','create','--url',PROFILE,'--profile','default','--worktree',workspace,'--json'],capture_output=True,text=True,timeout=30)
 if p.returncode or not json.loads(p.stdout).get('ok'):raise RuntimeError('Cannot open Instagram in configured workspace: '+p.stdout[-500:])
 page=json.loads(p.stdout)['result']['browserPageId']
 if not any(t['browserPageId']==page and t.get('worktreeId')==workspace for t in list_tabs()):
  raise RuntimeError('Created Instagram tab is in the wrong workspace')
 time.sleep(5)
 return page
PAGE=None
manifest=json.loads((ROOT/'manifest.json').read_text())
def save(): (ROOT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
def call(*args):
 global PAGE
 if PAGE is None:PAGE=find_page()
 p=subprocess.run(['orca',*args,'--page',PAGE,'--json'],capture_output=True,text=True,timeout=45)
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
def click(t):
 if t not in ('완료','공유하기'):
  ev('Array.from(document.querySelectorAll("button,[role=button]")).find(x=>x.textContent==='+json.dumps(t)+').click()')
  shot()
  return
 snapshot=call('snapshot')
 refs=[key for key,value in snapshot['refs'].items() if value.get('role')=='button' and value.get('name')==t]
 if len(refs)!=1:raise RuntimeError('Expected one button: '+t)
 call('click','--element','@'+refs[0])
 shot() # Complete the background frame before polling the next dialog.
def shot(path=None):
 r=call('screenshot')
 if path:path.write_bytes(base64.b64decode(r['data']))
def profile():
 call('goto','--url',PROFILE);wait('프로필 편집');call('wait','--selector','a[href*="/p/"]')
 return json.loads(ev('Array.from(document.querySelectorAll(\'a[href*="/p/"]\')).map(x=>x.href)'))
def caption(entry):return paste_caption(Path(entry['caption']).read_text().strip())
def editor_text(node):
 if node.get('type')=='linebreak':return '\n'
 if 'text' in node:return node['text']
 children=node.get('children',[])
 separator='\n\n' if node.get('type')=='root' else ''
 return separator.join(editor_text(child) for child in children)

def paste_caption(expected):
 ev("""(()=>{const e=document.querySelector('[role=textbox][contenteditable]');e.focus();const r=document.createRange();r.selectNodeContents(e);const s=window.getSelection();s.removeAllRanges();s.addRange(r);document.dispatchEvent(new Event('selectionchange'));})()""")
 shot() # Flush background renderer work before sending native keys.
 call('keypress','--key','Backspace')
 # Synthetic paste changes the DOM but may leave Instagram's editor state empty.
 # Native input plus Enter preserves both editor state and paragraph boundaries.
 for i,line in enumerate(expected.split('\n')):
  if i:call('keypress','--key','Enter')
  if line:call('inserttext','--text',line)
 shot() # Input delivery and React state updates can lag in a background tab.
 assert ev('document.querySelector("[role=textbox][contenteditable]").innerText').strip()==expected
 state=json.loads(ev("""(()=>{const box=document.querySelector('[role=textbox][contenteditable]');const editor=box.__lexicalEditor;if(!editor)throw Error('Unsupported caption editor');return JSON.stringify(editor.getEditorState().toJSON())})()"""))
 if editor_text(state['root']).strip()!=expected:raise RuntimeError('Caption editor state not synchronized')
 ev('document.querySelector("[role=textbox][contenteditable]").blur()')
 shot()
 return expected

def open_post(entry):
 call('goto','--url',entry['url']);shot();wait('옵션 더 보기')

def saved_caption(expected,seconds=15):
 end=time.time()+seconds
 while time.time()<end:
  # A permalink has no article wrapper. Ignore related-post image alt text.
  text=ev('(document.querySelector("article")||document.querySelector("main")).innerText') or ''
  if ' '.join(expected.split()) in ' '.join(text.split()):return True
  time.sleep(1)
 return False

def verify_entry(entry):
 expected=Path(entry['caption']).read_text().strip()
 open_post(entry)
 if not saved_caption(expected,5):
  ev('document.querySelector(\'[aria-label="옵션 더 보기"]\').closest("button,[role=button]").click()')
  wait('수정');click('수정');wait('캡션 추가');caption(entry);click('완료');shot()
  end=time.time()+30
  while ev('!!document.querySelector("[role=textbox][contenteditable]")')=='true':
   if time.time()>end:raise RuntimeError('Caption edit did not finish: '+entry['slug'])
   time.sleep(1)
  # Reload from Instagram, never accept the editor's optimistic local state.
  open_post(entry)
 if not saved_caption(expected):raise RuntimeError('Caption not saved: '+entry['slug'])
 call('wait','--selector','button[aria-label="다음"]')
 for i in range(entry['slide_count']-1):
  ev('document.querySelector(\'button[aria-label="다음"]\').click()');shot();time.sleep(.25)
 url=ev('location.href')
 assert 'img_index='+str(entry['slide_count']) in url,url
 assert ev('!!document.querySelector(\'button[aria-label="다음"]\')')=='false'
 shot(ROOT/entry['slug']/'published-last-slide.png')
 entry.update(status='published_verified',published_at=entry.get('published_at') or entry['submitted_at'],
              verified_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),
              published_caption_verified=True,published_slide_count_verified=entry['slide_count'])
 save();print('VERIFIED',entry['slug'],entry['url'],flush=True)

def reconcile():
 for entry in manifest:
  if entry['status'] in ('published_pending_verification','published_caption_rate_limited'):
   if not entry.get('url'):raise RuntimeError('Missing published URL: '+entry['slug'])
   verify_entry(entry)
  elif entry['status']=='publish_submitted':
   raise RuntimeError('Reconcile submitted post URL before retry: '+entry['slug'])

def main():
 reconcile()
 if '--reconcile' in sys.argv:return
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
  verify_entry(entry);n+=1
 print('DONE',n,'total',sum(x['status']=='published_verified' for x in manifest),flush=True)
 profile()
if __name__=='__main__':main()
