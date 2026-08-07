# Core Company Blog 테스트 보고서 V1.2

- 실행일: 2026-08-07
- 작업 폴더: `C:\Users\kadones\orca\projects\codex\blog-app`
- 최종 런타임: Node.js v24.15.0, npm 11.12.1, win32 x64
- Node 실행 파일: `C:\Program Files\nodejs\node.exe`
- 최종 자동 검증: **13개 명령 모두 exit code 0**

## 명령별 결과

| 순서 | 명령 | 종료 코드 | 결과 | 원본 로그 |
|---:|---|---:|---|---|
| 1 | `npm run content:validate` | 0 | Markdown 3개 검증 성공 | `review/v1.2/logs/01-content-validate.log` |
| 2 | `npm run check` | 0 | Astro 56 files, errors/warnings/hints 0/0/0 | `review/v1.2/logs/02-check.log` |
| 3 | `npm run test` | 0 | 사전 프로덕션 상태 32/32 | `review/v1.2/logs/03-test.log` |
| 4 | `npm run build:review` | 0 | 검수 빌드와 Pagefind 생성 성공 | `review/v1.2/logs/04-build-review.log` |
| 5 | `npm run test` | 0 | 검수 상태 29 pass, production 전용 3 skip | `review/v1.2/logs/05-test.log` |
| 6 | `npm run test:e2e` | 0 | 53 pass, production 전용 1 skip | `review/v1.2/logs/06-test-e2e.log` |
| 7 | `npm run lighthouse` | 0 | 세 화면 기준 통과 | `review/v1.2/logs/07-lighthouse.log` |
| 8 | `node scripts/collect-v1.2-evidence.mjs review` | 0 | 검수 라우트·배너·JSON-LD 증거 성공 | `review/v1.2/logs/08-collect-review.log` |
| 9 | `npm run build` | 0 | 프로덕션 빌드와 Pagefind 생성 성공 | `review/v1.2/logs/09-build.log` |
| 10 | `npm run test` | 0 | 최종 프로덕션 상태 32/32 | `review/v1.2/logs/10-test.log` |
| 11 | `npm run review:screenshots:v1.2:production` | 0 | 프로덕션 배너 부재 1 pass, 검수 전용 9 skip | `review/v1.2/logs/11-review-screenshots-v1.2-production.log` |
| 12 | `node scripts/collect-v1.2-evidence.mjs production` | 0 | SEO·JSON-LD·표식 assertion 성공 | `review/v1.2/logs/12-collect-production.log` |
| 13 | `node scripts/collect-v1.2-evidence.mjs screenshots` | 0 | 요청 화면 10개, 회귀 화면 14개 manifest 성공 | `review/v1.2/logs/13-collect-screenshots.log` |

명령·시간·종료 코드의 기계 판독 원본은 `review/v1.2/commands.json`에 있다.

## 콘텐츠·schema 테스트

- 실제 Markdown: 3개, 모두 `sample: true`, `draft: false`.
- 공개 글 근거 필드: 기존 sources/changeLog 교차 검증 회귀 없음.
- 태그 경로:
  - 정상 태그: 통과.
  - 기호 전용 빈 slug: 실패 확인.
  - `RAG`/`rag`: 원본 이름과 두 파일을 표시하며 실패 확인.
  - `AI/ML`/`AI ML`: 문장부호 충돌 실패 확인.
  - 검수 빌드 태그 9개, 고유 경로 9개.
- 실제 샘플 태그와 `sample: true` 상태를 변경하지 않음.

## 분석 이벤트 테스트

- 차단 확인: `010-1234-5678`, `01012345678`, `0212345678`, 이메일, URL, 97자 문자열.
- 미승인 category·cta·position 제거 확인.
- 알 수 없는 이벤트와 payload 키 제거 확인.
- 정상 `rag-guide-2026-v2` slug와 승인 카테고리 통과 확인.
- 검색 결과 있음: `search` 1건, count > 0, 검색어 원문 없음.
- 검색 결과 없음: `search` 1건, `{ count: 0 }`, 검색어 원문 없음.
- 검색 결과 클릭: 클릭 1회당 `search_result_click` 1건.
- 관련 글 클릭: 클릭 1회당 `related_article_click` 1건.
- 문의 CTA 클릭: gtag 1건, dataLayer 중복 0건.
- gtag 부재 시 dataLayer 대체 경로 확인.

## Astro·빌드·Pagefind

### 검수 빌드

- HTML 경로: 22.
- 글 상세: 3.
- 카테고리: 6.
- 태그: 9, 모두 고유.
- sitemap URL: 17.
- Pagefind: 한글 `ko`, 3 pages, 689 words, filters 2.
- 모든 HTML에 검수 배너 정확히 1개.

### 프로덕션 빌드

- HTML 경로: 10.
- 공개 글: 0.
- 카테고리: 6.
- 태그: 0.
- sitemap URL: 2.
- Pagefind: 공개 글 0개를 처리하기 위한 빈 색인 sentinel 1 page/1 word; 샘플 검색 결과 없음.
- 프로덕션 `dist/`에 검수 배너 0개.

Pagefind는 한국어 stemming 미지원 안내를 출력했으나 실제 한글 검색 결과 있음/없음 UI 검사는 통과했다.

## SEO·robots·JSON-LD

- canonical: 모든 빌드 HTML이 `https://corecompany.net/blog/...` 형식.
- 프로덕션 태그 경로: 0.
- 프로덕션 빈 카테고리: 6/6 모두 `noindex, follow`.
- 프로덕션 sitemap: 다음 2개만 포함.
  - `https://corecompany.net/blog/`
  - `https://corecompany.net/blog/editorial-policy/`
