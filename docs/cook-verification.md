# 직접 만들어 보기 체크리스트

이 사이트의 글은 지금 모두 "영상 정리 + 편집자 환산·팁"이고, 출처 영역에 "직접 조리 검증 전"이라고 적혀 있다. 사이트 주인이 실제로 만들어 본 기록을 붙이면 영상에 없는 1차 정보가 생긴다. 애드센스 "가치가 별로 없는 콘텐츠" 반려에 가장 확실하게 대응하는 방법이다.

- 이 기록은 **사이트 주인만** 남긴다. 자동 발행(Codex)이나 에이전트는 `cooked` 필드를 만들지 않는다.
- 실제로 만든 것만 적는다. 만들지 않은 단계, 먹지 않은 맛, 찍지 않은 사진은 넣지 않는다.

## 1. 먼저 만들 레시피 (8개)

검색 유입이 많거나 사이트를 대표하는 글부터 만든다. 위에서부터 순서대로 하면 된다.

| 순서 | slug | 요리 | 데이터 파일 | 참고 |
|---|---|---|---|---|
| 1 | `paik-tteokbokki` | 백종원 떡볶이 | `src/data/more-recipes.js` | |
| 2 | `kimchi-jjigae` | 김치찌개 | `src/data/kimchi-jjigae.js` | `export const cooked = null;`을 객체로 바꾼다 |
| 3 | `kim-seoul-jeyuk` | 킴서울 제육볶음 | `src/data/kim-seoul-jeyuk.js` | `export const cooked = null;`을 객체로 바꾼다 |
| 4 | `paik-dakbokkeumtang` | 닭볶음탕 | `src/data/more-recipes.js` | |
| 5 | `paik-kimchi-bokkeumbap` | 김치볶음밥 | `src/data/paik-kimchi-bokkeumbap.js` | |
| 6 | `ryu-doenjang-jjigae` | 차돌 된장찌개 | `src/data/more-recipes.js` | |
| 7 | `paik-gyeranjjim` | 계란찜 | `src/data/more-recipes.js` | |
| 8 | `paik-miyeok-guk` | 소고기미역국 | `src/data/easy-five-recipes.js` | |

여유가 있으면 9–10번째로 Search Console에서 노출이 많은 다른 글을 고른다.

**참고:** `kimchi-jjigae`와 `kim-seoul-jeyuk`은 따로 만든 페이지지만, 데이터 파일의 `export const cooked = null;`을 아래 형식의 객체로 바꾸면 다른 글과 같은 "직접 만들어 봤어요" 섹션(`src/components/CookedSection.astro`)이 붙는다.

## 2. 만들면서 기록할 것

요리할 때 휴대폰 메모에 아래 항목을 적어 둔다.

- [ ] **날짜**: 만든 날 (`YYYY-MM-DD`)
- [ ] **실제 분량**: 몇 인분으로 만들었는지, 글의 1–2인분/3–4인분 중 어느 쪽 기준이었는지
- [ ] **걸린 시간**: 재료 손질부터 불 끌 때까지 대략 몇 분
- [ ] **원본과 다르게 한 점**: 바꾼 재료, 줄이거나 늘린 양념, 다른 냄비·팬, 불 세기. 없으면 "그대로 했다"
- [ ] **결과**: 간(짠지, 싱거운지), 식감, 아쉬운 점. **실패했으면 실패한 대로** 적는다(예: "물이 졸아 탔다", "떡이 딱딱했다"). 실패와 해결이 독자에게 제일 쓸모 있다
- [ ] **사진 2–3장**: 가로 사진으로. 추천 구도는 ① 재료를 늘어놓은 모습 ② 조리 중 중요한 순간(색이 변할 때, 졸아든 정도) ③ 완성 그릇

사진 기준:

- 가로(예: 4:3, 3:2)로 찍는다. 세로 사진은 본문에서 너무 길어진다.
- 얼굴·집 주소·택배 송장 같은 개인정보가 찍히지 않게 한다.
- 보정은 밝기 정도만. 다른 날 찍은 사진이나 인터넷 사진은 쓰지 않는다.

## 3. 사진 파일 저장

