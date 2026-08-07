# Core Company Blog 2차 QA 수정 보고서 V1.1

- 작성일: 2026-08-07
- 작업 위치: `C:\Users\kadones\orca\projects\codex\blog-app`
- 결과 위치: `C:\Users\kadones\orca\projects\codex\blog-app\dist`
- 작업 범위: 로컬 코드 수정, 빌드, 테스트, 스크린샷, 보고서
- 수행하지 않은 작업: Git, GitHub, ZIP, 배포, Cloudflare, DNS, V25 및 기존 운영 `/blog/` 변경

## 최종 판정

**조건부 PASS**

2차 QA의 중대 코드 결함 7개 영역은 모두 수정되고 자동·시각 검증을 통과했습니다. 다만 목표 배포 런타임인 Node.js 24 LTS가 로컬에 없어 Node 26.5.1에서 검증했으므로, Hermes가 깨끗한 Node 24 환경에서 `npm ci`, `npm run check`, `npm run test`, `npm run build`를 재실행하는 조건이 남아 있습니다. 승인 디자인 원본 HTML/PNG도 프로젝트에서 발견되지 않아 픽셀 일치를 주장하지 않습니다.

## 사전 감사

작업 전에 다음을 확인했습니다.

- 프로젝트 내부 `AGENTS.md`: 발견되지 않음
- 기존 `IMPLEMENTATION_REPORT.txt`, `TEST_REPORT.txt`, `HERMES_DEPLOYMENT_HANDOFF.txt`, `CONTENT_OPERATIONS_GUIDE.txt`: 전문 확인, 원본 유지
- Astro 소스, 콘텐츠 3개, 기존 단위/E2E/스크린샷: 확인
- `D:\Hermes_Vault`의 Core Company 브랜드, 홈페이지, 블로그, 접근성, SEO, 프런트엔드 QA 자료: 확인
- 승인된 WOFF2/WOFF/TTF/OTF: 프로젝트와 Hermes Vault 모두 0개
- 공식 로고: 기존 `public/brand/` 복사본 유지, 변형·재제작하지 않음
- 공식 보라색 근거: `#8B3AC8`
- 공식 문구: `On-Premise AI, Rooted in Space`
- 승인 디자인 원본 HTML/PNG: 프로젝트에서 발견되지 않음

## 지적 사항별 변경 전·후

| 항목 | 변경 전 | 변경 후 | 검증 |
|---|---|---|---|
| 데스크톱 보이는 TOC | `ArticleToc` 이중 호출로 2개 | desktop variant 1개 | 검증됨 |
| 모바일 보이는 TOC | 동일 컴포넌트 중복 구조 | mobile `<details>` 1개 | 검증됨 |
| TOC DOM 구조 | 호출마다 모바일+데스크톱 모두 생성 | 호출마다 지정 variant만 생성 | 검증됨 |
| 제목과 본문 사이 | 두 번째 TOC로 비정상 대형 공백 | 본문 시작 간격 120px 이하 회귀 검사 | 검증됨 |
| TOC 한글 hash | `querySelector(link.hash)` 콘솔 오류 가능 | `decodeURIComponent` + `getElementById` | 검증됨 |
| 글당 `출처` 제목 | Markdown + 템플릿, 2개 | frontmatter 템플릿, 정확히 1개 | 검증됨 |
| 공개 글 `sources` 최소값 | 0개 허용 | 1개 이상 필수 | 검증됨 |
| 공개 글 `changeLog` 최소값 | 0개 허용 | 1개 이상 필수 | 검증됨 |
| production 태그 경로 | 고정 인기 태그 15개도 생성 | 실제 공개 글 태그만 생성, 현재 0개 | 검증됨 |
| 빈 카테고리 검색 노출 | index 가능 | 유지하되 `noindex, follow` | 검증됨 |
| production sitemap URL | 빈 archive 포함 가능 | index 가능한 URL 2개만 포함 | 검증됨 |
| 분석 전송 브리지 | 0개 | 공통 레이아웃 1개 | 검증됨 |
| CTA 클릭 1회 | 속성만 있고 전송 없음 | gtag 우선, 1회 전송 | 검증됨 |
| Article JSON-LD | 1개 | 정확히 1개 | 검증됨 |
| BreadcrumbList JSON-LD | 페이지와 Breadcrumbs에서 중복 가능 | 정확히 1개 | 검증됨 |
| Organization JSON-LD | 중복 참조 가능 | 공통 레이아웃에서 정확히 1개 | 검증됨 |
| 역할명 reviewer | `기술 책임자`를 `Person.name`으로 표현 | `reviewedBy Person` 제거 | 검증됨 |
| 공식 보라색 | `#7340C8` | `#8B3AC8` | 검증됨 |
| 공식 문구 | 문장 끝 마침표 변형 | 정확히 `On-Premise AI, Rooted in Space` | 검증됨 |
| Lighthouse 샘플 글 | 최초 96/99/96/100 | 최종 98/100/100/100 | 검증됨 |

