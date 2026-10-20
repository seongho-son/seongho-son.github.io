# 콩나물국 자체 일러스트

2026-10-20. imagegen 스킬의 기본 내장 `image_gen.imagegen`으로 장당 별도 생성했다. CLI/API 대체 생성은 사용하지 않았다. 생성 원본은 아래 경로에 보존하고 Pillow로 WebP 품질 88 변환했다. 모두 1536×1024이며 데이터의 실제 표시 크기와 같다.

## 스타일과 공통 프롬프트

Use case: illustration-story. Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene, 1536x1024. Bright home kitchen with pale counter, wood cutting board and stainless steel cookware. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. Anatomically natural hands and safe cooking technique.

스타일 참고: `.agents/skills/youtube-recipe-blog/assets/style-prep.webp`를 직접 열어 질감과 자연광을 확인했다. 도구에 참조 이미지로 전달하지 않았으며, 다른 요리 자산을 재사용하지 않았다.

## 장별 프롬프트와 경로

각 프롬프트는 위 공통 스타일에 아래 상태·금지 조건을 더했다. 완성 그림은 cooking-process 대신 finished-food illustration을 지정했다.

1. 손질: Show one exact action: a cook slicing Korean green onion crosswise into thin round rings about 0.3cm thick using a chef knife and safe claw grip. Beside it on the board are thin round green chili rings, and in a stainless colander nearby freshly rinsed raw soybean sprouts with substantial yellow bean heads and white stems draining. These are for clear Korean soybean sprout soup. No other ingredients, no meat, no kimchi.
   - 원본: `/Users/shon/.codex/generated_images/01a1577f-3466-7f32-87c6-bdbb013d93ab/call_ca031817df3d4258903b9dcd6229b637.png`
   - 결과: `public/images/paik-kongnamul-guk-step-1.webp`
2. 끓이기: Stainless steel two-handled soup pot on stove. Show exact action: rinsed Korean soybean sprouts with yellow bean heads and white stems tipping from a steel colander into already boiling water in the pot. Small flecks of minced garlic in the otherwise clear pale broth, salt and small amount of soup soy sauce already dissolved. Natural hands tilt colander safely close to water, no splashing. No scallions or chilies in pot yet. No tofu, meat, mushrooms, carrots, red chili powder or garnish.
   - 원본: `/Users/shon/.codex/generated_images/01a1577f-3466-7f32-87c6-bdbb013d93ab/call_4be1f11f686c4f3f8aff01d5701ff1b9.png`
   - 결과: `public/images/paik-kongnamul-guk-step-2.webp`
3. 마무리: Stainless steel two-handled soup pot on stove. Exact action: a natural hand tilts a small ceramic dish to add thin round green onion and green Cheongyang chili rings into lightly bubbling clear Korean soybean sprout soup. The soybean sprouts have yellow bean heads and long cooked white stems, submerged in ample pale clear broth with tiny minced garlic flecks. Medium heat gentle boiling, no vigorous splashes. Only soybean sprouts, green onion, green chili and minced garlic visible as ingredients. No red chili, tofu, mushrooms, meat, sesame or other garnish.
   - 원본: `/Users/shon/.codex/generated_images/01a1577f-3466-7f32-87c6-bdbb013d93ab/call_e310a7b4d25e40b794c951b4edcf3fe0.png`
   - 결과: `public/images/paik-kongnamul-guk-step-3.webp`
4. 완성: A simple off-white ceramic soup bowl of finished Korean kongnamul guk on a light wooden home table near a pale kitchen counter. Abundant clear pale broth surrounds cooked soybean sprouts with yellow bean heads and white stems, a modest amount of thin green onion rings and green chili rings and tiny minced garlic flecks. Steel spoon resting beside bowl. Same warm daylight home kitchen atmosphere, natural imperfect composition. This is finished soup ready to eat, no hands and no ingredient pouring. No meat, egg, tofu, mushrooms, red chili powder, sesame, rice in soup or decorative garnish.
   - 원본: `/Users/shon/.codex/generated_images/01a1577f-3466-7f32-87c6-bdbb013d93ab/call_f11364ff7a5545df8b1b25e92c2116f9.png`
   - 결과: `public/images/paik-kongnamul-guk-finished.webp`

## 시각 검토

생성된 네 장을 직접 확인했다. 1단계는 대파를 가로로 써는 자세·둥근 단면과 체의 생콩나물, 2단계는 파·고추가 없는 끓는 국물에 콩나물 투입, 3단계는 익힌 콩나물에 파·고추 투입, 완성은 같은 재료를 담은 맑은 국 상태다. 원본에 없는 고기·두부·달걀·깨·붉은 양념은 없다. 그림은 계량이나 정확한 불 세기를 증명하지 않으며 수치·시간은 본문에 안내한다.
