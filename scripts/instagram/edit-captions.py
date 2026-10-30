"""Remove the old disclaimer paragraph from already-published captions, a few posts per run.

Instagram rate-limits caption edits, so this runs after the daily publish and stops at the
first sign of a limit; the remaining posts are picked up on the next run.
Usage: python3 edit-captions.py [max_edits]
"""
import json,sys,time
import publish as ig

DISCLAIMER=('직접 조리 검증 전','제휴 관계')
def clean(text):
 # Drop any paragraph that is the old disclaimer; keep everything else as written.
 paras=[p for p in text.split('\n\n') if not all(k in p for k in DISCLAIMER)]
 return '\n\n'.join(paras).strip()

def post_text():
 # A post opened by URL renders without <article>; the caption is inside <main>.
 time.sleep(2)
 return ig.ev('(document.querySelector("main")||document.body).innerText') or ''

def open_post(url):
 ig.call('goto','--url',url);ig.wait('옵션 더 보기')

# Pasting over an existing caption only changes the DOM, Instagram saves the old text.
# Deleting the paragraph with the editor's own delete command is saved correctly.
DELETE_JS="""(()=>{const box=document.querySelector('[role=textbox][contenteditable]');box.focus();
const w=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const t=n.textContent;
const k=t.search(/[^\\n]*직접 조리 검증 전[^\\n]*제휴 관계[^\\n]*/);if(k<0)continue;const end=t.indexOf('\\n',k)<0?t.length:t.indexOf('\\n',k);
const start=t.lastIndexOf('\\n\\n',k);const r=document.createRange();r.setStart(n,start<0?k:start);r.setEnd(n,end);
const s=getSelection();s.removeAllRanges();s.addRange(r);return document.execCommand('delete')}return false})()"""
def edit(entry,new):
 ig.ev('document.querySelector(\'[aria-label="옵션 더 보기"]\').closest("button,[role=button]").click()')
 ig.wait('수정');ig.click('수정');ig.wait('캡션 추가');time.sleep(1)
 if ig.ev('document.querySelector("[role=textbox][contenteditable]").innerText').strip():
  assert ig.ev(DELETE_JS),('삭제 대상 문단을 못 찾음',entry['slug'])
 else:
  ig.paste_caption(new)
 assert ig.ev('document.querySelector("[role=textbox][contenteditable]").innerText').strip()==new.strip(),('편집 결과가 기대와 다름',entry['slug'])
 ig.click('완료');time.sleep(4)

def main():
 limit=int(sys.argv[1]) if len(sys.argv)>1 else 3
 done=0
 for entry in ig.manifest:
  if not entry['status'].startswith('published') or entry.get('caption_cleaned') or not entry.get('url'):continue
  if done>=limit:break
  open_post(entry['url'])
  text=post_text()
  if not all(k in text for k in DISCLAIMER) and entry['status']=='published_verified':
   entry['caption_cleaned']=True;ig.save();print('ALREADY CLEAN',entry['slug'],flush=True);continue
  if entry['status']=='published_caption_rate_limited':
   # Caption was never saved: write the prepared caption without the disclaimer.
   new=clean(open(entry['caption']).read())
  else:
   new=clean(open(entry['caption']).read()) if entry.get('caption') else None
   if not new or new.split('\n',1)[0] not in text:raise RuntimeError('기존 캡션과 저장 파일이 달라 수동 확인 필요: '+entry['slug'])
  edit(entry,new)
  open_post(entry['url']);text=post_text()
  assert new.split('\n',1)[0] in text and not all(k in text for k in DISCLAIMER),('캡션 저장 확인 실패',entry['slug'])
  entry['caption_cleaned']=True;entry['status']='published_verified';entry['published_caption_verified']=True;ig.save()
  print('CLEANED',entry['slug'],entry['url'],flush=True);done+=1;time.sleep(20)
 left=sum(1 for e in ig.manifest if e['status'].startswith('published') and e.get('url') and not e.get('caption_cleaned'))
 print('EDITED',done,'LEFT',left,flush=True)

if __name__=='__main__':main()
