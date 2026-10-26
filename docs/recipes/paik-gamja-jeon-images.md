# 감자전 이미지 제작 기록

- 제작일: 2026-10-26
- 도구: built-in imagegen, 이미지마다 별도 호출. CLI/API 대체 경로 미사용.
- 스타일 참고: `.agents/skills/youtube-recipe-blog/assets/style-prep.webp`를 열어 질감·자연광 확인. 기존 이미지를 재사용하거나 편집 입력으로 전달하지 않고 새로 생성했다.
- 모든 결과 1536×1024. Pillow로 WebP quality=88 변환. 원본 PNG는 아래 생성 디렉터리에 보존.
- 원본 디렉터리: `/Users/shon/.codex/generated_images/01a17145-279b-70d0-8211-b50090fb7871/`

## 공통 프롬프트

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Bright home kitchen, light wooden worktop. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Safe natural hand anatomy where visible.

## 개별 장면 프롬프트와 결과

1. **체에 거르기** — Close view of a fine metal sieve resting securely across a clear glass mixing bowl: pale finely blended raw potato pulp is draining in the sieve, cloudy potato water collected in the bowl below. An inactive blender with lid sits behind, holding only small traces of potato puree. Making Korean gamjajeon from peeled potato and water only. No flour, eggs, greens or other ingredients. No hands necessary.
   - 원본: `exec-9f8bc193-bf47-4ca4-8188-e577f1e2762b.png`
   - 결과: `public/images/paik-gamja-jeon-step-1.webp`
2. **전분 섞기** — Show drained finely ground raw potato pulp being mixed with its recovered wet white potato starch in the glass bowl using a wooden spoon held naturally by one hand. Most watery liquid was poured away, batter is pale and moist, small glossy white starch streaks being mixed into it, not powder or flour. Fine metal sieve resting on a small dish behind. No eggs, flour, greens or other ingredients in batter. One action mixing only.
   - 원본: `exec-2b69027e-f652-4a56-a4ac-48a7e0bef583.png`
   - 결과: `public/images/paik-gamja-jeon-step-2.webp`
3. **부치기** — Show a black nonstick frying pan containing three small Korean gamjajeon potato pancakes frying in shallow cooking oil over medium heat. Pancakes made from finely ground potato and its own starch only, pale gold with uneven crisp golden edges, a few thin circular green chili rings embedded on top. One black silicone turner slides fully beneath one pancake and lifts its edge gently, supported pancake not floating. One natural hand holds the turner safely. No potato shreds, eggs, flour, onion, carrots, scallions or red chili.
   - 원본: `exec-4932fe2f-5c8c-48bb-96b5-ecbbdc96a0d3.png`
   - 결과: `public/images/paik-gamja-jeon-step-3.webp`
4. **완성** — A plain cream ceramic plate with three fully cooked Korean gamjajeon potato pancakes, made from finely ground potato and recovered potato starch. Irregular thin golden crisp edges and lightly golden tender centers with a few cooked thin green chili rings embedded in surface. A small ceramic dipping dish of dark soy sauce mixed with vinegar and thin circular green chili rings alongside. Natural casual meal, no hands or cooking action, no pouring. No shredded potatoes, eggs, flour, sesame, scallions, carrots, red peppers or extra garnishes.
   - 원본: `exec-4192d2fe-1292-43f9-a680-73e417eea92b.png`
   - 결과: `public/images/paik-gamja-jeon-finished.webp`

## 시각 검토

생성 결과 네 장을 직접 확인했다. 체 아래 물 받기, 젖은 전분과 감자 섞기, 뒤집개로 받친 전과 고추 고명, 양념장을 곁들인 완성 상태가 본문과 일치한다. 원본에 없는 달걀·밀가루·참깨 등은 보이지 않는다. 전의 개수는 장면 예시이며 원본의 완성 수량으로 주장하지 않는다. 반죽 질감과 노릇한 색은 일러스트 예시로 직접 조리 결과가 아니다.
