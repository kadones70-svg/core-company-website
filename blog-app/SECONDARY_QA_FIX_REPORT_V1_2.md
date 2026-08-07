# Core Company Blog 3차 보완 결과 보고서 V1.2

- 작성일: 2026-08-07 (Asia/Seoul)
- 작업 폴더: `C:\Users\kadones\orca\projects\codex\blog-app`
- 최종 배포 후보: `C:\Users\kadones\orca\projects\codex\blog-app\dist\`
- 기준 디자인: Paper Editorial + Calm Engineering 유지
- 기준 런타임: Node.js 24 LTS

## 최종 판정

| 구분 | 판정 | 근거 |
|---|---|---|
| 기술 구현 | **PASS / 검증됨** | Node 24.15.0에서 13개 최종 검증 명령 종료 코드 0, 단위·정적 테스트 32/32, Playwright 53/53 통과, Lighthouse 3개 화면 기준 통과 |
| Node 24 운영환경 | **PASS / 검증됨** | `C:\Program Files\nodejs\node.exe`의 `node --version` 결과 `v24.15.0`; npm 11.12.1 |
| 콘텐츠 공개 준비 | **조건부 / 조건부** | 프로덕션 공개 글 0개. 코드와 빈 상태는 준비됐으나 실제 공개 콘텐츠 검수·승인이 필요함 |
| 브랜드 원본 일치 | **미검증** | 공식 보라색 `#8B3AC8`과 문구 `On-Premise AI, Rooted in Space`는 유지됨. 승인 WOFF2와 디자인 원본 HTML/PNG가 없어 글꼴·픽셀 일치는 판단하지 않음 |
| 재무 검증 | **N/A** | 이번 범위에 재무 데이터와 금액 검증이 없음 |

모든 3차 중대 결함은 해결됐으므로 기술 구현 판정은 PASS다. 공개 글이 0개인 상태와 브랜드 원본 부재는 기술 결함과 분리해 각각 조건부·미검증으로 유지한다.

## 사전 감사와 제약 준수

- 프로젝트 내부 `AGENTS.md`: 발견되지 않음.
- V1.1 보고서, 테스트 보고서, 운영 가이드, Hermes 인계서와 기존 `review/` 결과를 확인함.
- Hermes Vault의 Core Company 브랜드·카피·블로그·QA 기준을 확인함.
- V1.1 보고서와 기존 V1.1 스크린샷은 수정하지 않음.
- 기존 V25 홈페이지, 기존 운영 `/blog/`, Git, GitHub, ZIP, 배포, Cloudflare, DNS, 외부 서비스 설정을 변경하지 않음.
- 샘플 글 3개의 `sample: true`를 유지했으며 공개 글을 새로 만들지 않음.
- 승인되지 않은 글꼴이나 디자인 자산을 다운로드하지 않음.

## 지적 사항별 변경 전·후

### 1. 분석 이벤트 개인정보 방어

변경 전:

- `article`, `category`, `cta`, `position`이 하나의 slug 정규식만 통과하면 전송될 수 있었음.
- 전화번호처럼 slug 형태가 가능한 값과 과도하게 긴 문자열을 별도로 차단하지 않았음.
- 이벤트마다 필요하지 않은 허용 키가 남을 수 있었음.

변경 후:

- `ANALYTICS_EVENT_NAMES`와 `CTA_POSITIONS`를 단일 상수로 정의하고 타입과 런타임 Set을 여기서 파생함.
- 카테고리는 기존 `CATEGORIES`에서 승인 slug를 파생함.
- 이벤트별 payload 키를 제한함: 글 조회, 검색, 검색 결과 클릭, 관련 글 클릭, 서비스 링크, 문의 CTA가 각각 필요한 비식별 값만 받음.
- `010-1234-5678`, 10~11자리 연속 숫자, 이메일, URL, 96자를 넘는 글 식별자를 차단함.
- 알 수 없는 이벤트와 payload 키, 검색어 원문, 자유 입력 텍스트를 제거함.
- 공개 `trackEvent()` 진입점 자체도 동일한 검증을 거치므로 브리지 우회 전송이 불가능함.
- gtag 우선, dataLayer 대체 경로, 둘 다 없을 때 조용한 종료 동작을 유지함.
- 한 번의 CTA·검색 결과·관련 글 클릭은 각각 정확히 1건만 전송됨을 UI 테스트로 확인함.