## 구현 상세

### 1. 글 상세 TOC

- `ArticleToc.astro`에 `mobile | desktop` variant를 추가했습니다.
- 글 헤더에는 모바일 `<details>` 1개, 글 레이아웃 오른쪽에는 sticky desktop TOC 1개만 렌더링합니다.
- 테스트에서 `.first()`를 제거하고 각 test id의 전체 개수가 1인지 확인합니다.
- desktop/mobile 링크 배열이 동일하고 중복이 없으며 각 대상 ID가 정확히 1개인지 확인합니다.
- 한글 heading hash를 CSS selector로 처리하지 않고 안전하게 ID로 찾습니다.

### 2. 출처 단일화

- 샘플 Markdown 3개에서 본문 `## 출처`를 제거했습니다.
- frontmatter `sources`만 출처 제목, 표시명, 원문 URL, 확인일, 자료 유형을 렌더링합니다.
- `content:new` 기본 골격에서 출처 heading을 제거했습니다.
- validator는 본문 출처 heading을 오류로 차단합니다.
- 새 운영 규칙은 `CONTENT_OPERATIONS_GUIDE_V1_1.txt`에 정리했습니다.

### 3. 공개 근거 필드

- `draft:false && sample:false`이면 `sources`와 `changeLog`가 각각 최소 1개여야 합니다.
- draft 또는 sample은 기존 편집 흐름을 위해 빈 배열을 허용합니다.
- Astro Content Collection 스키마와 독립 콘텐츠 validator에 동일한 교차 검증을 적용했습니다.
- 담당자가 바로 조치할 수 있는 한국어 오류 메시지를 사용했습니다.

### 4. archive SEO와 sitemap

- 태그 정적 경로는 `getVisiblePosts()`의 실제 태그 집합에서만 만듭니다.
- production에는 현재 공개 글이 없어 태그 HTML이 0개입니다.
- 여섯 카테고리는 사용자 탐색을 위해 유지하고, 빈 경우 `noindex, follow`를 설정합니다.
- search는 `noindex, follow`, 404는 `noindex, nofollow`입니다.
- 고정 통합 대신 콘텐츠 기반 `sitemap-index.xml`과 `sitemap-0.xml` endpoint를 추가했습니다.
- sitemap은 홈, 편집 원칙, 보이는 글, 글이 있는 카테고리, 실제 태그만 포함합니다.

### 5. 분석 이벤트 브리지

- `BaseLayout`에서 한 번만 설치되는 공통 브리지를 연결했습니다.
- `core:analytics`와 `[data-analytics-event]` 클릭을 수집합니다.
- `window.gtag`가 있으면 우선 사용하고, 없으면 이미 존재하는 `dataLayer` 배열을 사용합니다.
- 둘 다 없으면 오류 없이 종료합니다.
- 허용 이벤트와 `article`, `category`, `cta`, `position`, `count`만 전송합니다.
- 검색어, 자유 입력, 이메일, 연락처 같은 값은 allowlist에서 제거됩니다.
- 검색 결과 링크는 속성 기반 한 경로만 사용해 이중 전송을 막았습니다.

### 6. 구조화 데이터

- 공통 레이아웃의 Core Company Organization 1개를 유지합니다.
- 글 Article의 author/publisher는 해당 Organization `@id`를 참조합니다.
- Breadcrumbs 컴포넌트만 BreadcrumbList를 생성합니다.
- 공개 승인된 실명이 없으므로 `기술 책임자`를 Person으로 출력하지 않습니다.

### 7. 브랜드와 글꼴

- CSS token과 숙박 카테고리 accent를 공식 보라색 `#8B3AC8`로 교체했습니다.
- footer 문구를 공식 문구와 정확히 일치시켰습니다.
- 로고 파일은 수정하지 않았습니다.
- 승인된 자체 호스팅 글꼴 파일이 없어 외부 다운로드를 하지 않고 기존 Noto Sans KR/DM Mono 우선 시스템 fallback을 유지했습니다.
- 화면 레이아웃과 콘텐츠 톤은 유지했으며 전면 재설계하지 않았습니다.

### 8. 추가 접근성 보정

