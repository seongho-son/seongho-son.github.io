# 얼마받지 — 다음 작업 인수인계 (NEXT STEPS)

다른 계정/사람/AI가 이어받을 수 있도록 정리한 문서. 이 저장소 안에서 대부분 완결된다.

---

## 0. 프로젝트 컨텍스트 (필수)

- **무엇**: "얼마받지" — 정부지원금(근로장려금·청년월세·부모급여·실업급여 등) 예상 수령액을 계산해 주는 민간 정보 사이트. 구글 애드센스 부업.
- **로컬 경로**: `/Users/shon/Desktop/benefit-finder`
- **라이브 URL**: https://seongho-son.github.io/  (GitHub 사용자사이트 repo `seongho-son/seongho-son.github.io`)
- **스택**: Astro 4.16 정적 사이트 + `@astrojs/sitemap@3.2.1`(버전 고정 — 3.7.x는 Astro4와 빌드 크래시). 계산기는 전부 클라이언트 사이드 vanilla JS.
- **글 라우트**: `/guides/<slug>` (⚠️ `/blog`는 기존 별도 `blog` 프로젝트 저장소가 점유 → 절대 `/blog` 재사용 금지).

## 1. 배포 방법 (⚠️ 중요 — Actions 아님)

GitHub Pages **legacy(branch) 방식**, 소스 브랜치 = **`gh-pages`**, `.nojekyll`로 Jekyll 우회.
- OAuth 토큰에 `workflow` 스코프가 없어 `.github/workflows/` 푸시 불가 → **Actions 워크플로 사용 안 함**(gitignore됨).
- `git push --force`는 사용자 deny 규칙 → **force 금지**(항상 fast-forward).

**재배포 절차:**
```bash
cd /Users/shon/Desktop/benefit-finder
npm run build                 # dist 생성
git add -A && git commit -m "…" && git push origin main   # 소스(main)

# 빌드결과물(dist)을 gh-pages로 (clone→교체→push, force 없이)
cd /tmp && rm -rf ghp
git clone --branch gh-pages https://github.com/seongho-son/seongho-son.github.io.git ghp
cd ghp && git rm -rqf . >/dev/null 2>&1
cp -R /Users/shon/Desktop/benefit-finder/dist/. .
touch .nojekyll
git add -A && git commit -m "deploy" && git push origin gh-pages
```
빌드 상태 확인: `gh api repos/seongho-son/seongho-son.github.io/pages/builds/latest --jq .status` (→ `built`)

## 2. 완료된 것 (건드릴 필요 없음)

- 사이트 라이브, 계산기 **6종**(근로장려금·자녀장려금·출산육아·청년월세·실업급여·기준중위소득, 계산 검증 완료), 정보 글 **25개**.
- 애드센스 필수 페이지: 개인정보처리방침·소개·문의·면책 + 사칭방지 고지.
- **애드센스 코드 세팅됨**: 게시자 ID `ca-pub-5644793210860513` (BaseLayout head 스크립트) + `public/ads.txt` 레코드. CMP(EEA 동의) 제출 완료.
- SEO: 페이지별 title/description/canonical, sitemap, robots, JSON-LD(WebSite·Organization·Article), og:image(og-image.png), 커스텀 404, 모바일 대응.
- 서치콘솔: HTML 파일 인증(`public/google3e65fdcffb6e8ea4.html`) + 사이트맵 제출.
- 근로장려금 수치 정합: 2024 귀속, 맞벌이 상한 **4,400만원**.

## 3. 대기 중 (사람 액션 / 자동)

- [ ] **애드센스 심사 결과** (며칠~2주). 승인되면 → 애드센스 대시보드에서 **자동광고 ON** (또는 광고단위 생성 후 slot ID 확보).
- [ ] **서치콘솔 색인**: 사이트맵이 "읽을 수 없음/발견 0"으로 보여도 파일은 **기술적으로 정상**(HTTP200·유효XML·BOM없음·`<url>` 32개 확인함). 새 속성 처리 지연이니 2~3일 대기. 재촉: GSC **URL 검사 → 색인 생성 요청**(홈부터).

## 4. 성장 작업 (다음 계정/AI가 진행할 실제 과제)

우선순위 순. **모두 위 "재배포 절차"로 배포 마무리할 것.** YMYL이라 모든 금액·기준에 기준연도+출처+면책, 정부 사칭·신청대행 오인 금지(기존 `Disclaimer.astro` 컴포넌트 재사용).

