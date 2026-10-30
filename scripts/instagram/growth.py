"""Two-week cadence and honest measurement sheet; never publishes or reads credentials."""
import csv,json,os,sys
from datetime import date,datetime
from pathlib import Path
from zoneinfo import ZoneInfo
PLAN=json.loads(Path(__file__).with_name('growth-plan.json').read_text())
SEOUL=ZoneInfo('Asia/Seoul')
def local_day(value):
    dt=datetime.fromisoformat(value.replace('Z','+00:00'))
    if dt.tzinfo is None:raise ValueError('Publication timestamp needs timezone')
    return dt.astimezone(SEOUL).date()
def due(today,manifest):
    # A submitted/uncertain post must be reconciled by the existing publisher, never retried here.
    if any(x.get('published_at') and local_day(x['published_at'])==today for x in manifest):return False
    start=date.fromisoformat(PLAN['start_date']);end=date.fromisoformat(PLAN['end_date'])
    return not start<=today<=end or (today-start).days%PLAN['interval_days']==0
FIELDS=['slug','published_at','url','concept','measured_at','reach','saves','shares','profile_visits','follows','save_rate','share_rate','follow_per_profile_visit','notes']
def report(root,manifest):
    target=root/'growth-metrics.csv'
    prior={}
    if target.exists():
        with target.open(newline='') as f:prior={r['slug']:r for r in csv.DictReader(f)}
    rows=[]
    for x in manifest:
        if not x.get('published_at'):continue
        day=local_day(x['published_at'])
        if not PLAN['start_date']<=day.isoformat()<=PLAN['end_date']:continue
        row={k:prior.get(x['slug'],{}).get(k,'') for k in FIELDS}
        row.update({k:x.get(k,'') for k in ['slug','published_at','url','concept']})
        for field,num,den in [('save_rate','saves','reach'),('share_rate','shares','reach'),('follow_per_profile_visit','follows','profile_visits')]:
            row[field]=''
            if row[num]!='' and row[den]!='' and float(row[den])>0:row[field]=f'{float(row[num])/float(row[den]):.4f}'
        rows.append(row)
    temp=target.with_suffix('.tmp')
    with temp.open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=FIELDS);w.writeheader();w.writerows(rows)
    temp.replace(target)
    (root/'growth-review.md').write_text(f"# 2주 운영 점검\n\n기간: {PLAN['start_date']}–{PLAN['end_date']} (서울)\n점검일: {', '.join(PLAN['review_dates'])}\n기간 내 게시 기록: {len(rows)}개\n\n인사이트는 자동 수집하지 않습니다. 게시 48시간 후 같은 관찰 기간의 수치를 growth-metrics.csv에 입력하세요. 미확인 값은 빈칸이며 0이 아닙니다. 저장/도달, 공유/도달, 팔로우/프로필 방문을 비교하고 전체 수치가 부족하면 결론을 보류하세요. 게시물별 프로필 방문·팔로우가 제공되지 않으면 해당 칸은 비워두고 계정 인사이트를 별도로 비교하세요.\n")
if __name__=='__main__':
    root=Path(os.environ.get('INSTAGRAM_DIR',Path.home()/'Automation/instagram-library'))
    manifest=json.loads((root/'manifest.json').read_text())
    if sys.argv[1]=='due':print('yes' if due(datetime.now(SEOUL).date(),manifest) else 'no')
    elif sys.argv[1]=='report':report(root,manifest)
    else:raise SystemExit('Expected due or report')
