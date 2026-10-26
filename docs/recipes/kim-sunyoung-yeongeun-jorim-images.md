# 김선영 연근조림 이미지 제작 기록

- 제작일: 2026-10-26.
- 생성: 내장 `imagegen` 도구, 이미지마다 독립 호출 4회. 투명 배경 아님.
- 스타일 검토: `.agents/skills/youtube-recipe-blog/assets/style-prep.webp`를 눈으로 확인. 입력 참조 이미지로 전달하지 않았으며 새 이미지를 생성했다.
- 출력: 모두 1536×1024. Pillow로 WebP quality=90 변환, PNG 원본 보존.
- 원본 디렉터리: `/Users/shon/.codex/generated_images/01a17639-d7e0-7931-b950-5e868dc0d47a/`.

## 공통 프롬프트

Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene. Warm light wooden counter, bright home kitchen, black nonstick frying pan. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. If hands are visible, anatomically natural hands and safe cooking technique.

완성 이미지에서는 cooking-process 대신 finished-food로 요청하고 조리 중 동작을 제외했다.

## 단계별 장면 프롬프트와 결과

1. **손질** — Freshly peeled ivory lotus root is cut crosswise into thin 3–5 mm round slices with characteristic holes on a wooden cutting board, safe curled fingers holding root and other hand holding kitchen knife. A clear glass bowl beside board contains several raw lotus slices soaking in clear water with a little vinegar. No sauce, no cooked food, no other vegetables or garnish.
   - 원본: `exec-306ad236-2e3b-402d-aab9-e0fdb91b69e7.png`
   - 최종: `public/images/kim-sunyoung-yeongeun-jorim-step-1.webp`
2. **지지기** — Thin 3–5 mm ivory lotus root rounds, characteristic holes, coated with a very thin dry dusting of starch, shallow frying in a little oil in one layer. One natural hand uses wooden cooking chopsticks to turn ONE slice, revealing a pale golden brown cooked underside; rest are cream-colored lightly golden slices. Small plain plate of lightly dusted raw lotus root in background. No soy sauce yet, no dark glaze, no other ingredients, no sesame garnish. The frying oil is a shallow film, not deep frying.
   - 원본: `exec-af3f2aec-d05d-40e7-8366-26bc6ab527ed.png`
   - 최종: `public/images/kim-sunyoung-yeongeun-jorim-step-2.webp`
3. **양념 입히기** — Previously lightly pan-fried thin round lotus root slices with characteristic holes are now in a shallow pool of bubbling amber-brown soy sauce syrup. A natural hand holds a wooden spatula flat under slices, gently turning them to coat in the simmering sauce. The sauce is reducing but still visibly present on pan bottom, not burned or dry. Lotus slices are about 3–5 mm thick, golden brown with glossy sauce. Only lotus root and sauce in pan, no scallions, sesame, peppers or other garnish.
   - 원본: `exec-c83d3325-92a3-4759-8a31-cd42e58c17b5.png`
   - 최종: `public/images/kim-sunyoung-yeongeun-jorim-step-3.webp`
4. **완성** — On a warm light wooden kitchen table sits a modest off-white ceramic plate of finished Korean soy-glazed lotus root slices. Thin crosswise 3–5 mm slices with characteristic lotus root holes, cooked amber brown with a thin glossy soy syrup coating and faint golden pan-fried edges. A little sauce clings to the slices, no soup. No sesame seeds, green onions, nuts, chili or garnish of any kind, no unlisted ingredients. Finished dish at rest, no hands adding ingredients, no cooking action. Same bright natural home kitchen mood as earlier steps.
   - 원본: `exec-a6466749-edad-4b63-8160-a518bc6d223c.png`
   - 최종: `public/images/kim-sunyoung-yeongeun-jorim-finished.webp`

## 시각 검토

4장 모두 생성 결과를 직접 열람했다. 손질은 가로로 자른 연근 단면과 식초물, 지지기는 양념 전 연한 황금색, 조림은 끓는 갈색 양념과 주걱, 완성은 접시에 담긴 상태로 구분된다. 재료표에 없는 고명·깨·채소는 없다. 연속 장면은 동일한 밝은 나무 주방과 검은 팬을 사용한다. 일러스트의 두께나 색은 실측 자료가 아니며 본문의 0.3–0.5cm 지침이 기준이다. 실제 조리 사진으로 표시하지 않는다.

목록 썸네일은 생성 이미지가 아니라 원본 `https://i.ytimg.com/vi/Ug6Kzi9kmzw/maxresdefault.jpg`(1280×720)이며 완성 그림은 상세 OG·Recipe 대표 이미지에 사용한다.