- 정적으로 이미 존재하는 WARNING/DANGER callout의 `role=alert`를 `role=note`로 바꿨습니다.
- 시각 라벨 `주의`, `금지 및 오류`는 그대로 유지해 색상만으로 의미를 전달하지 않습니다.

## 생성 결과 수

| 결과 | production | review |
|---|---:|---:|
| Astro HTML 페이지 | 10 | 22 |
| 글 상세 | 0 | 3 |
| 카테고리 경로 | 6 | 6 |
| 글이 있는 카테고리 | 0 | 3 |
| 빈 카테고리 | 6 | 3 |
| 태그 경로 | 0 | 9 |
| sitemap URL | 2 | 17 |
| Pagefind 실제 글 색인 | 0 | 3 |
| 검수 스크린샷 | 해당 없음 | 14 |

production Pagefind는 공개 글이 0개일 때도 검색 모듈을 정상 생성하기 위한 내부 빈 색인을 만들며, 사용자 검색 결과는 정상적인 0건 화면으로 처리됩니다.

## 수정 파일과 이유

### 빌드·설정

- `astro.config.mjs`: 고정 sitemap 통합 제거, 콘텐츠 기반 endpoint 사용
- `package.json`, `package-lock.json`: sitemap 패키지 제거, Lighthouse review 빌드 및 글 상세 포함
- `playwright.config.ts`: 다른 로컬 프로젝트의 4321 preview와 충돌하지 않도록 기본 테스트 포트 4331 사용

### 콘텐츠와 validation

- `src/content.config.ts`: 공개 글 근거 필드 교차 검증
- `scripts/content-validate.mjs`: 공개 근거, 본문 출처 heading, heading 구조 검사
- `scripts/content-new.mjs`: H2 본문 골격, 출처 단일화, 공개 글 source 입력
- `src/content/posts/*.md` 3개: 본문 출처 섹션 제거, `sample:true` 유지

### UI·SEO·분석

- `src/components/ArticleToc.astro`: variant 분리, 한글 hash 안전 처리
- `src/pages/articles/[slug].astro`: TOC 구조, JSON-LD, 출처, 분석 메타
- `src/layouts/BaseLayout.astro`: robots 세분화, 분석 브리지 1회 설치
- `src/lib/tracking.ts`: 분석 allowlist, gtag/dataLayer 연결, 중복 설치 방지
- `src/pages/search/index.astro`: noindex, 검색 결과 분석 속성
- `src/pages/category/[category].astro`: 빈 카테고리 noindex
- `src/pages/tag/[tag].astro`: 실제 visible 태그만 정적 생성
- `src/pages/404.astro`: noindex, nofollow
- `src/pages/sitemap-index.xml.ts`, `src/pages/sitemap-0.xml.ts`: 콘텐츠 기반 sitemap
- `src/lib/remark-callouts.mjs`: 정적 callout 접근성 role
- `src/pages/index.astro`: production에서 샘플 내부 운영 문구 제거

### 브랜드

- `src/styles/global.css`, `src/config/content.ts`: 공식 보라색
- `src/components/Footer.astro`: 공식 문구

### 테스트·검수

- `tests/unit/content-validation.test.ts`: 공개 실패/성공, draft/sample 예외, 본문 출처 중복
- `tests/unit/static-build.test.ts`: production tag/sitemap/noindex, 내부 링크, 내부 표식
- `tests/e2e/responsive-and-navigation.spec.ts`: TOC 전체 개수와 대상 ID, 간격
- `tests/e2e/routes-and-seo.spec.ts`: frontmatter 출처 렌더링 1회
- `tests/e2e/analytics.spec.ts`: 분석 전달·정제·중복 방지
- `tests/e2e/archive-seo.spec.ts`: archive, sitemap, JSON-LD
- `tests/review/screenshots.spec.ts`: 빈 archive 스크린샷
- `scripts/lighthouse.mjs`: 샘플 글 상세 추가

### 새 문서

- `CONTENT_OPERATIONS_GUIDE_V1_1.txt`
- `HERMES_DEPLOYMENT_HANDOFF_V1_1.txt`
- `SECONDARY_QA_FIX_REPORT_V1_1.md`
- `TEST_REPORT_V1_1.md`

기존 보고서·운영 가이드·인계 문서는 덮어쓰지 않았습니다.

## 시각 검수

직접 확인한 새 이미지:

- 1440px 홈: 기존 에디토리얼 섹션 순서, 여백, 행형 글 목록 유지
- 1024px 홈: 모바일 메뉴 전환, 그리드 재배치 정상
- 390px 홈: 1열 카드, 본문 16px 이상, 문서 가로 overflow 없음
- 1440px 글 상세: sticky TOC 1개, 비정상 대형 공백 없음, 출처 1개
- 390px 글 상세: 접이식 TOC 1개, 표·코드 내부 스크롤, 출처·변경 이력 유지
- 검색: 입력, 상태 문구, footer까지 레이아웃 정상
- 빈 카테고리: 0건 안내, CTA, footer 정상

