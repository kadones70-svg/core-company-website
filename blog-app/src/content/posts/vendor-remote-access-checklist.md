---
title: "외부업체 2시간 작업권한 — 목적·대상·시간을 제한한 1회성 접근"
summary: "사전 승인·개인별 계정·세션 기록·종료 즉시 회수"
description: "유지보수·구축 외부업체의 원격 접속을 목적·대상·시간으로 제한하고, 세션을 기록하고 종료 즉시 권한을 회수하는 체크리스트입니다."
category: "AI 인프라·보안"
tags:
  - "원격 접속"
  - "외부업체"
  - "접근 통제"
contentType: "체크리스트"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/vendor-remote-access-checklist/vendor-remote-access-checklist.png"
thumbnailAlt: "외부 업체의 원격 접속을 허용하기 전 체크리스트"
sources:
  - title: "외부 유지보수 업체 원격접속을 관리하기 위한 원격지원 프로그램 감사 기준 (getscreenme)"
    url: "https://m.blog.naver.com/getscreenme/224348162619"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "N2SF 보안체계 — CSO 등급, 적용 절차, 원격접속 통제 (ahranta1)"
    url: "https://m.blog.naver.com/ahranta1/224242843084"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — 원격 접속 통제 3단계 체크리스트·데이터 분류 적용, 점유율·벤더 주장 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "admin-account-lifecycle"
  - "safe-ai-update-process"
sample: false
---

GPU 서버를 점검하러 온 외부업체 기사가 "원격으로 작업할게요"라고 합니다. 이때 '아무 때나, 아무 계정으로, 아무 화면에서' 접속하게 두면, 사고가 났을 때 누가 무엇을 했는지 알 수 없습니다.

외부업체 접속은 **목적·대상·시간을 제한한 1회성 권한**으로 처리합니다.

## 접속 전 체크리스트

- 용역 계약·보안서약서
- 작업일지 등록
- 담당자 사전 승인
- 접속 대상·시간 지정

## 접속 중 체크리스트

- 개인별 계정 사용 (공유 금지)
- 최소 권한 — 필요한 화면만
- 파일 송수신·캡처·클립보드·인쇄 통제
- 워터마크 표시
- 작업 시간 초과 시 자동 차단

## 접속 후 체크리스트

- 세션 녹화·접속 이력 보존
- 정기 감사·책임 소재 확인
- 권한 즉시 회수

## 데이터 분류로 접근을 차등

N2SF(국가 망 보안체계) 방식처럼 데이터를 등급으로 나눕니다.

- **C(기밀)** — 핵심 기술·영업 비밀 → 접근 제한 + 암호화
- **S(민감)** — 개인정보·내부 문서 → 승인 필요
- **O(공개)** — 공개 자료 → 자유 접근

## 측정 지표

- 승인 없는 접속 건수
- 세션 시간 — 허용 시간을 초과한 세션
- 로그 누락 건수
- 권한 회수 지연 — 작업 종료 후 권한이 살아 있던 시간

![원격 접속 목적·기간·승인·인증·작업 로그·권한 회수·정기 검토 도식](/blog/images/posts/vendor-remote-access-checklist/vendor-remote-access-checklist.png)
*개념 이미지: 외부 작업자가 들어오기 전부터 계정과 기록을 닫을 때까지의 일회용 출입 절차입니다.*

오늘 외부업체 접속 절차를 세 단계(전·중·후)로 정리해 보세요. Core Company는 1회성 권한 발급과 세션 기록, 즉시 회수를 묶은 체크리스트를 설계해 드리겠습니다.
