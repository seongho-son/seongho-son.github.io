# 백종원 오므라이스 이미지 제작 기록

- 제작일: 2026-10-28. 도구: 내장 image_gen (imagegen 스킬의 기본 경로). 자산별 1회씩 총 4회 생성.
- 외부 참조 이미지/영상 캡처 사용 없음. 수채화·연필 스타일을 텍스트로 지정.
- 원본 PNG는 아래 로컬 경로에 보존. Pillow로 WebP quality=88 변환만 수행, 그림 편집 없음.
- 모두 실제 1536×1024이며 기존 dailyRecipes의 imageSizes와 일치. 본문 lazy loading·alt·캡션 유지.

## 공통 프롬프트와 자산별 장면 지시

아래는 각 호출의 스타일·장면 지시를 공통 부분과 개별 부분으로 나누어 기록한 것이다. 완성 그림은 팬 대신 접시와 나무 식탁을 지정했다.

Use case: illustration-story. Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, single continuous landscape 3:2 scene, 1536x1024. Light wooden counter, black nonstick frying pan. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition.

### step-1

Step 1 of omurice: making brown sauce. Wooden spoon. Show a natural hand stirring a smooth reddish brown sauce made of browned flour and oil roux, water, ketchup, soy sauce and sugar, gently bubbling in the pan. No rice or eggs or vegetables in the sauce; no meat, mushrooms or garnishes. One action only: stirring sauce, no pouring.

- 원본: `/Users/shon/.codex/generated_images/01a180aa-5634-7763-906c-5e196b332b9c/exec-ac4048c9-1950-44f5-8e96-975bbaf77ca4.png`
- 결과: `public/images/paik-omurice-step-1.webp`

### step-2

Step 2 of omurice: frying rice. Wooden spatula. A natural hand uses a wooden spatula to break up and stir cooked rice with tiny finely diced translucent onion and orange carrot in the pan. Rice is lightly tan from soy sauce and mirin, separate grains, not red ketchup fried rice. No egg yet, no meat, peas, green herbs, or other vegetables. One continuous cooking action with safe natural hand posture.

- 원본: `/Users/shon/.codex/generated_images/01a180aa-5634-7763-906c-5e196b332b9c/exec-f63868a0-fd76-4c2f-88a4-0bb3f6eb2bff.png`
- 결과: `public/images/paik-omurice-step-2.webp`

### step-3

Step 3 of omurice: cooking the egg topping. Wooden spoon. A natural hand gently stirs beaten yellow eggs in the lightly oiled pan, gathering soft curds in a connected roughly circular egg sheet. Eggs are partly set during cooking, soft folds visible. Nothing but eggs in the pan: no rice, no vegetables, no sauce, no herbs or cheese. One action only, natural safe anatomy.

- 원본: `/Users/shon/.codex/generated_images/01a180aa-5634-7763-906c-5e196b332b9c/exec-7fa6ce1c-2193-4280-9b29-825c30387110.png`
- 결과: `public/images/paik-omurice-step-3.webp`

### finished

Finished-dish illustration: home style omurice. Light wooden table, a plain white ceramic plate. Small dome of lightly tan soy sauce fried rice with finely diced onion and carrot mostly hidden under a gently folded soft yellow egg sheet, covered on one side with smooth reddish brown roux ketchup soy sauce gravy pooling modestly around the base. Egg topping visibly set yet soft, no raw translucent liquid. A small edge of rice visible. Finished dish resting naturally, no hand, no pouring, no tools touching food. No ketchup zigzag, no meat, no peas, no herbs, no green garnish, no side dishes.

- 원본: `/Users/shon/.codex/generated_images/01a180aa-5634-7763-906c-5e196b332b9c/exec-aad3c8b7-49f1-4ca3-a82b-2ac0bfdd89d7.png`
- 결과: `public/images/paik-omurice-finished.webp`

## 시각 검수

4장 모두 직접 열어 확인했다. 소스에는 채소·밥·달걀이 없고, 볶음밥에는 양파·당근만 있다. 달걀옷 단계는 익어가는 달걀을 젓는 모습이며 완성 그림은 밥 위 달걀과 갈색 소스다. 추가 고기·완두콩·장식 고명 없음. 자연스러운 손과 도구 접촉, 검은 팬과 나무 조리대의 일관성을 확인했다. 완성 그림은 재료를 투입 중인 장면이 아니다. 직접 조리 사진으로 표시하지 않는다.

목록 썸네일은 원본 영상 `AlK2Gl6kHZI`의 maxresdefault.jpg이며 HTTP 200/1280×720 확인. 상세 OG와 Recipe 대표 이미지는 자체 finished.webp를 쓴다.
