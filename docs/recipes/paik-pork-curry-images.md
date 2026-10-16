# 뒷다리살 카레 이미지 제작 기록

- 도구: 내장 image_gen (CLI/API 대체 사용 없음)
- 확인일: 2026-10-16
- 스타일 참조: `.agents/skills/youtube-recipe-blog/assets/style-finished.webp`를 직접 열어 질감 확인. 다른 음식 그림 재사용 없음. 도구에 참조 파일은 전달하지 않고 텍스트로 지정.
- 목록: https://i.ytimg.com/vi/LTVxirHWvh8/maxresdefault.jpg — HTTP 200, 1280×720 확인.
- 본문: 자체 AI 일러스트, 원본 PNG는 생성 위치에 보존하고 WebP로 변환.
- 확인: 생성 결과를 열어 음식 재료·투입 전후 상태·동작·완성 상태를 육안 점검. 그림의 양·크기는 계량 기준이 아니며 본문 수치 우선.
- 완성 이미지에 조리 중 손이 나타난 어묵/시금치 초기 시안은 제외하고 정물로 재생성.

## paik-pork-curry-finished

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-1b9d9c1c-1c85-4d5c-999f-62cf31891a74.png`
- 결과: `public/images/paik-pork-curry-finished.webp`
- 실제 크기: 1312×1199
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Finished Korean golden brown pork curry over white rice on white plate. Small browned pork cubes, softened onion, tiny orange carrot cubes in thick curry sauce. No potato, peas, broccoli or herbs. No extra toppings.

## paik-pork-curry-step-1

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-e10726d9-87f7-4994-95b9-7df759296488.png`
- 결과: `public/images/paik-pork-curry-step-1.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Prepared raw pink pork cubes about 2cm on separate small board, small pile finely chopped pork fat, on main board onion rectangles and small 1cm carrot cubes. No potato. No cooking yet.

## paik-pork-curry-step-2

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-fa530e64-f056-454c-ad60-442b8d280004.png`
- 결과: `public/images/paik-pork-curry-step-2.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Wooden spoon stirring browned pork cubes and softened caramel brown onion pieces in a dark deep frying pan. No carrot yet, no curry powder or water yet.

## paik-pork-curry-step-3

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-4eb89b22-3f66-4602-8f17-b6dbde71beb8.png`
- 결과: `public/images/paik-pork-curry-step-3.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Pouring clear water from cup into a deep dark frying pan with browned pork, softened browned onion and small carrot cubes seasoned with soy sauce and ketchup. No curry powder yet, no potato.

## paik-pork-curry-step-4

- 원본: `/Users/shon/.codex/generated_images/01a1439a-9b31-7d70-9ae4-7d80dffd87b0/exec-ca479b8e-87e8-4621-b39e-4371020e53d1.png`
- 결과: `public/images/paik-pork-curry-step-4.webp`
- 실제 크기: 1536×1024
- 프롬프트:

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, stainless steel pot for soup, dark deep frying pan for stir-fry/curry, white bowls. Show exact physical action described. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Natural safe hands if visible. Wooden spoon gently folding a small melting pat of butter into thick golden brown Korean pork curry in a dark deep frying pan off heat. Sauce contains small pork cubes, soft onion, small carrot cubes only. No potato or garnish.


## 원본 영상 표시

공식 youtube-nocookie iframe을 실제 부모 페이지에서 확인했으나 재생 시도 뒤 currentTime=0, readyState=0 상태로 재생을 확인하지 못했다. 최종 본문은 해당 영상 원본 썸네일 링크로 대체했다. 구체적인 근본 원인은 미확정이며 사용자 환경에서 YouTube 원본으로 볼 수 있다.
