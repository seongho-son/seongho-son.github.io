# 무생채 이미지 제작

2026-10-30, built-in image_gen 사용. 자체 AI 일러스트이며 직접 조리 사진이나 영상 캡처가 아니다.

## 스타일와 참조

`.agents/skills/youtube-recipe-blog/assets/style-prep.webp`를 view_image로 확인했다. 주방의 자연광·수채화 질감을 시각적으로 참고했으며 도구 입력 참조 이미지로 첨부하지 않았다. 각 이미지는 독립적인 신규 생성이다. 밝은 집 주방, 나무 도마와 스테인리스 볼, 일정한 무채 상태를 유지했다.

## 프롬프트

공통: Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Warm bright home kitchen, pale countertop, wooden cutting board, stainless steel mixing bowl. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Anatomically natural hands.

1. 손질: Show a chef knife cutting stacked thin slices of white Korean radish into fine matchsticks for musaengchae salad. Natural hands with curled fingertips safely behind blade. A modest pile of white raw radish matchsticks beside the knife, whole green onion lying at back of board. No seasoning yet, no other ingredients, no kimchi, no meat.
2. 버무리기: Show one hand in a clean translucent food-safe glove gently mixing raw fine white Korean radish matchsticks with fine red pepper powder, minced garlic, sugar, salt, vinegar and thin round green onion slices in the steel bowl. Radish partly coated orange-red, remaining white strands indicate mixing in progress. No sesame seeds yet. No cabbage, no cucumber, no meat, no cooking heat. Only the bowl on the counter, close candid view.
3. 깨소금: Show a small wooden spoon in a natural hand sprinkling ground sesame (a mixture of crushed beige sesame particles and a few intact seeds) onto evenly orange-red seasoned raw Korean radish matchsticks and thin green onion rounds in the stainless steel bowl. The salad is already well mixed with red pepper, salt, sugar, garlic and vinegar. No other ingredients. A small amount of seasoned moisture at bottom, not soup. Single action of adding ground sesame for finishing, no pouring oil, no cooking heat.
4. 완성: Original finished-dish illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Same warm bright home kitchen, pale countertop and wooden board. Finished Korean musaengchae: raw fine julienned white Korean radish evenly coated orange-red with fine chili powder, vinegar, salt, sugar and minced garlic, thin round green onion slices and modest ground sesame evenly mixed throughout. A modest mound on a plain ivory ceramic side-dish plate on wooden table. No hands, no ingredient being added, no rice, no egg, no meat, no cabbage, no cucumber, no decorative greens, no steam. No text, labels, arrows, logos, split panels or studio advertising composition.

## 파일과 검수

원본 PNG는 `/Users/shon/.codex/generated_images/01a18af7-092c-7143-a00a-9e361407e35e/`에 보존했다. Pillow로 WebP quality=88 변환. 모두 실제 1536×1024이며 현행 imageSizes와 일치한다.

| 용도 | 원본 파일 | 프로젝트 결과 |
|---|---|---|
| 손질 | exec-f36bb780-69f6-4254-b68c-d7a2352e6ba7.png | public/images/paik-musaengchae-step-1.webp |
| 버무리기 | exec-7cea6531-70f0-4082-a95b-91bd37e36e80.png | public/images/paik-musaengchae-step-2.webp |
| 깨소금 | exec-fccd184d-c437-41f7-b5f4-04d30fb54153.png | public/images/paik-musaengchae-step-3.webp |
| 완성 | exec-a1a8a3e4-5d6a-4036-aa49-ac86975644ae.png | public/images/paik-musaengchae-finished.webp |

생성 결과 네 장 모두 직접 보았다. 1번은 무의 채 썰기와 칼·손 자세, 2번은 깨소금 투입 전 양념이 덜 섞인 상태, 3번은 깨소금 투입, 4번은 재료 투입 없는 완성 상태다. 배추·오이·고기 등 원본에 없는 식재료가 없다. 칼 손질은 본문에 편집상 대안으로 명시했다. 완료 그림은 상세 OG와 Recipe 이미지에 연결한다.
