#!/usr/bin/env bash
# 매주 월·수·금 13시 레시피 자동 발행: 생성 → 검증 → 커밋·push → 배포
# launchd의 월·수·금 13시 일정과 아래 요일 조건을 함께 사용한다.
# 같은 날 중복 발행은 마커로 막는다. 실패하면 다음 예정일에 다시 시도한다.
# 수동 강제 실행: FORCE=1 bash scripts/daily-recipe.sh
set -uo pipefail
export TZ=Asia/Seoul

export PATH="/opt/homebrew/bin:/Users/shon/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$HOME/Library/Logs/recipe-ttukttak"
LOCK="$LOG_DIR/daily-recipe.lock"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="$LOG_DIR/daily-$STAMP.log"
CODEX_TIMEOUT=5400   # 90분
mkdir -p "$LOG_DIR"
exec >>"$LOG" 2>&1

notify() { osascript -e "display notification \"$2\" with title \"레시피 뚝딱: $1\"" >/dev/null 2>&1 || true; }
fail() { echo "✗ $1"; notify "실패" "$1 (로그: $LOG)"; exit 1; }
# 시작 시 작업 트리가 깨끗했을 때만 호출. 지우지 않고 stash에 보관해 `git stash list`로 되살릴 수 있게 한다.
restore() { git stash push -u -q -m "daily-recipe failed $STAMP" || true; }

echo "▶ start $STAMP"
if [[ "${FORCE:-0}" != 1 ]] && ls "$LOG_DIR"/published-"$(date +%Y%m%d)" >/dev/null 2>&1; then echo "오늘 이미 발행 — 건너뜀"; exit 0; fi
if [[ "${FORCE:-0}" != 1 ]]; then
  case "$(date +%u)" in
    1|3|5) ;;
    *) echo "월·수·금 발행 일정 — 오늘은 건너뜀"; exit 0 ;;
  esac
fi
mkdir "$LOCK" 2>/dev/null || fail "이미 실행 중 ($LOCK)"
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

cd "$REPO_DIR"
[[ -z "$(git status --porcelain)" ]] || fail "작업 트리에 커밋 안 된 변경이 있어 중단"
git pull --ff-only --quiet || fail "git pull 실패"

# 발행된 레시피 = 빌드된 상세 페이지 폴더. 데이터 파일 작성 형식(JSON, 축약형 등)에 의존하지 않는다.
built_slugs() { ls dist/recipes | sort; }
npm run build >/dev/null || fail "시작 전 빌드 실패"
before="$(built_slugs)"
prompt="$(cat scripts/daily-recipe-prompt.md)

## 이미 있는 slug
$before"

echo "▶ codex"
perl -e 'alarm shift; exec @ARGV' "$CODEX_TIMEOUT" \
  codex exec -s danger-full-access -C "$REPO_DIR" - <<<"$prompt" | tee "$LOG_DIR/codex-$STAMP.log" | tail -40
result="$(grep -E '^DAILY_RECIPE_RESULT:' "$LOG_DIR/codex-$STAMP.log" | tail -1)"
echo "결과: ${result:-없음}"

if [[ "$result" != "DAILY_RECIPE_RESULT: OK "* ]]; then
  restore
  fail "Codex 생성 실패: ${result:-결과 줄 없음 (시간 초과 가능)}"
fi
slug="$(awk '{print $3}' <<<"$result")"
src_url="$(awk '{print $4}' <<<"$result")"

[[ "$slug" =~ ^[a-z0-9-]+$ ]] || { restore; fail "잘못된 slug: $slug"; }
grep -qx "$slug" <<<"$before" && { restore; fail "이미 있는 slug: $slug"; }

echo "▶ verify"
npm run build >/dev/null && npm run verify:built \
  && python3 .agents/skills/youtube-recipe-blog/scripts/audit_recipe.py --project . --slug "$slug" \
  || { restore; fail "검증 실패: $slug"; }
added="$(comm -13 <(echo "$before") <(built_slugs))"
[[ "$added" == "$slug" ]] || { restore; fail "새 상세 페이지가 정확히 1개($slug)가 아님: ${added:-없음}"; }

echo "▶ commit & push"
git add -A
git diff --cached --name-only | grep -qE '(^|/)\.env|^dist/|node_modules' && { git reset -q; restore; fail "커밋 금지 파일 포함"; }
git commit -qm "feat: add daily recipe $slug

원본: $src_url

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || fail "커밋 실패"
git -c http.postBuffer=524288000 push --quiet origin HEAD \
  || git -c http.postBuffer=524288000 push --quiet origin HEAD \
  || fail "push 실패 (커밋은 로컬에 있음)"

echo "▶ deploy"
bash scripts/deploy.sh "deploy: daily recipe $slug" || fail "배포 실패 (push는 완료)"
touch "$LOG_DIR/published-$(date +%Y%m%d)"
echo "✓ 발행 완료: $slug"
notify "발행 완료" "https://gibalpeople.com/recipes/$slug/"
