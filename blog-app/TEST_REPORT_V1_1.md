# Core Company Blog 로컬 검증 보고서 V1.1

- 작성일: 2026-08-07
- 최종 QA 판정: **조건부 PASS**
- 최종 dist: production build
- 로컬 런타임: Node 26.5.1, npm 12.0.2
- 목표 배포 런타임: Node 24 LTS

## 최종 요약

| 검사 | 결과 |
|---|---|
| 콘텐츠 validation | 성공, 3개 모두 sample:true |
| Astro check | 50 files, 0 errors, 0 warnings, 0 hints |
| 단위·정적 테스트 | 15/15 통과 |
| 전체 Playwright | 37/37 통과 |
| 수정 후 접근성·반응형 집중 Playwright | 8/8 통과 |
| axe WCAG A/AA | 위반 0 |
| Lighthouse 홈 | 98 / 100 / 100 / 100, CLS 0.000 |
| Lighthouse 편집 원칙 | 98 / 100 / 100 / 100, CLS 0.000 |
| Lighthouse 샘플 글 | 98 / 100 / 100 / 100, CLS 0.000 |
| Pagefind 한글 검색 | 검수 빌드 3개 글 색인, E2E 통과 |
| 390px 문서 overflow | 0 |
| 내부 깨진 페이지 링크 | 0 |
| production 내부 표식 | 0 |

Lighthouse 표의 값 순서는 Performance / Accessibility / Best Practices / SEO입니다.

## 실행 명령과 정확한 결과

### 의존성 동기화

`npm install`

- 제거: 7 packages
- audit: 527 packages
- vulnerabilities: 0
- 경고: npm 12 install-script 정책이 `esbuild@0.28.1` postinstall 1건 차단
- 현재 설치 상태에서 이후 check/build/E2E/Lighthouse는 모두 성공

### 콘텐츠

`npm run content:validate`

- Markdown: 3개
- draft: 0
- sample: 3
- 결과: 성공

`npm run content:list`

- `ai-infrastructure-security-checklist`: draft false, sample true
- `office-document-ai-review`: draft false, sample true
- `pension-self-checkin-guide`: draft false, sample true, featured true
- sample 상태를 해제한 글: 0

### 타입·구조

`npm run check`

- Astro 대상: 50 files
- errors: 0
- warnings: 0
- hints: 0
- 최종 재실행: 성공

### 단위·정적

`npm run test` — review dist 검사 시

- pass: 12
- skip: 3 production 전용 검사
- fail: 0

`npm run test` — 최종 production dist 검사 시

- pass: 15
- skip: 0
- fail: 0

검사 범위:

- 잘못된 frontmatter 차단
- slug 중복 차단
- 공개 근거 필드 실패/성공
- draft/sample 빈 근거 허용
- 본문 출처 heading 차단
- Astro `/blog` 정적 설정
- 명령·스크린샷·Lighthouse 설정
- canonical
- Pagefind/RSS/sitemap/404 산출물
- production sample·tag 제외
- 빈 카테고리 `noindex, follow`
- sitemap URL 정확성
- 내부 페이지 링크
- 공개 내부 표식

### 검수 빌드

`npm run build:review`

- Astro HTML pages: 22
- 글 상세: 3
- 카테고리: 6, 글 있음 3 / 비어 있음 3
- 태그: 9
- sitemap URL 계산값: 17
- Pagefind indexed pages: 3
- Pagefind words: 689
- 결과: 성공
- 경고: 한국어 stemming 미지원 안내. 한글 원문 검색은 E2E에서 성공

### 전체 E2E

`npm run test:e2e`

- tests: 37
- pass: 37
- fail: 0
- duration: 17.4s

포함 범위:

- fake gtag/dataLayer 분석 전달·정제·중복 방지
- archive indexability와 미사용 tag 404
- sitemap 포함/제외
- JSON-LD 타입별 정확한 개수
- axe 접근성
- 모바일 overflow·메뉴 focus·Escape
- desktop/mobile TOC 개수·링크·대상 ID·간격
- 표·코드 내부 스크롤
- canonical·RSS·robots·Pagefind
- frontmatter 출처 표시명·URL 대조
- 한글 검색과 0건 검색
- CTA query parameter
- review screenshot 14개

