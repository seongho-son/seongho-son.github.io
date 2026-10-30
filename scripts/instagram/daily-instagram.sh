#!/usr/bin/env bash
# 인스타그램 자동 발행: 사이트 레시피 데이터 → 카드 생성 → 대기열 맨 앞 1개 게시 → 캡션·장수 검증.
# launchd(~/Library/LaunchAgents/com.gibalpeople.instagram.plist)가 매일 15시에 실행한다(블로그 13시 발행 뒤).
# 게시는 Orca 브라우저에 로그인된 Instagram 탭을 조작한다. Orca가 꺼져 있거나 탭이 없으면 실패 알림만 보낸다.
# 카드·manifest 상태는 저장소 밖 $INSTAGRAM_DIR에 둔다(launchd는 ~/Desktop에 접근 못 함, 저장소 작업 트리를 더럽히지 않음).
# 수동 실행: bash scripts/instagram/daily-instagram.sh   (카드만 만들고 게시 안 함: DRY_RUN=1)
set -uo pipefail

# 카드 생성에 Pillow·Playwright가 설치된 python.org 파이썬을 쓴다(Homebrew 파이썬에는 없음).
export PATH="/Library/Frameworks/Python.framework/Versions/3.12/bin:/Applications/Orca.app/Contents/Resources/bin:/opt/homebrew/bin:/Users/shon/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export INSTAGRAM_DIR="${INSTAGRAM_DIR:-$HOME/Automation/instagram-library}"
LOG_DIR="$HOME/Library/Logs/recipe-ttukttak"
LOCK="$LOG_DIR/instagram.lock"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="$LOG_DIR/instagram-$STAMP.log"
mkdir -p "$LOG_DIR"
exec >>"$LOG" 2>&1

notify() { osascript -e "display notification \"$2\" with title \"레시피 뚝딱 인스타: $1\"" >/dev/null 2>&1 || true; }
fail() { echo "✗ $1"; notify "실패" "$1 (로그: $LOG)"; exit 1; }

echo "▶ start $STAMP"
mkdir "$LOCK" 2>/dev/null || fail "이미 실행 중 ($LOCK)"
trap 'rmdir "$LOCK" 2>/dev/null' EXIT
[[ -f "$INSTAGRAM_DIR/manifest.json" ]] || fail "manifest 없음: $INSTAGRAM_DIR"
cd "$REPO_DIR" || fail "저장소 없음"
# 블로그 발행이 진행 중이면(작업 트리 변경) 최신 글 반영을 다음 실행으로 미룬다.
if [[ -z "$(git status --porcelain)" ]]; then git pull --ff-only --quiet || echo "pull 실패 — 현재 데이터로 진행"; else echo "작업 트리 사용 중 — pull 생략"; fi

python3 scripts/instagram/growth.py report || fail "운영 기록 갱신 실패"
if [[ "${DRY_RUN:-0}" != 1 ]]; then
  due="$(python3 scripts/instagram/growth.py due)" || fail "발행 일정 확인 실패"
  [[ "$due" == yes ]] || { echo "2주 운영 일정 또는 오늘 발행 이력에 따라 게시 생략"; exit 0; }
fi

echo "▶ export"
node scripts/instagram/export-source.mjs "$INSTAGRAM_DIR/recipes-source.json" || fail "데이터 내보내기 실패"
echo "▶ build"
python3 scripts/instagram/build.py || fail "카드 생성 실패"
queued="$(python3 -c "import json,os;m=json.load(open(os.environ['INSTAGRAM_DIR']+'/manifest.json'));print(sum(x['status']=='prepared_not_published' for x in m))")"
echo "대기 중인 게시물: $queued"
[[ "$queued" -gt 0 ]] || { echo "게시할 글 없음"; exit 0; }
[[ "${DRY_RUN:-0}" == 1 ]] && { echo "DRY_RUN — 게시 생략"; exit 0; }

echo "▶ publish"
orca status --json | grep -q '"reachable": true' || fail "Orca 런타임에 연결 안 됨 (Orca 앱 실행 필요)"
python3 scripts/instagram/publish.py 1 || fail "게시 실패 — manifest 상태 확인 후 재시도"
slug="$(python3 -c "import json,os;m=[x for x in json.load(open(os.environ['INSTAGRAM_DIR']+'/manifest.json')) if x.get('published_at')];m.sort(key=lambda x:x['published_at']);print(m[-1]['slug'],m[-1]['url'])")"
python3 scripts/instagram/growth.py report || fail "게시 후 운영 기록 갱신 실패"
echo "✓ 게시 완료: $slug"
notify "게시 완료" "$slug"