### 2. 태그 slug 충돌 차단

변경 전:

- `RAG`/`rag`, `AI/ML`/`AI ML`처럼 다른 이름이 같은 URL이 되거나 기호 전용 태그가 빈 slug가 될 수 있었음.
- 태그 페이지와 사이트맵이 개별적으로 `tagToSlug()`를 호출해 충돌을 합칠 수 있었음.

변경 후:

- `analyzeTagRoutes()`와 `assertUniqueTagRoutes()`를 공통 구현으로 추가함.
- 콘텐츠 검증, 태그 `getStaticPaths()`, 사이트맵이 같은 태그 변환·충돌 검사를 사용함.
- 빈 slug와 충돌이 있으면 원본 태그 이름과 글 파일 경로를 포함한 오류로 빌드를 차단함.
- 동일 표기의 같은 태그가 여러 글에 반복되는 것은 하나의 고유 경로로 유지함.
- 생성 직전 태그 slug 집합을 다시 비교해 고유성을 방어함.
- 정상 태그, 기호 전용 태그, 대소문자 충돌, 문장부호 충돌을 단위·통합 테스트로 검증함.

### 3. 검색 결과 0건 분석 이벤트

변경 전:

- 결과가 0건이면 조기 반환되어 `search` 이벤트가 발생하지 않았음.

변경 후:

- 결과 배열 필터링 직후 `count` 이벤트를 발생시키고 이후 0건 UI 분기로 이동함.
- 0건은 `{ count: 0 }`으로 정확히 1회 전송되며 검색어는 payload에 없음.
- 결과 있음, 결과 없음, 결과 클릭, 관련 글 클릭을 Pagefind 실제 UI에서 확인함.

### 4. 모바일 한글 제목 줄바꿈과 메뉴

변경 전:

- 390px에서 조사와 어절이 분리될 수 있었음.
- 직접 검수 중 모바일 메뉴가 CTA와 같은 가로 flex 행에 배치되어 링크 폭이 좁아지고 한글이 세로로 쪼개지는 추가 결함을 발견함.

변경 후:

- H1~H4에 `word-break: keep-all`과 긴 URL·영문·숫자용 `overflow-wrap: anywhere`를 함께 적용함.
- 기존 Hero 강제 `<br>`를 제거하고 자연스러운 공백과 `text-wrap: balance`에 맡김.
- 320px와 390px에서 `현장에`, `적용하는`, `체크인을`, `전에`, `기준을`의 Range가 각각 1개 줄 사각형임을 자동 검사함.
- 모바일 메뉴를 단일 열로 정리해 모든 링크 폭이 240px보다 크고 높이가 60px 이하이며 라벨 내부 overflow가 없음을 320px에서 검사함.
- 문구별 새 강제 줄바꿈은 추가하지 않음.

### 5. 검수 빌드 배너 공통화

변경 전:

- 홈과 글 상세에만 페이지별 배너와 CSS가 있었음.

변경 후:

- 기존 `REVIEW_BUILD === 'true'` 판별을 `BaseLayout.astro` 한 곳에서 사용함.
- 홈·글 페이지의 배너 마크업과 중복 CSS를 제거함.
- 검수 빌드 HTML 22개 모두 배너 1개, 프로덕션 HTML 10개 모두 배너 0개임을 정적 검사함.
- 프로덕션 전체 텍스트 자산 30개에서 `REVIEW BUILD`, `샘플 콘텐츠 포함`, `운영 배포 금지`를 포함한 내부 표식 0건을 확인함.
- 320px에서 배너가 두 줄로 안전하게 줄바꿈되며 가로 overflow는 없음.