### 접근성 보정 후 집중 E2E

`npx playwright test tests/e2e/accessibility.spec.ts tests/e2e/responsive-and-navigation.spec.ts --project=chromium`

- tests: 8
- pass: 8
- fail: 0
- 결과: 성공

### Lighthouse 실행 이력

`npm run lighthouse` 첫 실행

- home: 98/100/100/100, CLS 0.000
- editorial-policy: 98/100/100/100, CLS 0.000
- article-sample: 96/99/96/100, CLS 0.000
- 결과: 실패
- 원인 1: 정적 WARNING/DANGER aside에 부적절한 `role=alert`
- 원인 2: 한글 TOC hash를 `querySelector`에 넣어 console SyntaxError

코드 수정 후 두 번째 실행

- article-sample: 98/99/100/100
- 결과: 실패
- 원인: Astro content layer가 기존 role을 캐시

`npx astro sync --force`

- 공식 옵션으로 content layer cache clear
- 결과: 성공

`npm run lighthouse` 최종 실행

- home: 98/100/100/100, CLS 0.000
- editorial-policy: 98/100/100/100, CLS 0.000
- article-sample: 98/100/100/100, CLS 0.000
- 결과: 성공
- 보고서: `review/lighthouse/`

### 최종 production 빌드

`npm run build`

- Astro pages: 10
- 글 상세: 0
- 카테고리: 6
- 태그: 0
- sitemap URLs: 2
- Pagefind 모듈: 생성 성공
- Pagefind 실제 공개 글: 0
- 결과: 성공

최종 `dist/sitemap-0.xml`:

1. `https://corecompany.net/blog/`
2. `https://corecompany.net/blog/editorial-policy/`

## 조건 비교

| 조건 | 기대 | 실제 | 판정 |
|---|---:|---:|---|
| desktop visible TOC | 1 | 1 | 검증됨 |
| mobile visible TOC | 1 | 1 | 검증됨 |
| 글당 출처 heading | 1 | 1 | 검증됨 |
| Article JSON-LD | 1 | 1 | 검증됨 |
| BreadcrumbList JSON-LD | 1 | 1 | 검증됨 |
| Organization JSON-LD | 1 | 1 | 검증됨 |
| production article HTML | 0 | 0 | 검증됨 |
| production tag HTML | 0 | 0 | 검증됨 |
| production sitemap URL | 2 | 2 | 검증됨 |
| empty category noindex | 6 | 6 | 검증됨 |
| E2E failures | 0 | 0 | 검증됨 |
| Lighthouse Accessibility | 100 | 100 | 검증됨 |
| Lighthouse Best Practices | 100 | 100 | 검증됨 |
| Lighthouse SEO | 100 | 100 | 검증됨 |
| CLS upper bound | < 0.1 | 0.000 | 검증됨 |

## Pagefind

- 검수 빌드: 3개 sample 글, 689 words, 한국어 색인
- 한국어 글 제목에서 추출한 검색어로 결과 1개 이상 확인
- 검색 결과 없음 상태의 status/live region 및 안내 화면 확인
- production: 공개 글 0이므로 사용자 결과 0건이 정상
- 경고: Pagefind 1.5.2는 한국어 stemming을 지원하지 않아 활용형 확장 검색은 제한될 수 있음

## JSON-LD

샘플 글 상세에서 파싱한 최상위 타입:

- Article: 1
- BreadcrumbList: 1
- Organization: 1
- `reviewedBy` 역할명 Person: 0
- `기술 책임자` JSON-LD 노출: 0

## 분석 이벤트

Playwright 초기화 스크립트로 가짜 gtag/dataLayer를 주입해 검증했습니다.

- CTA 클릭 1회 → gtag 1회
- gtag 존재 시 dataLayer 추가 0회
- dataLayer fallback custom event 1회 → 1회
- 허용되지 않은 event → 0회
- article_view → 페이지 load당 1회
- query/freeText/email/연락처 원문 → payload 0개

