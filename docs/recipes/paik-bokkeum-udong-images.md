# 볶음우동 이미지 제작

- 제작일: 2026-10-21
- 도구: 내장 imagegen. 각 자산을 별도 호출하여 생성했다. CLI/API 대체 경로는 사용하지 않았다.
- 참조 이미지: 없음. 기존 메뉴 이미지를 재사용하지 않았다.
- 원본 보존 디렉터리: `/Users/shon/.codex/generated_images/01a15c9d-c359-7b80-af51-e647066e3ea0/`
- 2026-10-30 음식 클로즈업으로 교체: 손·창가·주방 배경 등 음식 외 요소 제거, 흐린 원목 위 팬/접시/도마와 음식만. 면은 길이·방향이 제각각인 실제 우동처럼(반복 무늬 금지), 3단계 양념은 갈색 간장색. 원본 경로는 교체본 기준(전체 경로).
- 결과: 모두 1536×1024. Pillow로 WebP quality 88 변환, 데이터의 실제 크기와 일치.

## 공통 프롬프트 기준

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Bright home kitchen with pale countertop. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. If hands are visible, use anatomically natural hands and safe cooking technique.

## 개별 프롬프트와 파일

### Step 1

On a wooden chopping board, a cook safely slices a white onion into thin strips, curled fingertips holding onion behind knife. Beside it are carrot matchsticks, 1cm-wide pieces of raw cabbage, chopped round green onion rings. No noodles in scene, no cooked food, no peppers, no mushrooms. A single clear cutting action.

- 원본: `/Users/shon/.codex/generated_images/01a18bab-c171-75a1-8c69-29451f00ab37/exec-c971491d-eb84-4b5d-90c3-f338f0dbe6b2.png`
- 결과: `public/images/paik-bokkeum-udong-step-1.webp`
- 육안 확인: 칼은 양파에 닿고 잡는 손은 칼날 뒤쪽에 위치. 양파 채, 당근 채, 생양배추와 대파가 보인다. 훈연멸치 분쇄는 같은 단계의 글로 설명하며 이 그림에는 채소 손질 한 동작만 담았다.

### Step 2

A single black deep frying pan on stovetop contains small browned pork loin pieces, chopped green onion rounds, sliced white onion, orange carrot matchsticks and 1cm-wide cabbage pieces. A natural hand with wooden spatula stirs vegetables with cooked browned pork, all ingredients contacting pan. Onion is starting to soften. No noodles yet, no sauce liquid, no mayonnaise, no garnish, no mushrooms or peppers.

- 원본: `/Users/shon/.codex/generated_images/01a18bad-0765-74f0-a82d-67ec3cfe68f2/exec-96a0c8f5-d2f6-4f79-983f-e9cc15632b36.png`
- 결과: `public/images/paik-bokkeum-udong-step-2.webp`
- 육안 확인: 노릇한 고기와 채소를 팬 안에서 주걱으로 볶는 장면. 면·양념 국물·마요네즈가 아직 없어 순서가 맞는다.

### Step 3

A black deep frying pan contains browned pork loin pieces, softened onion strips, carrot matchsticks, chopped green onion and 1cm cabbage pieces pushed to perimeter. In center is one compact block of thick white precooked udon noodles starting to loosen. A natural hand tilts a small plain ceramic bowl to pour thin brown soy sauce mixture specifically around outer edge of pan beside the noodles, not on top. A little bubbling liquid at edge from medium heat. No mayonnaise or toppings yet. No mushrooms, peppers, eggs or seafood. One clear pouring action, safe hand posture.

- 원본: `/Users/shon/.codex/generated_images/01a18baf-1706-7733-b983-a5fa31385b6c/exec-af44e68e-d028-49fe-9c58-b0572364fb4f.png`
- 결과: `public/images/paik-bokkeum-udong-step-3.webp`
- 육안 확인: 중앙의 우동면과 가장자리 양념 붓기, 익힌 고기·채소가 보인다. 마무리 고명은 없다. 이후 센 불 볶기와 담기는 글로 설명한다.

### Finished

Single plain off-white ceramic plate with fully cooked thick udon noodles coated in light brown soy glaze, small browned pork loin pieces, softened white onion strips, orange carrot matchsticks, pale green cabbage pieces and cooked green onion. Finished top has a modest thin mayonnaise drizzle, fine brown smoked anchovy POWDER (not fish or bonito flakes), and finely chopped green scallion rings. No action, no pouring, no hands. No eggs, sesame seeds, red peppers, mushrooms, shrimp or decorative garnishes. Not soup. Simple appetizing realistic meal portion, not studio advertising.

- 원본: `/Users/shon/.codex/generated_images/01a18baf-1706-72d0-9e71-595a3b868c77/exec-7a12f2a9-b326-4dab-97f7-03c601e72880.png`
- 결과: `public/images/paik-bokkeum-udong-finished.webp`
- 육안 확인: 익힌 볶음우동과 고기·채소, 마요네즈·가루·쪽파가 담긴 완성 상태. 재료 투입 중 장면이 아니다. 상세 OG와 Recipe 대표 이미지로 연결한다.

## 표시 기준

단계 alt·캡션은 그림의 동작에 맞게 작성했다. 그림은 계량 도식이 아니며 한 팬의 조리 예시다. 여러 인분은 본문 팁처럼 나눠 볶을 수 있다. 원본 유튜브 썸네일은 목록과 재생 실패 시 원본 링크에 사용하고 자체 일러스트와 구분한다. 원본 PNG는 생성 디렉터리에 보존하고 사이트에서 사용하는 WebP 네 장은 저장소에 저장했다.