- 빈 category, tag, article, search, 404 URL은 프로덕션 sitemap에 없음.
- 검수 글 3개 각각 JSON-LD:
  - Article 1.
  - BreadcrumbList 1.
  - Organization 1.
- 프로덕션 HTML 10개 각각 Organization 1, 총 10.
- 프로덕션 Article 0, BreadcrumbList 8.
- `기술 책임자`를 Person으로 출력하지 않는 V1.1 회귀 검사 통과.

## Playwright E2E

- 총 수집: 54 tests.
- 통과: 53.
- 의도적 skip: 1 (`CAPTURE_PRODUCTION=true` 전용 화면은 검수 빌드 E2E에서 제외).
- 실패: 0.
- 주요 범위:
  - 메인, 글, 카테고리, 태그, 검색, 편집 원칙, 404.
  - 목차 1개/variant, anchor ID 일치, desktop sticky, mobile details.
  - 출처 단일 섹션과 URL/표시명.
  - gtag/dataLayer 실제 전달과 중복 방지.
  - Pagefind 한글 결과·0건·클릭.
  - 모바일 메뉴 focus, Escape, aria-expanded, 320px 가로 라벨.
  - 320/390px 한글 어절과 문서 overflow.
  - table/code 내부 스크롤.
  - sitemap, RSS, robots, Pagefind 정적 자산.

## 접근성

- axe-core 자동 검사: 홈, 샘플 글, 검색, 편집 원칙, 404 총 5개 화면에서 WCAG 2 A/AA, 2.1 A/AA, 2.2 AA 태그 위반 0.
- 키보드: 모바일 메뉴 첫 링크 focus 이동, Escape 복귀, Tab trap 확인.
- `focus-visible`: 2px 이상 outline을 실제 계산하고 화면 캡처.
- 모바일 목차: 닫힌 `<details>`로 시작하고 키보드 사용 가능.
- 표 caption/column scope와 코드·표 내부 스크롤 확인.
- 자동 검사는 수동 접근성 검수 전체를 대체하지 않음.

## 반응형·시각 검수

| viewport | 검수 결과 |
|---|---|
| 1440px | 홈, 글, 카테고리, 검색, 프로덕션 배너 부재 정상. 글 제목~본문 대형 공백 회귀 없음 |
| 1024px | 홈 전체 그리드·CTA·footer 정상, 가로 잘림 없음 |
| 390px | 홈·글·검색 있음/없음·메뉴·focus 화면 정상, 조사 고립과 문서 overflow 없음 |
| 320px | 홈·글 제목 어절 유지, 열린 메뉴 가로 라벨, 배너 안전 줄바꿈, overflow 없음 |

- 요청 V1.2 화면: 10개.
- 회귀 화면: 14개.
- 스크린샷 크기와 SHA-256: `review/v1.2/screenshots-manifest.json`.
- 직접 확인 결과: 한국어 어절 분리 없음, 글자 잘림 없음, 배너 중복 없음, 모바일 메뉴 세로 글자 쪼개짐 없음.

## Lighthouse

| 페이지 | Performance | Accessibility | Best Practices | SEO | CLS |
|---|---:|---:|---:|---:|---:|
| 홈 | 98 | 100 | 100 | 100 | 0 |
| 편집 원칙 | 98 | 100 | 100 | 100 | 0 |
| 샘플 글 상세 | 98 | 100 | 100 | 100 | 0 |

- 기준: Performance ≥ 95, Accessibility/Best Practices/SEO = 100, CLS < 0.1.
- 세 화면 모두 기준 통과.
- 원본 JSON: `review/v1.2/lighthouse/home.json`, `editorial-policy.json`, `article-sample.json`.

## 내부 표식·공개 안전성

- 검사한 프로덕션 텍스트 자산: 30개.
- 전체 적중: 0.
- 미노출 확인:
  - `REVIEW BUILD`, `샘플 콘텐츠 포함`, `운영 배포 금지`.
  - 로컬 Windows 절대 경로와 file URL.
  - `확인 필요`, `TODO`, `#REF!`, `#NAME?`, `●L`, 테스트 문구.
  - 샘플 내부 안내.
  - 이메일, 전화번호, 알려진 토큰 형식.
- 결과 원본: `review/v1.2/production-internal-marker-scan.json`.

## 버전·파일 일관성

- `package.json`: `engines.node = 24.x`.
- `package-lock.json`: root engine `24.x`.
- `.nvmrc`: `24.15.0`.
- 실제 실행: `v24.15.0`.
- Astro: 7.1.6.
- 최종 `dist/`: 프로덕션 빌드이며 배너 0, 글 0, 태그 0.
- V1.1 보고서와 스크린샷은 보존됨.

## 경고·미검증·N/A

- 경고: Pagefind 한국어 stemming 미지원. 원문 한글 검색은 검증됨.
- 조건부: 실제 공개 글 0개. 콘텐츠 공개 준비는 별도 승인 필요.
- 미검증: 승인 WOFF2 및 디자인 원본 부재로 정확한 글꼴·픽셀 일치.
- 재무 검증: N/A.
- 배포 후 검증: 미수행. Codex 범위는 로컬 검증까지임.

## 결론

- 기술 구현: **PASS / 검증됨**.
- Node 24 운영환경: **PASS / 검증됨**.
- 콘텐츠 공개 준비: **조건부**.
- 브랜드 원본 일치: **미검증**.
- 실패한 최종 자동 명령: 0.
- 남은 중대 코드 결함: 없음.