1. **[최우선] 지역별 지원금 자동 디렉터리** — 공공데이터포털 OpenAPI로 시군구×제도 롱테일 페이지 대량 생성(프로그래매틱 SEO). 실사용 API(인증키 발급식):
   - 중앙부처복지서비스 `data.go.kr/data/15090532`
   - **지자체복지서비스 `data.go.kr/data/15108347`** (지역 롱테일 핵심)
   - 공공서비스(혜택) `data.go.kr/data/15113968`
   - 주의: API 데이터를 그대로 대량 복붙 말고 요약·구조화 + 출처 링크. 개인정보 수집 없음(클라이언트/빌드타임만).
   - ⏸️ **현재 블로커**: 저장소·환경 어디에도 공공데이터포털 인증키가 없음(`.env` 없음). 사용자가 data.go.kr 가입 후 위 3개 API **활용신청 → 인증키 발급**을 해야 착수 가능. 발급되면 `.env`(gitignore)에 `DATA_GO_KR_KEY=` 로 넣고 빌드타임 수집 스크립트로 페이지 생성할 것.
2. **콘텐츠 완성·확장** — `CONTENT-PLAN.md`의 20개 계획은 **전부 작성 완료**(2026-07-27 확인). 이후 3개 추가되어 현재 **25개**: `child-tax-credit-examples`(자녀장려금 계산 예시), `income-recognition-amount`(소득인정액·재산의 소득환산액), `housing-benefit`(주거급여). 다음 후보 주제: 의료급여 본인부담, 차상위계층, 국민연금 크레딧, 청년내일채움공제 후속, 지자체 출산장려금 비교. 글 하나당 1,000자+, 내부 링크 2개+(계산기/다른 글), frontmatter category/tags/relatedTool.
3. **계산기 증축** — ✅ 기준중위소득 계산기(`/tools/median-income`)·자녀장려금 계산기(`/tools/child-tax-credit`) 추가 완료(2026-07-27, 총 6종). 다음 후보: 주거급여 기준임대료 계산기(급지·가구원수 표 고시값 확보 필요), 소득인정액 모의계산기(기본재산액·환산율 고시값 필요), 육아휴직급여 계산기. 참고 모범 파일: `src/pages/tools/labor-tax-credit.astro` + `src/components/Disclaimer.astro`.
   - ⚠️ 계산기 수치 갱신 포인트: 기준중위소득은 매년 8월경 다음해 고시 → `median-income.astro`의 `MEDIAN` 배열과 `median-income-2026.md` 표를 함께 수정. 근로·자녀장려금은 귀속연도 산정표 변경 시 `TABLE` 상수 수정.
4. **커스텀 도메인**(선택, 승인률·브랜딩↑) — 도메인 구매 후 GitHub Pages 커스텀 도메인 설정 + `astro.config.mjs`의 `site`를 그 도메인으로 변경 + 재배포. (현재 `site: 'https://seongho-son.github.io'`)
5. **광고 실배치**(승인 후) — 자동광고 ON이면 자동. 수동 제어 원하면 애드센스에서 광고단위 생성 → slot ID로 각 페이지 `.ad-slot` 위치(결과박스 직후·본문 중간, 이미 배치됨)에 `<ins class="adsbygoogle">` 삽입. `.ad-slot:empty`는 숨김 처리돼 있음.

## 5. 절대 지킬 것 (컴플라이언스 — 어기면 애드센스 정지)

- 정부기관 사칭 금지(이름·도메인·로고에 gov/정부24/복지로/공식 등 X).
- 개인정보(주민번호·계좌) 수집 금지 → 계산기 전부 클라이언트 계산.
- 신청 대행 뉘앙스 금지(자가진단까지만) + 공식 사이트(홈택스/복지로/정부24/고용24) 딥링크.
- 본인/지인 광고 클릭 절대 금지(부정클릭 = 계정 영구정지).
- 모든 제도 수치에 기준연도+출처+면책, 변경 시 갱신.

## 6. 참고 문서 (repo 루트)

- `CONTENT-PLAN.md` — 콘텐츠 클러스터 20개 계획
- `HANDOFF-B-parenting-calculator.md` — 출산·육아 계산기 사양(+아동수당 만9세 확대 감사 메모)
- `SEARCH-CONSOLE.md` — 서치콘솔 등록 절차 (있으면)

## 7. 핵심 값

- 애드센스 게시자 ID: `ca-pub-5644793210860513` (ads.txt: `google.com, pub-5644793210860513, DIRECT, f08c47fec0942fa0`)
- 서치콘솔 인증 HTML: `/google3e65fdcffb6e8ea4.html`
- git 커밋 계정: seongho-son / wjdgns200297@gmail.com
