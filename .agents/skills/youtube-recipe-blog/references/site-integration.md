# Astro 연결과 검증

기준 프로젝트 `/Users/shon/Desktop/benefit-finder`. 이 문서는 현재 파일을 대체하는 복사본이 아니라, 새 글 추가 때 놓치기 쉬운 연결 지점을 안내한다.

## 먼저 읽을 파일

| 파일 | 역할 |
|---|---|
| `src/data/kimchi-jjigae.js` | ingredients, steps, recipeMeta 데이터 |
| `src/data/more-recipes.js`, `src/pages/recipes/[slug].astro` | 여러 글의 데이터와 공통 상세 템플릿. 추가 게시물은 현행 공용 구조를 우선 사용 |
| `src/pages/recipes/kimchi-jjigae.astro` | 현행 상세 UI/공식 영상/Recipe JSON-LD |
| `src/pages/index.astro` | 레시피 목록, 원본 YouTube 썸네일 |
| `src/pages/rss.xml.js` | RSS. 최초 구현은 김치찌개 한 건 하드코딩 |
| `src/layouts/BaseLayout.astro` | canonical, OG, 사이트 헤더, 애드센스 |
| `src/styles/global.css` | 기존 반응형 레이아웃과 글꼴 |
| `scripts/verify-built.mjs` | 링크, JSON-LD, RSS, 애드센스 회귀 검사 |
| `astro.config.mjs`, `public/robots.txt` | 사이트 주소와 사이트맵 |

새 글은 기존 페이지 구조를 참조하되 해당 메뉴에 맞게 새로 작성한다. 특히 source video ID, alt, 캡션, 원본 채널, 도입과 팁, Recipe description, 이미지 경로에 김치찌개 문자열이 남지 않도록 확인한다.

## 데이터 형식 (현행 예시)

```js
export const ingredients = [
  // [재료명, 1–2인분 표시량, 3–4인분 표시량]
];
export const steps = [
  // {name, alt, caption, paragraphs: [편집한 설명문]}
];
export const recipeMeta = {
  path: '/recipes/<slug>/',
  title: '메뉴명 레시피 — 친근한 후킹',
  description: '이 글이 실제로 제공하는 정보',
  image: '/images/<slug>-finished.webp',
  imageAlt: '완성 예시 AI 일러스트 설명',
};
```

새 글과 함께 videoId/channel/source 등 필요한 메타데이터를 추가해 공용 목록/RSS에 연결할 수 있다. 자료형을 대규모로 재작성하는 것은 목표가 아니다. 원본에서 가져온 텍스트는 그대로 `set:html`로 렌더하지 말고 일반 텍스트로 처리한다. 기존 `paragraphs`의 HTML 강조를 사용할 때는 직접 작성한 제한적인 strong 등만 사용한다.

## 놓치기 쉬운 연결

- 목록에 새 글만 덮어쓰지 말고 기존 글과 함께 표시한다. 동일 영상 ID/slug 중복을 확인한다.
- RSS도 복수 item으로 늘리고 기존 김치찌개 item을 보존한다. XML 특수문자를 escape한다. 새 item 제목·URL·내용이 새 레시피와 일치해야 한다.
- Recipe는 상세에만. 대표 이미지와 단계 image는 자체 이미지의 공개 절대주소, HowToStep URL은 새 상세+실제 step anchor.
- 기준 recipeYield/recipeIngredient는 1–2인분, 큰 분량은 본문에 나란히 둔다. 사용자 변경 시 함께 수정.
- canonical은 상세 URL. 도메인 `gibalpeople.com`을 맞춘다.
- 홈 목록에는 원본 유튜브 썸네일과 채널 표시. OG는 기본적으로 해당 페이지의 자체 대표 이미지.
- 새 글 링크를 소개 페이지 등 의미 있는 위치에만 추가한다. 관련 없는 링크를 억지로 늘리지 않는다.
- 날짜를 넣을 경우 실제 공개일을 사용한다. 로컬 초안 작성일을 공개일로 꾸미지 않는다.

## 확정된 UI

- 본문: 모바일 15px / 데스크톱 16px, line-height 1.8.
- 1024px 이상: 가로형 헤더, 본문+오른쪽 sticky 목차.
- 좁은 화면: 한 열, 글 초반에서 재료/순서로 바로 이동하는 sticky 메뉴. 터치 영역 최소 44px.
- 메뉴 밑줄 없음. 목차 번호와 텍스트 baseline 일치.
- 고딕체, 흰 배경, 절제된 주황 강조. 명조/궁서형 브랜드 제목, 과한 카드/장식으로 되돌리지 않는다.
- 상단 메뉴는 레시피 모음. 소개는 푸터에만.
- 기존 CSS 클래스와 토큰을 재사용한다. 글 추가 때문에 공통 폰트나 레이아웃을 바꾸지 않는다.

## 애드센스·소유확인 보존

공통 head에 한 번만 다음 코드가 있어야 한다(현재 404/noindex 페이지 제외):

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5644793210860513" crossorigin="anonymous"></script>
```

Astro에서 스크립트를 빌드가 재가공하지 않도록 현행 `is:inline` 패턴을 따른다. `google-adsense-account` 메타 태그만 남기는 것은 광고 스크립트 복구가 아니다. public/ads.txt, Google 소유확인 HTML, CNAME, robots, 개인정보 페이지를 보존한다. 광고 클릭이나 가짜 노출을 검증 수단으로 삼지 않는다.

## 검증 및 배포

1. build 및 verify:built. 현재 verifier의 기존 김치찌개 회귀 검사는 지우지 않는다. 새 글도 검증하도록 확장하거나 스킬 audit 도구를 병행한다.
2. 스킬 audit은 빌드 산출물에서 새 상세의 canonical/Recipe/단계 이미지, 목록 링크, RSS item, sitemap, 광고 코드의 연결을 검사한다. 내용·그림·SEO 성과는 판정하지 않는다.
3. 브라우저에서 새 글과 기존 김치찌개 글 양쪽을 확인한다. 도구에 Playwright가 있으면 사용하고 특정 사용자의 npm 캐시 경로를 전제로 하지 않는다.
4. 배포가 승인된 경우에만 `bash scripts/deploy.sh 'deploy: add <slug> recipe'`. 이 스크립트가 임시 checkout에서 gh-pages를 갱신한다. 소스 루트에 dist를 복사하거나 main을 임의로 덮어쓰지 않는다.
5. 배포 완료 후 홈·새 상세·RSS·사이트맵·이미지의 실제 응답을 확인한다. push 성공만으로 공개 반영됐다고 말하지 않는다.
6. Search Console/네이버 도구는 실제 연결이 있을 때만 조작한다. 속성 URL을 받았다는 것과 로그인 권한이 있다는 것은 다르다. 같은 도메인의 기존 등록을 유지한다.

## 공식 참고

현재 정책/API 동작 확인이 필요할 때 공식 문서를 다시 확인한다.

- Recipe: https://developers.google.com/search/docs/appearance/structured-data/recipe
- 네이버: https://searchadvisor.naver.com/guide/seo-basic-intro
- 애드센스 head 설치: https://support.google.com/adsense/answer/9274019?hl=ko