### 6. Node 24 LTS 선언과 최종 재검증

변경 전:

- V1.1 검증은 Node 26.5.1이었고 `engines`는 `>=24 <27`이었음.
- 단일 목표 버전 파일이 없었음.

변경 후:

- `package.json`과 `package-lock.json`의 engine을 `24.x`로 통일함.
- `.nvmrc`에 실제 검증 버전 `24.15.0`을 선언함.
- 전역 설치나 PATH 영구 변경 없이 `C:\Program Files\nodejs\node.exe`를 명시해 최종 검증함.
- 시작 버전, 실행 파일, npm 버전을 `review/v1.2/node-version.*`에 보존함.

## 수정 파일과 이유

### 런타임·도구

- `.nvmrc`: Node 24.15.0 단일 목표 버전 선언.
- `package.json`, `package-lock.json`: Node engine을 24.x로 고정하고 V1.2 검증·프로덕션 화면 명령 추가.
- `playwright.config.ts`: 결과·HTML 보고서를 `review/v1.2/`에 저장하고 검수/프로덕션 빌드 모드를 선택 가능하게 함.
- `scripts/lighthouse.mjs`: Lighthouse 출력을 `review/v1.2/lighthouse/`로 분리.
- `scripts/collect-v1.2-evidence.mjs`: 라우트, sitemap, robots, JSON-LD, 내부 표식, 스크린샷 manifest 수집과 assertion 추가.
- `scripts/run-v1.2-verification.mjs`: Node 24 확인 후 13개 최종 검증 명령과 원본 로그를 순차 실행·보존.

### 소스

- `src/lib/tracking.ts`: 이벤트·키·값 허용 목록, PII 방어, 이벤트별 payload 필터, 공통 전송 경로 강화.
- `src/components/ContactCta.astro`: CTA 위치 타입의 임의 문자열 우회 제거.
- `src/config/content.ts`: 공통 태그 경로 분석·충돌 실패 함수 추가.
- `src/config/site.ts`: 빈 태그 slug로 URL을 만들지 못하도록 방어.
- `src/content.config.ts`: 기호 전용 태그 schema 차단.
- `scripts/content-validate.mjs`: 빌드 대상 콘텐츠 전역 태그 충돌 검사 추가.
- `src/pages/tag/[tag].astro`: 공통 태그 경로 검증 결과로 정적 경로 생성.
- `src/pages/sitemap-0.xml.ts`: 공통 태그 경로 검증 결과를 사이트맵에 사용.
- `src/pages/search/index.astro`: 0건 포함 검색 결과 수 이벤트 발생 위치 수정.
- `src/layouts/BaseLayout.astro`: 검수 배너를 모든 HTML 경로의 공통 위치로 이동.
- `src/pages/index.astro`: 페이지별 배너 제거, Hero 강제 줄바꿈 제거.
- `src/pages/articles/[slug].astro`: 페이지별 배너 제거.
- `src/styles/global.css`: 공통 배너, 한글 heading 줄바꿈, 모바일 메뉴 단일 열 보정.

### 테스트

- `tests/unit/tracking.test.ts`: 전화번호, 이메일, URL, 긴 문자열, 미승인 값, 정상 slug, 알 수 없는 키 검증.
- `tests/unit/tag-routing.test.ts`: 정상·빈 slug·대소문자·문장부호 충돌 검증.
- `tests/unit/content-validation.test.ts`: 여러 글 파일 사이 태그 충돌과 오류 경로 검증.
- `tests/unit/static-build.test.ts`: 모든 HTML의 검수 배너 개수와 프로덕션 부재 검사.
- `tests/unit/quality-config.test.ts`: Node 24 engine과 `.nvmrc` 일관성 검사.
- `tests/e2e/analytics.spec.ts`: 검색 있음/없음, 결과 클릭, 관련 글 클릭, 중복 방지 실제 전송 검사.
- `tests/e2e/v1.2-regressions.spec.ts`: 320/390px 한글 어절, overflow, 모든 경로 배너, 모바일 메뉴 라벨 검사.
- `tests/review/screenshots.spec.ts`: 기존 파일을 덮어쓰지 않도록 V1.2 회귀 스크린샷 폴더로 출력.
- `tests/review/v1.2-screenshots.spec.ts`: 요청된 V1.2 상태 화면과 프로덕션 배너 부재 화면 생성.