승인 원본 HTML/PNG가 없어 기존 구현과의 시각 연속성만 검증했으며 픽셀 단위 일치를 주장하지 않습니다.

## 주요 주장 상태

| 주장 | 판정 | 근거 |
|---|---|---|
| TOC와 출처 중복 해결 | 검증됨 | Playwright 전체 개수 및 frontmatter 대조 |
| 공개 근거 누락 차단 | 검증됨 | 단위 실패/성공 케이스 |
| 빈 tag 미생성 및 sitemap 제외 | 검증됨 | review E2E + production static test |
| 분석 전송과 PII 정제 | 검증됨 | fake gtag/dataLayer Playwright |
| JSON-LD 타입 각 1개 | 검증됨 | Playwright JSON 파싱 |
| 공식 보라색·문구 | 검증됨 | 소스·production HTML 검사 |
| WCAG 자동 검사 | 검증됨 | axe 및 Lighthouse 100 |
| 수동 접근성 완전 보장 | 조건부 | 자동 검사와 핵심 키보드 흐름만으로 모든 보조기기를 보장하지 않음 |
| Node 24 LTS 재현 | 미검증 | 로컬 Node 26.5.1, Hermes 재검증 필요 |
| 승인 원본과 픽셀 일치 | 미검증 | 승인 원본 파일 없음 |
| 재무 검증 | N/A | 재무 데이터와 계산이 없는 프런트엔드 작업 |

## 버전 및 파일 일관성

- `package.json` Astro `7.1.6` = 실제 `npx astro --version` `7.1.6`: 검증됨
- package-lock에서 `@astrojs/sitemap` 제거 및 `npm install` 동기화: 검증됨
- sample 콘텐츠 3개 모두 `sample:true`: 검증됨
- 최종 `dist/`는 production build이며 review 표식 0건: 검증됨
- 기존 V1.0 보고서와 신규 V1.1 보고서가 분리됨: 검증됨
- 공식 로고 원본 비율·파일 유지: 검증됨

## 내부 표식 및 공개 안전성

최종 production `dist/`에서 다음은 모두 0건입니다.

- `REVIEW BUILD`
- 로컬 절대 경로
- `확인 필요`
- `TODO`
- `#REF!`
- `#NAME?`
- `●L`
- 테스트용 문구
- 샘플 전용 안내
- 토큰·비밀값 패턴
- 한국 휴대전화 패턴

일반 이메일 패턴은 Pagefind가 배포하는 표준 UI 번들 안의 오픈소스 기여자 주소가 탐지됐습니다. Core Company 고객 데이터나 프로젝트 비밀값이 아니며, 사이트 콘텐츠와 검색 색인에는 포함되지 않습니다.

## 남아 있는 위험과 외부 확인

1. Hermes가 Node 24 LTS의 깨끗한 환경에서 npm 설치·빌드를 재현해야 합니다.
2. npm 12는 `esbuild@0.28.1` postinstall 차단 경고 1건을 표시했으나 현재 로컬 빌드는 성공했습니다. Hermes 환경 정책에서 재확인이 필요합니다.
3. 승인 디자인 원본 파일이 없으므로 디자인 승인자는 새 review PNG를 기준으로 최종 눈검수를 해야 합니다.
4. 승인된 자체 호스팅 글꼴 파일이 확보되면 라이선스와 파일 해시를 확인한 뒤 별도 변경으로 연결해야 합니다.
5. 외부 출처 URL의 장기 가용성과 실제 Cloudflare 응답은 배포 후 확인해야 합니다.

## Hermes 전달 사항

- 배포 대상은 최종 production `blog-app/dist/`입니다.
- `build:review` 결과를 배포하지 마십시오.
- 현재 공개 글 0, 태그 0, sitemap URL 2는 의도된 결과입니다.
- 빈 카테고리 6개는 탐색용으로 유지되며 `noindex, follow`입니다.
- 상세 절차는 `HERMES_DEPLOYMENT_HANDOFF_V1_1.txt`를 따르십시오.

## 재검증 시점

- 최초 실제 공개 글 추가 시
- 새 카테고리 또는 contentType 정책 변경 시
- 승인 WOFF2 도입 시
- Astro/Pagefind/Playwright/Lighthouse 버전 변경 시
- Hermes의 Node 24 clean install 시
- Cloudflare Pages 배포 직후

