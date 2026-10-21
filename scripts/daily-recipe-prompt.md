이 저장소("레시피 나와라 뚝딱!")에 새 레시피 게시물을 **딱 1개** 추가한다. 이틀에 1개씩 자동 발행하는 작업이라 사람이 지켜보지 않는다.

반드시 `.agents/skills/youtube-recipe-blog/SKILL.md`와 `references/*.md`를 먼저 읽고 그 기준을 그대로 따른다. 스킬에 적힌 기본 프로젝트 경로(`/Users/shon/Desktop/benefit-finder`)는 옛 경로다. 이 저장소를 쓴다.

## 메뉴 선정
- 이미 있는 slug는 아래에 적혀 있다. 이 메뉴와 같은 요리, 같은 영상은 쓰지 않는다. `src/data`와 `docs/recipes`도 확인한다.
- 1~2인 집밥으로 따라 하기 쉽고 조회수가 높은 한국 요리 YouTube 영상 1개를 고른다. 최근 게시물과 종류(국/찌개, 볶음, 반찬, 면, 한 그릇 요리, 분식)가 겹치지 않게 한다.
- 설명란, 작성자 고정 댓글, 자막 중 하나에서 재료와 분량을 실제로 확인할 수 있는 영상만 쓴다. 일반 요리 지식으로 배합을 지어내지 않는다. 확인이 안 되면 다른 영상을 찾는다.

## 작업 범위
- 스킬의 1~4단계를 진행한다. `docs/recipes/<slug>-source.md`, `<slug>-images.md`를 만든다. 데이터는 `src/data/daily-recipes.js`에 넣는다. 파일이 없으면 `autumn-table-recipes.js` 패턴으로 만들고 `more-recipes.js`의 `additionalRecipes` 맨 앞에 연결한다. 홈 목록, RSS, 상세, 사이트맵에 연결한다.
- 이미지(단계별 + 완성)는 imagegen으로 스킬 기준대로 만든다. 이미지를 하나라도 만들지 못하면 게시물을 추가하지 말고, 바꾼 내용을 모두 되돌린다. 마지막 줄에 `DAILY_RECIPE_RESULT: FAIL <이유>`를 출력한다.
- 제목(`title`)은 `<채널 인물> <요리명>, <한 줄 포인트>` 형식으로 쓴다(예: `백종원 떡볶이, 쌀떡이냐 밀떡이냐 고민이면 둘 다!`). 쉼표 앞부분은 사람들이 검색하는 요리명 그대로 쓴다. 검색용 `<title>`은 쉼표 앞에 '레시피'를 자동으로 붙여 만든다.
- 실용 팁(`tips`)은 `references/editorial.md`의 "원본에 없는 정보" 기준대로 2개 이상(3개 권장), 각 120–250자, 서로 다른 각도로 쓴다. 대체 재료는 "편집자 제안"으로 표시하고, 하지 않은 조리 경험은 쓰지 않는다.
- `cooked` 필드(직접 조리 기록)는 만들지 않는다. 사이트 주인만 실제로 만든 뒤에 채운다.
- 이번 게시물 외의 기존 콘텐츠, 디자인, 레이아웃은 바꾸지 않는다.
- git commit, push, `scripts/deploy.sh`는 실행하지 않는다. 래퍼 스크립트가 검증 후 처리한다.

## 검증
`npm run build` → `npm run verify:built` → `python3 .agents/skills/youtube-recipe-blog/scripts/audit_recipe.py --project . --slug <slug>`가 모두 통과해야 한다.

## 마지막 출력
성공하면 마지막 줄에 정확히 `DAILY_RECIPE_RESULT: OK <slug> <원본 URL>` 형식으로 출력한다. 실패하면 `DAILY_RECIPE_RESULT: FAIL <이유>`를 출력한다.
