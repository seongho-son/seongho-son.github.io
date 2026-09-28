# 제육볶음 이미지 제작

내장 image_gen 사용. 생성일 2026-09-28. 각 원본 PNG를 보존하고 WebP quality 86으로 형식 변환했다. 모든 결과는 1536×1024.
김치찌개 style-prep.webp를 눈으로 보고 분위기를 참고했으며 생성 도구에는 이미지 참조 입력 없이 아래 장면을 각각 요청했다.

## 공통 프롬프트

Landscape 1536x1024 original Korean home cooking instruction illustration. Like a candid home-cook photograph rendered in delicate translucent watercolor and fine pencil. Warm cream-tile kitchen, realistic ingredients and natural hand-tool contact. One continuous scene. No text, labels, arrows, panels or logos. Only ingredients appropriate to this stage. No decorative extra food.

## 장면별 최종 프롬프트와 결과

1. Main action: anatomically natural hand wearing transparent disposable food-preparation glove INSIDE large cream bowl, fingers gathering and massaging thin raw pink pork shoulder slices with soy sauce and sugar. Other hand steadies rim. No chopsticks, spoons, red marinade or vegetables in meat.
   - `public/images/kim-seoul-jeyuk-step-1.webp`
   - 원본 `exec-e5297401-4b58-45d3-8be8-aa52858bc55e.png`
2. Close-up board: half onion resting flat, knife slices lengthwise root-to-tip into curved strips about 5mm wide. Guiding fingertips tucked away from blade. Beside it lengthwise green onion strips about 5cm and diagonal chili slices. Cream bowl of mixed chili marinade off board. No raw meat on board.
   - `public/images/kim-seoul-jeyuk-step-2.webp`
   - 원본 `exec-d406df6f-6f0d-4f4b-972c-76700911f690.png`
3. Black shallow nonstick frying pan, lightly soy-seasoned thin pork slices in oil, mostly opaque beige with some pink remaining. Stainless kitchen tongs physically grip and turn a slice, separating overlapping slices. No spatula, vegetables or chili sauce yet.
   - `public/images/kim-seoul-jeyuk-step-3.webp`
   - 원본 `exec-a119644c-1069-428d-bf8c-184d7677c4b9.png`
4. Same pan, opaque beige pork. Hand tips cream bowl so thick red marinade drops onto meat, other hand uses stainless tongs. Visible uncoated meat shows timing. No vegetables, sesame or wooden spatula.
   - `public/images/kim-seoul-jeyuk-step-4.webp`
   - 원본 `exec-dd218e2b-8383-4d5f-9157-007fc91fa331.png`
5. Same pan, cooked red-sauced pork, translucent curved onion strips and softened long green onion. Hand tips small dish of diagonally sliced green chilies into pan. Other hand holds tongs among meat. Sesame beside stove for final sprinkle. No unrelated vegetables.
   - `public/images/kim-seoul-jeyuk-step-5.webp`
   - 원본 `exec-cbf1a6e0-842c-4b3d-8b26-01e864408b54.png`
6. Finished jeyuk bokkeum in black shallow skillet on trivet. Fully cooked thin red-sauced pork, translucent onions, long green onions, diagonal green chili, sesame. No hands or raw pork. Small bowl plain rice as serving accompaniment. Natural home table composition.
   - `public/images/kim-seoul-jeyuk-finished.webp`
   - 원본 `exec-fd9de230-dbfa-451f-833a-0ca6570e9938.png`

원본 폴더: `/Users/shon/.codex/generated_images/01a0e66f-654c-7b20-a670-98c245c15e52/`.

## 사용자 피드백과 확인

- 첫 밑간 시안의 젓가락을 손으로 버무리는 장면으로 수정.
- 고기 굽기의 나무 주걱을 집게로 뒤집는 장면으로 수정.
- 이는 이번 요리의 제작 선택이며 스킬에는 도구·자세가 실제 조리 동작에 맞는지 검증하는 일반 원칙만 남김.
- 6개 생성 결과를 직접 확인. 밑간에는 빨간 양념 없음, 고기 굽기에는 채소 없음, 양념 뒤에 채소, 마지막 고추와 깨 순서가 본문과 일치.
- 완성 그림은 서빙용 팬 형태가 조리 팬과 조금 다르며 완성 예시로 표시함. 조리 사진·영상 캡처가 아님을 본문에 표시.
