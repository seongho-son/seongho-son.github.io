#!/usr/bin/env bash
# gh-pages 수동 배포 (GitHub Actions 미사용 — OAuth workflow 스코프 없음)
#
# ⚠️ 이 스크립트로만 배포할 것. 예전처럼 한 줄 명령을 && 와 ; 로 이어 붙이면,
#    중간 단계(clone 등)가 실패했을 때 뒤쪽 `cp -R dist/. .` 이 레포 루트에서 실행돼
#    빌드 산출물이 소스 레포에 커밋되는 사고가 난다. (2026-07-27 실제 발생)
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="https://github.com/seongho-son/seongho-son.github.io.git"
WORK="$(mktemp -d)"
MSG="${1:-deploy}"

cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

echo "▶ build"
cd "$REPO_DIR"
npm run build

test -f "$REPO_DIR/dist/index.html" || { echo "✗ dist/index.html 없음 — 빌드 실패"; exit 1; }

echo "▶ clone gh-pages → $WORK"
git clone --quiet --branch gh-pages --depth 1 "$REMOTE" "$WORK/ghp"

cd "$WORK/ghp"   # 여기서부터의 모든 작업은 임시 디렉터리 안에서만 일어난다
git rm -rqf . >/dev/null 2>&1 || true
cp -R "$REPO_DIR/dist/." .
touch .nojekyll

test -f index.html || { echo "✗ 복사 실패"; exit 1; }

git add -A
if git diff --cached --quiet; then
  echo "▶ 변경 없음 — 배포 생략"
  exit 0
fi
git commit -qm "$MSG"
git -c http.postBuffer=524288000 push --quiet origin gh-pages
echo "✓ 배포 완료: $MSG"