- 위치: `public/images/cooked/` (폴더가 없으면 만든다)
- 이름: `<slug>-1.webp`, `<slug>-2.webp`, `<slug>-3.webp` (예: `paik-tteokbokki-1.webp`)
- 크기: 가로 1600px 정도로 줄인 webp

```bash
mkdir -p public/images/cooked
cwebp -q 80 -resize 1600 0 ~/Downloads/IMG_1234.jpg -o public/images/cooked/paik-tteokbokki-1.webp
sips -g pixelWidth -g pixelHeight public/images/cooked/paik-tteokbokki-1.webp   # width, height 확인
```

`sips`로 확인한 가로·세로 값을 아래 `width`, `height`에 그대로 적는다(레이아웃 밀림 방지).

## 4. 데이터 파일에 붙여넣을 `cooked` 객체

표의 데이터 파일에서 해당 slug 항목(`slug: 'paik-tteokbokki', ...`가 있는 객체) 안에 아래를 넣는다.

```js
cooked: {
  date: '2026-10-25',
  notes: [
    '1–2인분 기준으로 만들었고 손질부터 완성까지 25분쯤 걸렸어요.',
    '원본과 다르게 한 점: 밀떡이 없어서 쌀떡만 썼어요. 쌀떡은 양념이 늦게 배어서 2분 더 끓였어요.',
    '결과: 설탕을 원본대로 넣으니 단맛이 강하게 느껴졌어요. 다음엔 반 숟가락 줄여 볼 생각이에요.',
  ],
  photos: [
    { src: '/images/cooked/paik-tteokbokki-1.webp', alt: '떡볶이 재료를 도마 위에 늘어놓은 모습', width: 1600, height: 1200 },
    { src: '/images/cooked/paik-tteokbokki-2.webp', alt: '양념이 끓기 시작한 팬 속 떡볶이', width: 1600, height: 1200 },
    { src: '/images/cooked/paik-tteokbokki-3.webp', alt: '접시에 담은 완성 떡볶이', width: 1600, height: 1200 },
  ],
},
```

- `notes`는 문단 하나가 문자열 하나다. 위 예시 문장은 형식 예시일 뿐이니 실제 기록으로 바꾼다.
- `photos`는 없어도 된다. 사진이 없으면 `photos` 줄을 통째로 뺀다.
- `alt`는 사진에 실제로 보이는 것을 짧게 쓴다.

화면에는 만드는 순서 다음, AI 완성 일러스트 앞에 "직접 만들어 봤어요" 섹션으로 나오고, 데스크톱 목차에도 링크가 생긴다.

## 5. 출처 문구 고치기

만든 글은 출처 영역의 "직접 조리 검증 전" 문구가 더 이상 맞지 않는다. 같은 항목에 `sourceNote`를 직접 넣어 바꾼다.

- `more-recipes.js`의 글은 공통 문구를 쓰고 있으므로, 해당 항목에만 `sourceNote: '...'`를 추가하면 그 글만 바뀐다(공통 상수는 건드리지 않는다).
- 다른 파일의 글은 그 항목의 `sourceNote`에서 "직접 조리 검증 전" 부분만 고친다.

예: `… 인분 구분과 단위 환산, 조절 팁은 덧붙인 설명이에요. 2026년 10월 25일에 1–2인분으로 직접 만들어 봤고, 기록은 본문 "직접 만들어 봤어요"에 남겼어요. 단계 그림은 AI 일러스트예요.`

실제 사진은 직접 찍은 것이지만, 단계별 그림과 완성 그림은 여전히 AI 일러스트이므로 그 안내는 지우지 않는다.

## 6. 확인

```bash
npm run build && npm run verify:built
python3 .agents/skills/youtube-recipe-blog/scripts/audit_recipe.py --project . --slug <slug>
```

- [ ] 상세 페이지에 "직접 만들어 봤어요" 섹션과 사진이 보인다
- [ ] 데스크톱 목차의 "직접 만들어 봤어요" 링크가 그 섹션으로 이동한다
- [ ] 출처 영역에 "직접 조리 검증 전"이 남아 있지 않다
- [ ] 휴대폰 폭에서 사진이 가로로 넘치지 않는다
