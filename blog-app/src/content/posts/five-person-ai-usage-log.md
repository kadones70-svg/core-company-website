---
title: "5인 사무실 AI 사용량, 2~4주 일지로 측정하는 방법"
summary: "사용자·업무·요청·토큰·피크를 실제 로그로 수집하기"
description: "AI 도입 비용을 예측하기 전에, 5명이 2~4주 동안 사용자·업무·요청·토큰·피크를 기록하는 사용량 일지를 설계하는 방법입니다."
category: "AI 도입·비용"
tags:
  - "AI 사용량"
  - "토큰 측정"
  - "사용 일지"
contentType: "기술 해설"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/five-person-ai-usage-log/five-person-ai-usage-log.png"
thumbnailAlt: "5명이 2~4주 작성하는 AI 사용량 일지 항목"
sources:
  - title: "AI 토큰 이코노미란? (iotspace)"
    url: "https://m.blog.naver.com/iotspace/224369589543"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "Enterprise AI Operating System — AI Gateway는 왜 토큰만 관리하면 안 되는가 (zenbytes)"
    url: "https://m.blog.naver.com/zenbytes/224364340291"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — Usage/Outcome 대비 프레임·측정 체계 요소 적용, 가상 절감 수치 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "ai-cost-components"
  - "verify-ai-roi-calculation"
sample: false
---

"우리 회사는 AI를 얼마나 쓸까요?"라는 질문에 추측으로 답하면, 구독료·토큰비 예산이 틀어집니다. 5명이 2~4주만 기록해도 예측의 정확도가 달라집니다.

## 사용량 일지 항목

- **사용자** — 누가 썼는가
- **업무** — 어떤 업무에 썼는가
- **요청** — 하루 몇 건인가
- **토큰** — 입력·출력 토큰량
- **피크** — 동시 요청이 몰리는 시간대

## Usage와 Outcome을 구분합니다

| 사용 지표 (Usage) | 성과 지표 (Outcome) |
|---|---|
| 사용자 수 | 리드타임(처리 시간) |
| 모델별 호출 | 장애 대응 시간 |
| 토큰 사용량 | 릴리즈 주기 |
| 비용 | 업무 결과 품질 |

토큰 사용량을 알아도 AI의 가치(Outcome)는 알 수 없습니다. 측정은 비용 관리가 아니라 **가치 증명을 위해** 합니다.

## 제본스의 역설

단가가 크게 내려가도 총 소비·지출은 늘 수 있습니다. AI가 저렴해질수록 더 많이 쓰게 되고, 총지출은 오히려 증가할 수 있습니다.

## 에이전트 스프롤 경고

부서별로 AI 에이전트를 무분별하게 만들면 관리가 어려워집니다. 중앙 예산 한도와 사용량 알림 체계가 필요합니다.

## 2~4주 일지 작성 규칙

- 매일 업무 종료 시 3분 기록
- 토큰은 도구가 자동 집계하는 부분 활용
- 피크 시간대는 요청 시각으로 파악

## 월 환산과 검토

- 사용자별 건수
- 업무별 토큰
- 피크 동시요청
- 월 환산량 = 일 평균 × 근무일

오늘부터 5명이 쓰는 AI 요청을 일지에 기록해 보세요. Core Company는 2주 일지를 월 비용 예측으로 환산하고, Outcome 지표 연결까지 설계해 드리겠습니다.

![사용자와 업무별 요청·토큰을 2~4주 모아 예산과 도구 선택으로 연결하는 기록 흐름](/blog/images/posts/five-person-ai-usage-log/five-person-ai-usage-log.png)
*개념 이미지: 사용자별 요청을 업무 유형과 토큰으로 묶어 2~4주 집계하고 계절 변동까지 예산에 반영하는 흐름입니다.*
