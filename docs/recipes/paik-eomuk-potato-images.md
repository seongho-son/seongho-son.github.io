# 어묵감자볶음 이미지 제작 기록

- 도구: 내장 image_gen (CLI/API 대체 사용 없음)
- 확인일: 2026-10-16
- 스타일 참조: `.agents/skills/youtube-recipe-blog/assets/style-finished.webp`를 직접 열어 질감 확인. 다른 음식 그림 재사용 없음. 도구에 참조 파일은 전달하지 않고 텍스트로 지정.
- 목록: https://i.ytimg.com/vi/mo8ogr40m4o/maxresdefault.jpg — HTTP 200, 1280×720 확인.
- 본문: 자체 AI 일러스트, 원본 PNG는 생성 위치에 보존하고 WebP로 변환.
- 확인: 생성 결과를 열어 음식 재료·투입 전후 상태·동작·완성 상태를 육안 점검. 그림의 양·크기는 계량 기준이 아니며 본문 수치 우선.
- 완성 이미지에 조리 중 손이 나타난 어묵/시금치 초기 시안은 제외하고 정물로 재생성.

## paik-eomuk-potato-finished

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-cc66fd97-f492-43d7-877f-51a5cf11cdb3.png`
- 결과: `public/images/paik-eomuk-potato-finished.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Finished food STILL LIFE, close crop of ONE white plate with Korean spicy fishcake potato stir-fry: thin fishcake rectangles, diagonal cylindrical fishcake slices, thin quarter-round potato slices, onion, small scallion and green chili rings coated with red glossy seasoning and sesame seeds. ABSOLUTELY NO PEOPLE, HANDS, cooking action, pots, pans or other dishes. No broth. Just finished plate.

## paik-eomuk-potato-step-1

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-243a9235-72a3-4d9e-a88c-12117852e5de.png`
- 결과: `public/images/paik-eomuk-potato-step-1.webp`
- 실제 크기: 1374×1145
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. On chopping board, prepared thin 3mm quarter-round potato slices, rectangular thin fishcake strips, diagonal cylindrical fishcake slices, onion pieces, sliced scallions and green chili. No cooking or seasoning yet.

## paik-eomuk-potato-step-2

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-0bebec2f-9c73-4f6f-be32-535d0e3244b3.png`
- 결과: `public/images/paik-eomuk-potato-step-2.webp`
- 실제 크기: 1312×1199
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Wooden spatula stirring fishcake rectangles and diagonal cylindrical fishcake slices, thin quarter-round potato slices, onion pieces, scallion and green chili slices in a deep dark frying pan with shallow brown soy sauce liquid. No red pepper powder yet. No sesame seeds yet.

## paik-eomuk-potato-step-3

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-4f3c4135-631a-445c-ac13-f68dc0524a96.png`
- 결과: `public/images/paik-eomuk-potato-step-3.webp`
- 실제 크기: 1312×1199
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Wooden spatula turning cooked fishcake rectangles, diagonal cylindrical fishcake slices, thin quarter-round potato slices, onion, scallion and green chili in a dark deep frying pan. Red chili seasoning coating the ingredients, very little liquid. No sesame seeds yet.


## 원본 영상 표시

공식 youtube-nocookie iframe을 실제 부모 페이지에서 확인했으나 재생 시도 뒤 currentTime=0, readyState=0 상태로 재생을 확인하지 못했다. 최종 본문은 해당 영상 원본 썸네일 링크로 대체했다. 구체적인 근본 원인은 미확정이며 사용자 환경에서 YouTube 원본으로 볼 수 있다.
