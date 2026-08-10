---
title: "같은 센서를 세 위치에 놓으면 현장이 다르게 말합니다"
summary: "열원·문·진동·높이 영향을 2주간 비교해 대표 지점 고르기"
description: "같은 센서를 세 위치에 임시 설치해 열원·바람·동선 영향을 2주간 비교하고 대표 지점을 고르는 현장 실험입니다."
category: "자동화·IoT"
tags:
  - "센서 배치"
  - "데이터 품질"
  - "결측률"
  - "현장 실험"
contentType: "운영 가이드"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/sensor-placement-data-quality/sensor-placement-data-quality.png"
thumbnailAlt: "대표 지점·열원·고정 방식·동선·설치 방향·기준 데이터·이상값 원인을 점검하는 도식"
sources:
  - title: "센서등, 설치 위치에 따라 작동이 영 다르더라고요 (top_electric)"
    url: "https://m.blog.naver.com/top_electric/224322679904"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "화장실 스마트 센서의 설치 위치 (0cgaaeydtuak)"
    url: "https://m.blog.naver.com/0cgaaeydtuak/223633123233"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — 세 위치 실험·품질 지표 적용, 업체명·법령 미검증 인용 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "record-problem-before-sensor"
  - "wired-vs-wireless-sensors"
sample: false
---

같은 온도 센서 세 개를 창가, 에어컨 바람 아래, 작업대 가운데에 놓으면 서로 다른 현장을 말합니다. 어느 값이 '진짜'인지 묻기 전에, 어떤 위치가 측정하려는 조건을 대표하는지 확인해야 합니다.

## 세 위치 비교 실험 설계

- **위치 A** — 열원 근처 (예: 창가)
- **위치 B** — 바람·기류 영향 지역 (예: 에어컨 아래)
- **위치 C** — 대표 후보 지점 (예: 작업대 중앙)

같은 센서 3개를 같은 설정으로 2주간 동시 측정합니다.

## 기록할 조건

- 열원과의 거리
- 문·창문 개폐 동선
- 진동·고정 방식
- 설치 높이와 방향
- 업무 시간대 (사람이 다니는 시간)

## 비교할 지표

- 위치별 평균·범위
- 결측률(%) = 값이 없는 구간 ÷ 전체 측정 구간 × 100
- 스파이크 수 — 갑자기 튀는 값
- 2주 안정성 — 시간에 따른 편차

## 오작동 트러블슈팅 순서

제품 불량을 의심하기 전에 **설치 위치·각도·환경부터 점검**합니다. 동작 감지 센서의 경우 바람이나 급격한 온도 변화만으로도 원하지 않을 때 작동할 수 있습니다. 감지 각도·거리는 제품 스펙에 따라 다르므로, 설치 높이와 장애물(가림)을 함께 확인합니다.

## 대표 지점 판정 기준

- 결측·스파이크가 적은 위치
- 측정하려는 조건을 실제로 대표하는 위치
- 유지보수·교체가 쉬운 위치

같은 센서 세 개를 이번 주에 놓아 보세요. Core Company는 2주 비교 데이터를 기준으로 대표 지점과 품질 지표를 판정해 드리겠습니다.

![열원·바람·동선과 기준 데이터를 함께 확인하는 센서 배치 실험 도식](/blog/images/posts/sensor-placement-data-quality/sensor-placement-data-quality.png)
*개념 이미지: 대표 지점을 고르기 전에 열원·고정 방식·사람 동선·설치 방향·기준 데이터를 차례로 확인하는 실험 지도입니다.*
