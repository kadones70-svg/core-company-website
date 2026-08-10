---
title: "AI 답변에 근거 문서가 없다면, 그 답변은 검증할 수 없는 말입니다"
summary: "문서명·문단·링크와 '근거 없음' 상태를 함께 보여주기"
description: "AI 답변에서 근거를 표시하고, 근거가 없을 때 그 사실을 명시하며, 답변에서 원문으로 되돌아가는 검증 동선을 만드는 방법입니다."
category: "문서·데이터 AI"
tags:
  - "AI 근거"
  - "출처 표시"
  - "답변 검증"
contentType: "운영 가이드"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/ai-answer-source-citations/ai-answer-source-citations-v10.png"
thumbnailAlt: "AI 답변에서 문서명·문단·링크로 근거를 추적하는 검증 동선"
sources:
  - title: "[AI Shift 11] RAG란 무엇인가 (valuemade_kr)"
    url: "https://m.blog.naver.com/valuemade_kr/224368808010"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "LLM Wiki란? RAG 다음을 노리는 AI 지식 구조 3계층 (eggcode)"
    url: "https://m.blog.naver.com/eggcode/224363707328"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — 근거 표시·원문 추적·근거 없음 상태 적용, 벤더 데이터·무출처 수치 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "rag-source-permissions"
  - "rag-evaluation-questions"
sample: false
---

AI가 "올해 연차는 15일입니다"라고 답했을 때, 그 숫자가 어느 문서에서 나왔는지 모른다면 검증할 방법이 없습니다. 근거 없는 답변은 전문가의 말처럼 들리지만, 확인할 수 없는 말입니다.

RAG 답변은 세 가지 오류가 가능합니다. 오래된 문서를 검색하거나, 관련 없는 자료를 선택하거나, 내용을 잘못 해석하는 경우입니다. 그래서 근거 표시는 선택이 아니라 필수입니다.

## 근거 표시의 세 단계

1. **문서명** — 답변의 근거가 된 문서 제목
2. **문단·링크** — 어느 부분을 근거로 썼는지 원문으로 연결
3. **근거 없음 상태** — 근거를 찾지 못하면 '근거 없음'을 명시하고 답하지 않기

![AI 답변에서 문서명·문단·링크로 근거를 추적하는 검증 동선](/blog/images/posts/ai-answer-source-citations/ai-answer-source-citations-v10.png)
*개념 이미지: 답변 → 근거 문서 → 원문 문단으로 되돌아가는 검증 경로를 보여 주는 도식입니다.*

## 검증 동선: 답변에서 원문까지

- 답변의 인용 표시율(%) = 근거가 표시된 답변 수 ÷ 전체 답변 수 × 100
- 원문 확인 클릭 수 — 사용자가 실제로 문서를 열어본 횟수
- 근거 불일치 건수 — 인용한 문서에 답이 없는 경우
- 검증시간 = 답변에서 원문 확인까지 걸린 시간

## '근거 없음'을 말할 수 있어야 신뢰합니다

문서에 답이 없는 질문에 AI가 그럴듯한 답을 지어내는 대신, '문서에서 근거를 찾지 못했습니다'라고 말해야 합니다. 이 동작은 검색 결과가 비었을 때 답변을 생성하지 않는 규칙으로 구현합니다.

RAG는 대화가 끝나면 정리된 내용이 남지 않는 무상태 방식입니다. 오래 쌓여야 하는 지식은 위키 형태로, 지금 바뀌는 정보는 RAG로 — 두 구조는 대체가 아니라 보완 관계입니다.

## 점검 지표

- 출처 표시율(%)
- 근거 불일치 건수
- '근거 없음' 처리 건수 — 문서에 답이 없는 질문
- 검증시간 중앙값

오늘 AI에게 회사 규정 한 가지를 물어보고, 답변이 어느 문서에서 나왔는지 따라가 보세요. Core Company는 답변에서 원문까지 되돌아가는 검증 동선을 설계해 드리겠습니다.

> AI 답변의 근거와 개인정보 처리는 최신 법령과 사내 정책을 확인해야 합니다.
