# 잔치국수 이미지 제작 기록

- 도구: 내장 image_gen (CLI/API 대체 사용 없음)
- 확인일: 2026-10-16
- 스타일 참조: `.agents/skills/youtube-recipe-blog/assets/style-finished.webp`를 직접 열어 질감 확인. 다른 음식 그림 재사용 없음. 도구에 참조 파일은 전달하지 않고 텍스트로 지정.
- 목록: https://i.ytimg.com/vi/Gq9S0dJ3wHg/maxresdefault.jpg — HTTP 200, 1280×720 확인.
- 본문: 자체 AI 일러스트, 원본 PNG는 생성 위치에 보존하고 WebP로 변환.
- 확인: 생성 결과를 열어 음식 재료·투입 전후 상태·동작·완성 상태를 육안 점검. 그림의 양·크기는 계량 기준이 아니며 본문 수치 우선.
- 완성 이미지에 조리 중 손이 나타난 어묵/시금치 초기 시안은 제외하고 정물로 재생성.

## paik-janchi-guksu-finished

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-03c28b5c-c9ab-403a-9ae0-c6f88c7b3c6f.png`
- 결과: `public/images/paik-janchi-guksu-finished.webp`
- 실제 크기: 1312×1199
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Finished Korean janchi guksu: white thin somyeon noodles in clear light brown broth with julienned zucchini, onion, carrot, sliced shiitake and cooked wisps of beaten egg, small amount of chopped scallion chili soy seasoning on top. White ceramic soup bowl. No seaweed, meat, fishcake or sesame decoration beyond crushed sesame in seasoning.

## paik-janchi-guksu-step-1

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-f764ff98-7817-4b79-90f8-32dccb553ae7.png`
- 결과: `public/images/paik-janchi-guksu-step-1.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Closeup of spoon mixing chopped scallion, green chili, garlic, crushed sesame and chili powder in soy sauce in a small white bowl. On board nearby are julienned zucchini onion carrot and sliced shiitake mushrooms. No noodles or cooked soup yet.

## paik-janchi-guksu-step-2

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-dbcbc754-d780-4bd8-8c28-d4efb5ec4f66.png`
- 결과: `public/images/paik-janchi-guksu-step-2.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. One hand pouring beaten egg from small bowl into gently boiling clear broth containing julienned zucchini, onion, carrot and sliced shiitake in a stainless pot. No noodles yet. No seaweed or meat.

## paik-janchi-guksu-step-3

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-1a79a3a2-7593-47bf-a99d-f68711ba3da4.png`
- 결과: `public/images/paik-janchi-guksu-step-3.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Cook's hands rinsing thin cooked white somyeon noodles in a metal sieve under cold running tap water in a home kitchen sink. Noodles only, no garnish, no broth.


## 원본 영상 표시

공식 youtube-nocookie iframe을 실제 부모 페이지에서 확인했으나 재생 시도 뒤 currentTime=0, readyState=0 상태로 재생을 확인하지 못했다. 최종 본문은 해당 영상 원본 썸네일 링크로 대체했다. 구체적인 근본 원인은 미확정이며 사용자 환경에서 YouTube 원본으로 볼 수 있다.
