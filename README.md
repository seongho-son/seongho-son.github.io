# 레시피 나와라 뚝딱

Astro 정적 집밥 레시피 사이트. 첫 메뉴는 돼지고기 김치찌개.

- `npm run dev`: 로컬 개발
- `npm run build`: 정적 빌드
- `npm run verify:built`: 빌드된 링크·이미지·폐기 경로 검사
- `npm run preview`: 빌드 미리보기
- `scripts/deploy.sh`: 기존 GitHub Pages 배포 경로 (명시적 배포 요청 시 실행)

## 콘텐츠

1–2인분 / 3–4인분을 동시에 표시한다. 컵은 180ml 종이컵, 큰술은 밥숟가락으로 안내한다. 원본 영상 배합, 편집자가 환산한 분량, 조절 팁을 구분한다. 조리 경험·검증·평점·영양값을 만들어내지 않는다. AI 일러스트에는 실제 사진이 아님을 표시한다.

원본: https://www.youtube.com/watch?v=qWbHSOplcvY
기존 사이트는 커밋 `4218ce2`에 보존되어 있다. 현재 소스 및 빌드에서는 기존 글·계산기를 제거했다. 도메인 소유 확인, ads.txt, CNAME과 배포 기반은 유지한다. 애드센스 공식 비동기 스크립트와 계정 메타 태그를 공통 head에 포함한다(404 제외). 게시자 ID는 ca-pub-5644793210860513이며 ads.txt와 일치한다. 개인정보 안내에 광고 쿠키와 설정 링크를 제공한다.

## 이미지

`public/images/kimchi-jjigae.webp`: 내장 image_gen으로 만든 원본을 WebP로 변환.
프롬프트: 크림색 양손 냄비에 담긴 돼지고기 김치찌개, 익힌 배추김치·돼지고기·대파·청양고추만 표현. 단계별 이미지와 같은 크림색 냄비와 주방, 식탁에 놓인 완성 음식과 밥 한 공기를 직접 촬영한 듯한 구도. 사진을 수채화·연필로 옮긴 질감, 글자·로고 없음. 실제 사진이 아닌 독립적인 요리 일러스트.


## 검색 표시와 영상

원본 영상은 개인정보 보호 강화 모드 공식 iframe으로 삽입한다. 레시피 모음에는 원본 영상의 YouTube 썸네일 URL을 사용하고 출처를 표시한다. 본문·Recipe·OG에는 자체 일러스트를 사용한다. Recipe JSON-LD는 본문과 같은 재료·조리 단계 데이터를 참조한다. 기본 분량은 1–2인분이며 3–4인분 표도 본문에 제공한다. 완성 예시 일러스트를 본문·구조화 데이터·OG 대표 이미지로 연결하고 `max-image-preview:large`를 설정했다. 임의의 평점·조리 시간·발행일은 넣지 않는다. 검색 썸네일·리치 결과·순위는 보장되지 않으며 공개 배포 후 Google Rich Results Test 및 Search Console URL 검사로 확인한다.

## 앱 설치 (PWA)

`public/manifest.webmanifest`, `public/icons/`, `public/sw.js`로 설치형 웹앱을 지원한다. iPhone Safari는 공유 → **홈 화면에 추가**, Android Chrome은 메뉴 → **앱 설치**, macOS Chrome/Edge는 주소창 설치 아이콘, Safari는 파일 → **Dock에 추가**로 설치한다. head 태그와 서비스 워커 등록은 `src/layouts/BaseLayout.astro`에 있다.

서비스 워커는 앱 셸(홈·파비콘·매니페스트·아이콘)만 미리 캐시하고, 해시가 붙은 `/_astro/*`와 `/images/*`는 방문할 때 캐시한다. 문서는 네트워크 우선이며 방문한 페이지를 경로별로 저장해 오프라인에서는 그 페이지를, 없으면 홈을 보여준다. 정적 파일은 캐시 후 백그라운드 갱신이다. 외부 요청(애드센스·YouTube·썸네일)과 GET 외 요청은 가로채지 않으므로 오프라인에서는 영상·광고·YouTube 썸네일, 아직 보지 않은 이미지는 나오지 않는다. 사이트는 localStorage 등 브라우저 저장 상태를 쓰지 않아 iOS 홈 화면 앱과 Safari 간 데이터 차이는 없다.

셸 파일 목록이 바뀌면 `sw.js`의 `VERSION`을 올린다. GitHub Pages는 응답 헤더를 지정할 수 없어 `sw.js`에 `Cache-Control: no-cache`를 붙이지 못하고 `max-age=600`으로 제공된다. 브라우저는 서비스 워커 업데이트 확인 시 보통 HTTP 캐시를 건너뛰지만, 환경에 따라 새 버전 반영이 최대 10분 정도 늦을 수 있다. 아이콘은 `node scripts/generate-icons.mjs`로 다시 생성한다.

검증: `npm run build` 후 `dist`를 로컬 서버로 띄우고 `node scripts/verify-pwa.mjs` 실행(기본 `http://localhost:8801`, 다른 주소는 `PWA_TEST_URL`, 오프라인 스크린샷은 `PWA_SCREENSHOT=경로`). 두 스크립트는 todo 프로젝트의 Playwright(`../todo/node_modules`)와 Chrome을 사용한다.
