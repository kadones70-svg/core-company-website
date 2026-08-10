---
title: "한글 파일(HWP)은 대부분의 AI가 못 읽습니다 — 준비 방법"
summary: "변환 경로 선택과 민감 문서의 외부 업로드 금지 원칙"
description: "한글(HWP) 문서를 AI가 읽도록 준비하는 변환 경로와, 계약서·개인정보 문서는 외부 서버에 올리지 않는 온프레미스 관점의 처리 원칙입니다."
category: "문서·데이터 AI"
tags:
  - "한국어 문서"
  - "HWP 처리"
  - "전처리"
contentType: "운영 가이드"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/korean-document-preprocessing/korean-document-preprocessing-v10.png"
thumbnailAlt: "한국어 사내 문서를 AI가 읽기 쉽게 준비하는 단계"
sources:
  - title: "AI가 한글파일(HWP)을 못 읽습니다 — 30초에 해결하는 방법 (cmore_dev)"
    url: "https://m.blog.naver.com/cmore_dev/224362061750"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "한글 지원 AI, HWP 문서까지 만드는 도구는? (monopro_mp)"
    url: "https://m.blog.naver.com/monopro_mp/224336935106"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — HWP 변환 경로·외부 업로드 금지·검수 원칙 적용, 제품 마케팅 수치 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "ocr-document-preparation"
  - "rag-document-cleanup"
sample: false
---

챗GPT나 클로드에 한글 파일(.hwp)을 올려 보면 "이 형식은 지원하지 않습니다"라는 답을 받습니다. 한글 파일은 한국에서만 쓰는 형식이라 대부분의 해외 AI가 기본 첨부로 지원하지 않습니다. 관공서 공문, 학교 가정통신문, 계약서 양식이 전부 이 형식인데도요.

그래서 한글 문서를 AI가 읽으려면 **변환 경로**를 정해야 합니다.

## 변환 경로 세 가지

1. **한컴오피스 수동 저장** — 다른 형식(워드·PDF)으로 저장
2. **온라인 변환 사이트** — 변환 후 다운로드 (**문서를 외부 서버에 올리는 것** — 보안 주의)
3. **로컬 처리 도구** — 파일을 업로드하지 않고 사내·로컬에서 변환 (오픈소스 방식 포함)

## 민감 문서는 외부 업로드 금지

계약서, 인사 문서, 개인정보가 포함된 한글 파일을 온라인 변환 사이트에 올리는 것은, 문서를 모르는 서버에 맡기는 것입니다. 민감 문서는 로컬·사내에서 해결하는 경로가 기본이어야 합니다.

![한국어 사내 문서를 AI가 읽기 쉽게 준비하는 단계](/blog/images/posts/korean-document-preprocessing/korean-document-preprocessing-v10.png)
*개념 이미지: HWP 문서를 변환 경로별로 준비하고 민감 문서는 외부 업로드를 피하는 처리 원칙입니다.*

## 준비 체크리스트

- HWP 지원 여부 확인 — 해외 AI는 미지원, 변환 또는 전용 도구 필요
- 변환 경로 선택 — 보안 수준에 따라 수동/온라인/로컬
- 민감문서(계약서·개인정보)는 외부 업로드 금지 원칙
- AI 생성 초안은 담당자 검수 필수

AI가 만든 문서는 어디까지나 초안입니다. 사실관계와 표현은 담당자가 책임져야 합니다.

## 전처리 전후 비교

- 변환 실패 건수
- 미정의 약어 수
- 복합표 수 — 표 구조가 유지되는가
- 시험 질문 성적 변화

한글 문서는 제목 구조·표·약어·용어집이 형식에 따라 다릅니다. AI에 넣기 전에 이 항목을 정규화하면 검색 품질이 달라집니다. 오늘 공문 하나를 변환해 AI가 읽는지 확인해 보세요. Core Company는 HWP를 포함한 한국어 문서 전처리 범위를 사내 처리 기준으로 설계해 드리겠습니다.

> 문서 변환과 개인정보 처리는 최신 법령과 사내 보안 정책을 확인해야 합니다.
