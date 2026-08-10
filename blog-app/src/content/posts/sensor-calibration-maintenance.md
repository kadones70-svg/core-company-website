---
title: "센서는 설치보다 교정과 점검이 중요합니다 — 드리프트 대응"
summary: "기준기 비교·교정·청소·배터리·통신 점검 달력"
description: "센서 값이 천천히 틀어지는 드리프트를 잡기 위해 교정 주기 산정, 성적서 검토, 내부 점검을 묶는 운영 방법입니다."
category: "자동화·IoT"
tags:
  - "센서 교정"
  - "드리프트"
  - "캘리브레이션"
contentType: "운영 가이드"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/sensor-calibration-maintenance/sensor-calibration-maintenance.png"
thumbnailAlt: "센서는 설치보다 교정과 점검이 중요하다"
sources:
  - title: "실무자를 위한 KOLAS 교정성적서 보는 법 (haiameng)"
    url: "https://m.blog.naver.com/haiameng/224310721902"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "계측기 교정 주기 어떻게 정해야 할까? (iris344)"
    url: "https://m.blog.naver.com/iris344/224306844615"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "스마트팜 양액 제어 EC/pH 센서 교정 방법 (wonsungjae77)"
    url: "https://m.blog.naver.com/wonsungjae77/224342119156"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 3건 기반 재작성 — 교정 주기 산정 체크리스트·성적서 5단계·현장 교정 적용, '법정 1년' 오해 바로잡기"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "record-problem-before-sensor"
  - "sensor-placement-data-quality"
sample: false
---

센서 값이 천천히 틀어지는 현상을 드리프트라고 합니다. 하루 차이는 작아 보여도, 몇 주가 지나면 기준값에서 벗어난 숫자를 '진짜'로 믿게 됩니다. 설치보다 **교정과 점검이** 데이터 신뢰도를 결정합니다.

## 교정 주기 산정 체크리스트

- 사용 빈도 — 자주 쓸수록 짧게
- 측정 중요도 — 최종 검사·고객 요구·공정 승인 여부
- 기기 종류 — 안정성 차이
- 사용 환경 — 고온·고습·분진·진동
- 과거 교정 이력 — 안정 시 연장, 오차 지속 시 단축
- 고객사 요구사항

**교정 주기는 법적으로 1년이 아닙니다.** 국가기술표준원 권장 주기를 기준으로 내부 품질 기준에 따라 산정합니다.

## 교정성적서 수령 후 5단계

1. 시리얼 번호·모델 100% 일치 확인
2. 실사용 구간이 교정 포인트에 포함되는지
3. 사내 최대 허용 오차 대비 판정
4. 필요 시 보정값 적용 (영점·스팬)
5. 다음 주기 라벨링

교정성적서는 합격/불합격 판정표가 아니라 오차·불확도를 객관적으로 보여주는 문서입니다. 합격 판단은 사내 허용 기준의 몫입니다.

## 드리프트 대응 절차

- 교정 전후 오차 추이 비교 — 안정성 판단
- 내부 점검 — 사용 전 영점 확인, 이상 시 즉시 사용 중지
- 교정 주기 조정 — 오차가 커지면 주기 단축

## 현장 교정 준비물

- 표준 교정액 — pH 4.01·7.00, EC 1.413 mS/cm
- 증류수, 세척 티슈, 전용 비커
- 컨트롤러 교정 메뉴

표준액은 재사용하지 않습니다. 병 원액에 센서를 직접 담그면 원액 전체가 오염됩니다.

## 점검 지표

- 편차 — 기준값 대비 벗어난 정도
- 드리프트율 — 시간당 변화량
- 결측률(%)
- 배터리 잔량
- 교정 기한초과 기기 수

![교정 주기·기준값·배터리·통신·오염·드리프트를 함께 관리하는 센서 점검 도식](/blog/images/posts/sensor-calibration-maintenance/sensor-calibration-maintenance.png)
*개념 이미지: 센서값 하나가 아니라 기준기 비교와 장치 상태를 함께 확인하는 예방 점검 항목입니다.*

오늘 센서의 마지막 교정일을 확인해 보세요. Core Company는 교정 달력과 성적서 검토 절차를 설계해 드리겠습니다.