## 수치·조건 비교

| 검증 항목 | 변경 전/요구 조건 | 변경 후 실제 결과 | 판정 |
|---|---:|---:|---|
| 최종 Node | V1.1: 26.5.1 / 요구: 24 LTS | 24.15.0 | 검증됨 |
| 단위·정적 테스트 | V1.1: 15/15 | 32/32 | 검증됨 |
| Playwright | V1.1: 37/37 | 53/53, 프로덕션 전용 1건 의도적 skip | 검증됨 |
| 0건 검색 이벤트 | 변경 전: 0회 | `count: 0` 1회 | 검증됨 |
| 검수 배너 | 변경 전: 일부 페이지 | 22/22 HTML에서 정확히 1개 | 검증됨 |
| 프로덕션 배너 | 요구: 0개 | 0/10 HTML | 검증됨 |
| 프로덕션 태그 경로 | 요구: 0개 | 0개 | 검증됨 |
| 빈 카테고리 robots | 요구: 6개 모두 noindex, follow | 6/6 | 검증됨 |
| 프로덕션 sitemap | 요구: 홈·편집 원칙 2개 | 2/2 | 검증됨 |
| 검수 태그 경로 고유성 | 요구: 전부 고유 | 9개/고유 9개 | 검증됨 |
| 글 JSON-LD | 각 글 Article/Breadcrumb/Organization 1개 | 검수 글 3개 모두 1/1/1 | 검증됨 |
| 내부 표식 | 요구: 0건 | 30개 텍스트 자산에서 0건 | 검증됨 |
| 모바일 overflow | 요구: 320·390px 0건 | 홈·글·열린 메뉴 모두 0건 | 검증됨 |
| Lighthouse | 목표 95/100/100/100, CLS < 0.1 | 세 화면 모두 98/100/100/100, CLS 0 | 검증됨 |

## 검수 빌드와 프로덕션 빌드 차이

| 항목 | 검수 빌드 | 프로덕션 빌드 |
|---|---:|---:|
| HTML 경로 | 22 | 10 |
| 글 상세 | 3개 샘플 | 0 |
| 카테고리 | 6 | 6 |
| 태그 | 9 | 0 |
| sitemap URL | 17 | 2 |
| 검수 배너 | 각 HTML 1개 | 0 |
| Pagefind 인덱스 | 샘플 글 3개 | 공개 글 0개용 빈 색인 sentinel만 생성 |

프로덕션 카테고리 6개는 탐색용으로 유지되며 모두 `noindex, follow`다. 빈 카테고리·태그는 사이트맵에 포함되지 않는다.

## 화면 크기별 시각 검수

- 1440px: 홈 전체, 글 상세 첫 화면, 카테고리, 검색, 프로덕션 배너 부재를 직접 확인함. 레이아웃 재설계나 대형 공백 회귀 없음.
- 1024px: 홈 전체를 직접 확인함. 섹션 그리드, CTA, footer, 메뉴 전환에 잘림 없음.
- 390px: 홈·글·검색 있음/없음·열린 메뉴·focus-visible을 확인함. 조사 고립, 글자 잘림, 문서 가로 overflow 없음.
- 320px: 홈·글 제목과 열린 메뉴를 확인함. 한국어 어절 보존, 링크 가로 표기, 배너 안전 줄바꿈 확인.
- 요청 화면 10개와 기존 회귀 화면 14개를 `review/v1.2/`에 새로 생성함.

