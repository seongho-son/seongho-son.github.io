# 이미지 자산과 제작 기준

## 동봉한 시각 레퍼런스

skill의 assets에는 실제 김치찌개 게시물 제작 때 생성한 자체 이미지가 있다. 다른 메뉴의 이미지로 그대로 재사용하지 말고 스타일 참조로 읽는다.

- `../assets/style-prep.webp`: 칼 방향·절단면을 보여주는 손질 장면.
- `../assets/style-water.webp`: 컵으로 줄어든 물을 보충하는 조리 중 장면.
- `../assets/style-finished.webp`: 자연스러운 식탁 위 완성 음식.

편집·참조 이미지로 도구에 전달하기 전 view_image로 직접 확인한다. 주방·자연광·그림 질감은 참고하되 메뉴에 필요한 조리 도구를 선택한다. 모든 요리를 크림색 냄비에 넣을 필요는 없다.

## 공통 이미지 방향

그림을 만들기 전에 해당 단계의 실제 조리 동작에 맞는 도구와 자세를 정한다. 생성 후에는 도구가 재료에 닿는 방식, 손의 자세, 재료의 익은 상태가 자연스럽고 본문과 일치하는지 확인한다. 사용자 수정은 재사용 가능한 원칙으로만 반영하고, 특정 메뉴의 도구 선택과 수정 이력은 그 게시물의 제작 기록에 남긴다.

실제로 요리하다가 직접 찍은 사진을 일러스트로 옮긴 듯한 자연스러운 시점. 실사 그대로가 아닌 섬세한 수채화와 연필 질감. 밝은 집 주방, 자연광, 약간 비정형적인 구도. 한 프레임에서 한 동작을 명확하게 보여준다. 인포그래픽·콜라주·허공에 뜬 재료·의미 없는 음식 장식은 피한다.

프롬프트 기본 문장:

> Original cooking-process illustration for a Korean home-cooking blog. Like a candid photograph taken by the cook in their home kitchen, then illustrated with translucent watercolor and fine pencil. Natural window light, realistic perspective and food texture, a single continuous landscape 3:2 scene. Keep the same kitchen and cookware across this recipe. Show the exact physical action and ingredient state described below. No text, labels, arrows, logos, split panels, decorative ingredients or studio advertising composition. If hands are visible, use anatomically natural hands and safe cooking technique.

이 뒤에 반드시 단계별 상태를 넣는다:

- 무엇을 하는 순간인가: 썰기/붓기/뒤집기/불 줄이기.
- 어떤 재료가 현재 들어 있고, **아직 들어가면 안 되는 재료는 무엇인가**.
- 절단 두께와 방향: 송송 썬 둥근 단면 vs 어슷 썬 타원 단면.
- 불과 국물 상태: 잔잔한 기포 vs 팔팔 끓음, 익기 전/후 색상.
- 장면에서 독자가 확인할 수 있어야 하는 단서: 칼과 결의 각도, 국물의 원래 높이, 익은 정도.

치수·원본에 없는 조리 지침을 이미지 프롬프트에서 발명하지 않는다. 정확한 수치는 본문/캡션으로 설명하고 그림 안에 글자를 억지로 생성하지 않는다.

완성 그림은 같은 조리 도구/재료의 마지막 상태다. 재료 투입 중인 모습을 완성 이미지로 쓰지 않는다.

## 파일

- `public/images/<slug>-step-1.webp` ... 원본에 필요한 단계 수만큼.
- `public/images/<slug>-finished.webp`: 본문 완성 및 상세 OG/Recipe용.
- 이미지 도구가 지원하는 크기를 사용하고, WebP 변환 후 실제 width/height를 HTML에 넣는다. 김치찌개 기준 1536×1024였지만 다른 결과에도 이 값을 무조건 쓰지 않는다.
- 단계 이미지는 lazy loading, 크기 명시, 동작을 설명하는 alt와 한두 문장 캡션.
- 배포 전 모두 열어서 확인한다. 변환은 도구 지침이 허용하는 로컬 이미지 유틸리티로 수행하며 원본을 보존한다.
- `docs/recipes/<slug>-images.md`에 프롬프트, 참조 이미지, 결과 경로를 남긴다.

## 유튜브

목록에는 해당 영상의 `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`를 사용한다. 실제 HTTP 응답과 이미지 크기를 확인한다. 제공되지 않는 영상은 `hqdefault.jpg` 등을 확인해서 선택하고 저해상도/검은 여백에 맞는 표시를 점검한다. 출처를 곁들이고 클릭은 레시피 상세로 보낸다.

이것은 사용자가 이 사이트에 선택한 썸네일 방식이지, 출처만 쓰면 모든 영상 자산을 재사용해도 된다는 저작권 보장이 아니다. 본문 단계별 영상 캡처를 자동으로 가져오지 않는다.

공식 영상은 `https://www.youtube-nocookie.com/embed/<id>`로 삽입하고 iframe title, 16:9, allowfullscreen과 재생 불가 시 원본 링크를 제공한다. 실제 부모 페이지에서 영상 요청을 차단하지 않고 플레이어 로딩과 재생 가능 여부를 확인한다. 임베드가 실패하면 성공한 것처럼 두지 말고 오류 원인을 확인한 뒤 원본 썸네일 링크로 대체하며, 확인 범위를 기록한다. 기본 이모지를 쓸 때 스크린리더용 의미를 넣을 수 있다. 별도 캐릭터 스티커는 현재 기본 자산에 없으므로 이미 제작된 것처럼 말하지 않는다.
