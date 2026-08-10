---
title: "게스트 Wi-Fi와 CCTV·도어락을 같은 망에 두면 안 되는 이유"
summary: "게스트망·운영망·IoT 구간을 분리하는 네트워크 경계"
description: "펜션의 게스트 Wi-Fi, 운영 장비(PMS·키오스크), IoT 장비(CCTV·도어락)를 어떤 기준으로 분리하고 점검할지 정리한 네트워크 경계 가이드입니다."
category: "숙박·민박 운영"
tags:
  - "게스트 Wi-Fi"
  - "망 분리"
  - "CCTV"
  - "도어락"
contentType: "운영 가이드"
author: "Core Company"
reviewer: "기술 책임자 검토 대기"
publishedAt: "2026-08-10"
updatedAt: "2026-08-10"
draft: false
featured: false
thumbnail: "/blog/images/posts/pension-network-security-boundaries/pension-network-security-boundaries.png"
thumbnailAlt: "펜션 게스트·운영·IoT 네트워크 구역을 분리하는 경계 점검 항목"
sources:
  - title: "공항 와이파이 보안 경보 — 휴가지 개인정보 보호 7가지 수칙 (serioso27)"
    url: "https://m.blog.naver.com/serioso27/224357284960"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
  - title: "호텔 공항 와이파이 보안 안전하게 쓰는 법 (parkbeom)"
    url: "https://m.blog.naver.com/parkbeom/224342013609"
    checkedAt: "2026-08-10"
    type: "네이버 블로그"
changeLog:
  - date: "2026-08-10"
    description: "V11: 네이버 블로그 리서치 2건 기반 재작성 — 네트워크 3구역 분리·게스트 보안 수칙·CCTV 고지 적용, 보안업체 홍보 문구 제거"
    reviewer: "기술 책임자"
aiDisclosure: "초안의 구조와 문장 정리에 AI 보조를 사용했으며, 공개 전 기술 책임자가 사실·적용 조건·연락 수단을 검토해야 합니다."
relatedPosts:
  - "door-lock-code-lifecycle"
  - "unmanned-emergency-contact-flow"
sample: false
---

게스트에게 `Pension_Guest` Wi-Fi를 알려줬다고 해서, 게스트 기기가 키오스크나 도어락 관리 화면에 접근하지 못하는 것은 아닙니다. SSID 이름만 다를 뿐 **같은 네트워크**라면, 게스트 기기에서 내부 장비가 보일 수 있습니다.

펜션 네트워크는 세 구역으로 나눕니다.

## 세 개의 네트워크 구역

1. **게스트망** — 투숙객 기기, 인터넷만 통과하고 내부망 차단
2. **운영망** — 키오스크·PMS·정산 장비, 관리자만 접근
3. **IoT 구역** — CCTV·도어락, 별도 VLAN으로 분리

![펜션 게스트·운영·IoT 네트워크 구역을 분리하는 경계 점검 항목](/blog/images/posts/pension-network-security-boundaries/pension-network-security-boundaries.png)
*개념 이미지: 게스트 Wi-Fi와 운영 장비, CCTV·도어락이 서로 다른 통신 구역에 있어야 하는 구조입니다.*

## 게스트 Wi-Fi 운영 체크리스트

- 정확한 SSID·비밀번호를 안내문에 명시 — 가짜 AP(비슷한 이름의 위장 네트워크) 혼동 방지
- WPA2 이상 보안 프로토콜 적용
- 자동 연결을 권장하지 않음
- 사용 이력 저장 최소화

## CCTV 운영 체크리스트

- 촬영 범위·이유·관리책임자를 안내판에 고지
- 음성·안면 정보 수집 금지 (불가피할 시 동의·비식별 처리)
- 저장 기간·접근 권한·접속 로그 보관 정책 명문화
- 객실 내부 촬영 절대 금지

## 도어락·출입 체계

- PMS·키오스크와 연동
- 게스트 일회성 권한 / 직원·외주 구역별 권한 / 임시 권한은 유효시간 설정
- 출입 이력 보관

![파란 실선은 허용, 빨간 점선은 차단한 펜션 네트워크 구역도](/blog/images/posts/pension-network-security-boundaries/pension-network-four-zones-v10-v2.png)
*개념 이미지: 게스트·운영·IoT·외부망 사이의 허용·차단 경로를 표시한 구역도입니다.*

## 게스트에게 알려 줄 보안 수칙 7가지

1. 예약 문자 속 링크를 직접 열지 않기 — 숙소명·투숙일을 활용한 스미싱 증가
2. 공공 와이파이에서 금융거래·카드 결제 피하기 (셀룰러 데이터 사용)
3. 스마트TV 로그아웃 안내 — 미로그아웃 시 다음 투숙객이 계정 접근 가능
4. 공용 PC는 저장 비밀번호·쿠키·캐시 삭제
5. 자동 와이파이 연결 해제
6. 가짜 와이파이(비슷한 이름) 주의
7. 퇴실 후 낯선 로그인 기록 확인·비밀번호 변경

## 분기별 점검 지표

- 등록 기기 비율 — 승인된 장비만 운영망 접속
- 구역 간 허용 규칙 수
- 미승인 접속 시도 건수
- 업데이트 준수율 — 도어락·공유기 펌웨어

분리의 핵심은 '이름'이 아니라 '실제 통신 경계'입니다. 오늘 게스트 Wi-Fi에 접속한 테스트 기기에서 키오스크 관리 화면이 보이는지 확인해 보세요. Core Company는 결과와 장비 목록을 바탕으로 가장 작은 분리 범위를 설계해 드리겠습니다.

> CCTV 촬영·개인정보 처리와 안내판 고지 사항은 최신 개인정보보호법령을 확인해야 합니다.
