#!/usr/bin/env bash
# 매일 1개 레시피 자동 발행: Codex로 게시물 생성 → 검증 → 커밋·push → gh-pages 배포
# launchd(~/Library/LaunchAgents/com.gibalpeople.daily-recipe.plist)가 매일 13시에 실행한다.
# 수동 실행: bash scripts/daily-recipe.sh   (오늘 이미 발행했어도 강제: FORCE=1)
set -uo pipefail

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
restore() { git checkout -- . && git clean -fdq; }   # 시작 시 작업 트리가 깨끗했을 때만 호출

echo "▶ start $STAMP"
if [[ "${FORCE:-0}" != 1 ]] && ls "$LOG_DIR"/published-"$(date +%Y%m%d)" >/dev/null 2>&1; then echo "오늘 이미 발행 — 건너뜀"; exit 0; fi
mkdir "$LOCK" 2>/dev/null || fail "이미 실행 중 ($LOCK)"
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

cd "$REPO_DIR"
[[ -z "$(git status --porcelain)" ]] || fail "작업 트리에 커밋 안 된 변경이 있어 중단"
git pull --ff-only --quiet || fail "git pull 실패"

# slug: 'x' / "slug": "x" 어느 형식이든 추출 (Codex가 JSON으로 쓰기도 함)
list_slugs() {
  { grep -rhoE "[\"']?slug[\"']? *: *[\"'][a-z0-9-]+[\"']" src/data | grep -oE "[a-z0-9-]+[\"']\$" | tr -d "\"'"
    ls src/pages/recipes/*.astro | xargs -n1 basename | sed 's/\.astro$//' | grep -v '^\['; } | sort -u
}
before="$(list_slugs)"
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
list_slugs | grep -qx "$slug" || { restore; fail "데이터에 slug 없음: $slug"; }

echo "▶ verify"
npm run build >/dev/null && npm run verify:built \
  && test -f "dist/recipes/$slug/index.html" \
  && python3 .agents/skills/youtube-recipe-blog/scripts/audit_recipe.py --project . --slug "$slug" \
  || { restore; fail "검증 실패: $slug"; }

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
