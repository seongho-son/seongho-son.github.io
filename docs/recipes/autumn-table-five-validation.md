# autumn-table-five 검증 기록

확인일: 2026-10-16. 로컬 생성 완료, 커밋·push·배포 없음.

## 범위와 보존

- 기존 18개 메뉴와 docs/recipes 출처 목록을 대조해 중복 메뉴를 제외했다. 최종 23개 slug/영상 ID는 모두 고유하다.
- 새 데이터: src/data/autumn-table-recipes.js.
- 연결 수정: more-recipes.js에 import와 spread 추가, 공용 상세에 신규 재료 그룹/실제 이미지 크기 지원, index.astro에 새 반찬의 분류 override 지원. 기존 UI/사용자 미커밋 변경은 유지했다.
- 홈·상세·RSS·사이트맵은 기존 공용 데이터 흐름을 사용한다. RSS 전용 코드 변경 불필요.
- source.md 5개, images.md 5개 저장 후 다시 읽어 ID·재료·자산 수를 대조했다.
- 일반 요리 지식으로 원작자 배합을 추가하지 않았다. 국·나물 인분 추정, 5인분 카레의 2/4인분 환산, 불·간 조절 팁은 구분해 기록했다.

## 지정 검증

실행 순서: npm run build → npm run verify:built → 아래 slug 각각 audit_recipe.py --project . --slug 실행.

- build: PASS, Astro 28 routes.
- verify:built: PASS, 29 HTML(소유확인 파일 포함), 894 local links/assets. 기존 김치찌개 회귀·canonical·구조화 데이터·광고·ads.txt·RSS·사이트맵 검사 통과.
- git diff --check: PASS.

| slug | 자체 이미지 | audit_recipe.py |
| --- | --- | --- |
| paik-beef-radish-soup | 3단계 + 완성 1장 | PASS |
| paik-eomuk-potato | 3단계 + 완성 1장 | PASS |
| paik-spinach-namul | 3단계 + 완성 1장 | PASS |
| paik-janchi-guksu | 3단계 + 완성 1장 | PASS |
| paik-pork-curry | 4단계 + 완성 1장 | PASS |

## 이미지·브라우저

- 내장 image_gen으로 21장 제작, public/images에 WebP 저장. 누락 자산 없음. 다른 메뉴 이미지나 깨진 경로 사용 없음.
- 원본 PNG 보존 위치·프롬프트·실제 크기는 각 images.md 참조. 생성물이 모두 같은 크기는 아니므로 실제 크기를 HTML에 반영했다.
- 생성 이미지를 직접 열어 재료/조리 상태/완성 장면을 확인했다. 어묵·시금치 완성 초기 시안은 조리 동작이 보여 정물로 재생성했다.
- 목록 썸네일 5개: HTTP 200, 1280×720 확인.
- Chrome/Playwright에서 390px·1440px·320px: 홈, 신규 5개, 기존 김치찌개 확인. 가로 넘침 없음, 자체 이미지 누락 없음, 실제 이미지 크기와 HTML 일치, 재료 바로가기 정상.
- 목록의 새 글 5개 링크를 클릭해 해당 상세로 이동 확인. 반찬 필터에서 시금치무침 표시 확인.
- 실제 부모 페이지에서 youtube-nocookie iframe 5개 모두 제목/채널/플레이어 로딩 확인. 영상 요청을 막지 않았으며 원본 링크도 제공한다. 재생 시도 후 5개 모두 currentTime=0, paused=true, readyState=0으로 미디어 재생을 확인하지 못했다. 명시적 오류 문구는 없어 근본 원인은 확정하지 않는다. 스킬의 실패 처리에 따라 신규 5개만 embed:false로 설정하여 원본 썸네일 링크로 대체했다. 원본 watch 응답 역시 로그인 확인 상태였지만 이를 iframe의 확정 원인으로 단정하지 않는다. 최종 상태에는 재생 성공을 가장하는 iframe을 남기지 않았다.
- 브라우저 검증 스크립트에서 숨겨진 모바일 목차 및 광고 iframe을 잘못 선택한 초기 시도는 실패했다. 화면에 보이는 목차 및 YouTube iframe으로 선택자를 고친 뒤 위 검증 완료. 사이트 코드 결함은 아님.

## 한계

- 원본 watch 설명란 근거이며 실제 영상 시청·자막/고정댓글 검증으로 표현하지 않는다.
- 직접 조리·시식은 수행하지 않았다.
- Google 공식 리치 결과 테스트 및 검색 콘솔은 수행하지 않았다. 로컬 감사 통과가 Google 승인이나 노출 보장을 뜻하지 않는다.
- 공개 배포를 하지 않았으므로 공개 URL의 새 글 응답은 확인하지 않았다.

최종 썸네일 링크 대체 후에도 지정 순서의 build → verify:built → slug별 audit 5개를 다시 실행하여 모두 통과했다.
