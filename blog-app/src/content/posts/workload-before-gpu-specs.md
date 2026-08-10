---
title: "GPU 사양을 고르기 전에, 업무 조건부터 확정하세요"
summary: "모델·문서량·동시성·응답시간·전기·냉각을 먼저 정하기"
description: "GPU 서버를 고르기 전에 정해야 할 업무 요구사항(모델 크기·문서량·동시성·응답시간)과 전력·냉각·랙 준비를 설명합니다."
category: "AI 도입·비용"
tags:
  - "GPU 서버"
  - "요구사항"
  - "전력 설계"
contentType: "도입 가이드"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/workload-before-gpu-specs/workload-before-gpu-specs.png"
thumbnailAlt: "GPU 사양보다 먼저 정해야 할 업무 조건 항목"
sources:
  - title: "NVIDIA GPU 서버, 기존 서버실에 설치할 수 있을까? — 전력·냉각·랙 (bninc3355)"
    url: "https://m.blog.naver.com/bninc3355/224370003708"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "AI 서버 구축, GPU 서버부터 AI까지 한 번에 해결하는 방법 (nicehosting)"
    url: "https://m.blog.naver.com/nicehosting/224270338237"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — 요구사항 우선 원칙·전력·냉각·랙 체크리스트 적용, 추정 수치·제품 광고 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "cloud-vs-onprem-questions"
  - "hidden-ai-operation-costs"
sample: false
---

"GPU는 뭐 사면 되죠?"라는 질문으로 시작하면, 사양표만 비교하다가 정작 필요한 용량을 놓칩니다. GPU는 **업무 요구사항이 확정된 뒤에** 고릅니다.

## 먼저 확정할 다섯 가지

1. **모델** — 어떤 모델을 돌릴 것인가 (파라미터 수·양자화 여부)
2. **문서량** — RAG라면 색인할 문서의 크기
3. **동시성** — 동시에 몇 명이 쓸 것인가
4. **응답시간** — 허용 가능한 응답 지연 (p95 기준)
5. **전기·냉각** — 설치 공간의 전력과 열처리 능력

## 고성능 GPU 서버가 쓰는 전력

고성능 GPU 서버 한 대는 전력과 냉각이 상상을 초과합니다. 예를 들어 NVIDIA DGX B200은 최대 전력 14.3kW 수준이고, DGX B300은 15kW 수준으로 공식 문서에 명시되어 있습니다(해당 모델 한정 수치). 일반 서버실 콘센트 하나로는 부족하며, 전용 전원·냉각 설계가 필요합니다.

## 구축 전 체크리스트 12개

- **전력** — 최대 전력, 입력전압, PSU, PDU, A/B 경로
- **냉각** — 열배출, 공기흐름, 핫/콜드아일, 블랭킹 패널
- **랙** — 깊이·하중·레일
- **반입** — 출입문·엘리베이터·리프트
- **운영** — BMC·모니터링

## 설계 원칙 두 가지

- **평균 전력이 아니라 최대 부하로 설계** — 이중화 조건 포함
- **이중 PSU ≠ 이중 전원 경로** — 서버에 PSU가 두 개여도 전원 공급 경로(A/B)가 분리되지 않으면 무의미

공랭·액체 냉각은 제품의 공식 구성에 따라 결정되며 임의로 선택할 수 없습니다.

![GPU 사양보다 먼저 정해야 할 업무 조건 항목](/blog/images/posts/workload-before-gpu-specs/workload-before-gpu-specs.png)
*개념 이미지: 모델·문서량·동시성·응답시간을 확정한 뒤 전력·냉각·랙을 검토하는 순서입니다.*

## 사양 검토 지표

- 피크 동시요청
- 입력/출력 토큰
- 메모리 요구량
- p95 응답시간
- 전력 요구량

오늘 '무엇을, 몇 명이, 얼마나 빨리' 쓰는지 한 장으로 정리해 보세요. Core Company는 그 조건으로 GPU 용량과 전력·냉각 요구사항을 산정해 드리겠습니다.

> GPU 서버 설치와 전기 작업은 안전 규정과 건물 전력 기준을 확인한 전문가 범위에서 진행해야 합니다.