## 브랜드와 디자인

- 공식 보라색 `#8B3AC8`: 유지 확인.
- 공식 문구 `On-Premise AI, Rooted in Space`: 변형 없이 유지 확인.
- 공식 로고 파일: 재제작·변형하지 않음.
- 승인 WOFF2: 발견되지 않음. 시스템 폴백 유지, 외부 다운로드 없음.
- 승인 디자인 원본 HTML/PNG: 발견되지 않음. 픽셀 단위 일치를 주장하지 않음.
- 기존 Paper Editorial + Calm Engineering 구조와 콘텐츠 톤을 유지함.

## 증거 위치

- 전체 증거: `review/v1.2/`
- 명령과 종료 코드: `review/v1.2/commands.json`, `commands-summary.txt`
- 원본 로그 13개: `review/v1.2/logs/`
- Node 버전: `review/v1.2/node-version.json`, `node-version.txt`
- Lighthouse JSON 3개: `review/v1.2/lighthouse/`
- 프로덕션 경로: `review/v1.2/production-paths.txt`, `production-html-routes.txt`
- sitemap: `review/v1.2/sitemap-urls.txt`
- robots: `review/v1.2/empty-category-robots.json`
- JSON-LD: `review/v1.2/production-jsonld-type-counts.json`, `review-jsonld-type-counts.json`
- 내부 표식: `review/v1.2/production-internal-marker-scan.json`
- 스크린샷 manifest: `review/v1.2/screenshots-manifest.json`

## 남은 위험과 외부 확인

- 콘텐츠 공개 준비는 조건부다. 공개 글이 0개이므로 실제 글의 사실·출처·변경 이력·승인 절차가 필요하다.
- 승인 WOFF2와 디자인 원본 HTML/PNG가 제공되면 글꼴 계측과 픽셀 차이를 다시 확인해야 한다.
- Pagefind는 한국어 stemming 미지원 안내를 출력한다. 한글 원문 검색과 0건 상태는 실제 UI에서 통과했으나 형태소 기반 확장 검색은 제공하지 않는다.
- Hermes는 배포 전 Node 24.x에서 `npm ci`, `npm run build`, `npm run test`를 재실행하고 `dist/`가 프로덕션 빌드인지 확인해야 한다.
- 실제 공개 글·카테고리·태그가 추가되거나 Astro/Pagefind/Playwright 의존성이 변경되면 전체 V1.2 검증을 다시 실행해야 한다.

## 배포 담당자 전달 사항

- 배포 대상은 오직 `C:\Users\kadones\orca\projects\codex\blog-app\dist\`다.
- 배포 URL은 `/blog/`다.
- 최종 `dist/`는 `npm run build`와 프로덕션 전용 화면 검사 후 남은 프로덕션 결과다.
- `review/v1.2/`와 샘플 Markdown은 배포 대상이 아니다.
- Codex는 Git, GitHub, 배포, Cloudflare, DNS 작업을 수행하지 않았다.

## 최종 QA 확인

- **검증됨**: 개인정보 방어, 태그 충돌 차단, 0건 검색 이벤트, 공통 검수 배너, 모바일 어절·메뉴, SEO 빈 archive, JSON-LD, 내부 표식, Node 24 실행.
- **조건부**: 실제 공개 콘텐츠 준비와 운영 배포 후 URL 확인.
- **미검증**: 승인 원본 기준의 정확한 글꼴·픽셀 일치.
- **N/A**: 재무 검증.
- 버전 일관성: `package.json` engine `24.x`, `.nvmrc` `24.15.0`, 실제 실행 `v24.15.0`으로 일치.
- 보고서 버전: 코드·증거·보고서 모두 V1.2 기준. V1.1 파일은 보존됨.

**최종 기술 판정: PASS**
