---
title: "스캔 PDF를 그냥 넣으면 검색이 안 됩니다 — OCR 준비 순서"
summary: "스캔 품질 점검 → OCR → 검수 → 저장의 전처리 절차"
description: "이미지 PDF는 검색이 불가능합니다. 스캔 품질 점검, OCR 적용, 텍스트 검수, 저장까지의 전처리 절차와 RAG 연계 포인트를 정리합니다."
category: "문서·데이터 AI"
tags:
  - "OCR"
  - "스캔 문서"
  - "전처리"
contentType: "운영 가이드"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/ocr-document-preparation/ocr-document-preparation.png"
thumbnailAlt: "스캔 PDF와 이미지 문서를 검색 가능하게 만드는 준비 단계"
sources:
  - title: "책스캔으로 OCR 가능 PDF 파일 만드는 방법 (dolldolle)"
    url: "https://m.blog.naver.com/dolldolle/224025742332"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "OCR 스캔 한글 이용법 (room8000)"
    url: "https://m.blog.naver.com/room8000/223629574302"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — OCR 절차 체크리스트·이미지 품질 요인·저작권 주의 적용, 상용 제품 단정 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "rag-document-cleanup"
  - "semantic-document-chunking"
sample: false
---

계약서를 스캔해서 폴더에 넣었는데, 검색해도 나오지 않습니다. 스캔만 한 PDF는 **이미지**라서 글자 검색이 불가능하기 때문입니다. 문서 검색 AI에 넣기 전에 OCR(문자 인식) 작업이 필요합니다.

## OCR 문서화 절차

1. **원본 스캔** — 플랫베드(고화질) 또는 ADF(대량·고속, 재단 필요), 스마트폰 촬영은 각도·왜곡 보정 앱 사용
2. **이미지 품질 점검** — 명도·대비, 기울기 보정, 단순 레이아웃, 표준 글꼴
3. **OCR 적용** — 이미지 속 텍스트를 검색 가능한 텍스트로 변환
4. **검수** — 텍스트 박스 수정, 맞춤법 검사, 복수 변환 비교
5. **저장** — 검색 가능 PDF로 저장, 파일명 직관화·중앙 저장·백업
6. **저작권 확인** — 개인소장용·업무용 한정

![스캔 PDF와 이미지 문서를 검색 가능하게 만드는 준비 단계](/blog/images/posts/ocr-document-preparation/ocr-document-preparation.png)
*개념 이미지: 스캔 → 품질 점검 → OCR → 검수 → 저장으로 이어지는 전처리 순서입니다.*

## 인식률을 높이는 요인

- **이미지 품질이 가장 큰 요인** — 해상도·대비·기울기·레이아웃
- 텍스트 레이어가 있는 디지털 PDF는 별도 인식 없이 텍스트 추출 가능
- 표·다단 레이아웃은 OCR 이후에도 구조 복원이 필요

## RAG 연계 포인트

스캔 문서(이미지 PDF)는 OCR 전처리가 필수입니다. 표는 셀 나열이 아니라 **각 값이 어떤 행·열 헤더에 속하는지 연결**해서 직렬화해야 검색 품질이 나옵니다. 전처리 단계의 작은 오류는 검색·생성으로 갈수록 증폭됩니다.

## 샘플 검수로 품질을 확인합니다

10~20장 표본을 골라 다음을 확인합니다.

- 표본 문자 오류율(%) = 오인식 문자 수 ÷ 표본 전체 문자 수 × 100
- 페이지당 수정시간
- 검색 성공 건수 — 원문 단어로 검색이 되는가

기울어진 문서, 대비가 낮은 문서, 복잡한 표가 있는 문서를 표본에 포함해야 실제 품질이 드러납니다. 오늘 스캔 문서 한 장을 검색해 보세요. Core Company는 표본 검수부터 OCR 전처리 범위까지 설계해 드리겠습니다.

> 문서 스캔·복제는 저작권과 개인정보 보호 기준을 확인하고, 업무용 범위에서 진행해야 합니다.