## 접근성·반응형·키보드

- axe 자동 WCAG A/AA 위반: 0
- Lighthouse Accessibility: 세 페이지 모두 100
- 390px 홈·글 상세 document overflow: 0
- 모바일 메뉴: `aria-expanded`, `aria-controls`, 첫 링크 focus, Escape 닫기, 버튼 focus 복귀 통과
- focus-visible: 3px outline CSS 유지, 키보드 메뉴 흐름 통과
- mobile TOC: 닫힌 `<details>` 1개, desktop TOC 숨김
- desktop TOC: sticky 1개, mobile TOC 숨김
- 표·코드: 열 삭제 없이 내부 가로 스크롤
- 자동 검사만으로 모든 보조기기 조합을 보장하지 않음

## 시각 검수

새 PNG 14개를 `review/`에 생성했습니다.

- `main-desktop-1440.png`
- `main-tablet-1024.png`
- `main-mobile-390.png`
- `article-desktop-fold.png`
- `article-desktop-full.png`
- `article-mobile-fold.png`
- `article-mobile-full.png`
- `category-desktop.png`
- `category-mobile.png`
- `empty-state-desktop.png`
- `search-desktop.png`
- `search-mobile.png`
- `editorial-policy-desktop.png`
- `404-desktop.png`

직접 확인한 핵심 7개 화면:

- 홈 1440/1024/390: 기존 레이아웃·톤 유지, overflow 없음
- 글 1440: TOC 1개, 큰 빈 공간 제거, 출처 1개
- 글 390: 접이식 TOC 1개, 본문·표·출처·변경 이력 유지
- 검색: 초기 상태와 검색 레이아웃 정상
- 빈 카테고리: 0건 메시지와 CTA 정상

승인 원본 HTML/PNG가 없으므로 픽셀 일치 판정은 미검증입니다.

## 깨진 링크와 404

- production HTML의 내부 `<a>` 대상 정적 검사: missing 0
- 미사용 `/blog/tag/smart-farm/`: review preview에서 HTTP 404
- `/blog/404.html`: 렌더 및 접근성 검사 통과
- 외부 Core Company/출처 서버의 장기 가용성은 배포 후 별도 확인 필요

## 내부 표식 및 공개 안전성

production `dist/` text scan 결과:

- REVIEW BUILD: 0
- 로컬 절대 경로: 0
- 확인 필요: 0
- TODO: 0
- #REF!: 0
- #NAME?: 0
- ●L: 0
- 테스트용 문구: 0
- 샘플 전용 내부 안내: 0
- 토큰·private key 패턴: 0
- 한국 휴대전화 패턴: 0

이메일 일반 패턴은 Pagefind 표준 UI 번들에 포함된 오픈소스 기여자 주소에서만 탐지됐습니다. 고객 개인정보나 프로젝트 비밀값이 아니며 검색 콘텐츠에는 포함되지 않습니다.

## 버전·자산 일관성

- package Astro: 7.1.6
- 실행 Astro: 7.1.6
- Pagefind: 1.5.2
- local Node: 26.5.1
- target Node: 24 LTS, 재검증 필요
- 공식 purple: `#8B3AC8`
- 공식 phrase: `On-Premise AI, Rooted in Space`
- 승인 local fonts: 0 files, system fallback 유지
- logo files: 변경 없음
- 원본 보고서: 변경 없음
- 신규 보고서: V1.1 이름으로 분리

## 미검증·조건부·N/A

- Node 24 clean install/build: 미검증
- 승인 디자인 원본과 픽셀 비교: 미검증
- 실제 Cloudflare 배포 응답: 미검증
- 전체 수동 스크린리더 조합: 조건부
- 외부 링크 장기 가용성: 조건부
- 재무 검증: N/A

## 재검증이 필요한 시점

- Hermes Node 24 clean build
- 첫 실제 공개 글 추가
- 승인 글꼴 추가
- 의존성 업데이트
- Cloudflare 배포 직후

