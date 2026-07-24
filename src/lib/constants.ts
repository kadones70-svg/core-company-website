export const COMPANY_INFO = {
  name: "Core Company",
  domain: "corecompany.net",
  tagline: "온프레미스 AI, 공간에 심다",
  taglineEn: "On-Premise AI, Rooted in Space",
  mission: "온프레미스 AI로 기업의 데이터 주권을 회복한다",
  productName: "OnPress OS™",
  productDesc: "온프레미스 sLLM 운영체제 — 토큰비용 0원·데이터 주권 100%·완전 폐쇄망 구동",
  location: "대한민국 광주 (본사)",
  email: "contact@corecompany.net",
  blog: "blog.naver.com/corecompany0607",
  established: "2026",
  coreValues: ["데이터 주권", "기술 독립", "고객 현장 중심"],
};

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  { label: "Customers", href: "/customers" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/company" },
];

export interface SolutionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  tags: string[];
  features: string[];
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: "smart-factory",
    title: "스마트팩토리 (제조)",
    subtitle: "초저지연 설비 제어 및 온프레미스 시각 검사",
    description: "제조 공정 내 센서 데이터와 CCTV 분석을 외부 클라우드 없이 현장 서버에서 실시간 처리합니다.",
    iconName: "Factory",
    tags: ["ONVIF", "Modbus", "MQTT", "초저지연"],
    features: ["불량품 자동 감지 (정확도 99.8%)", "설비 예지보전 AI 모델", "망분리 공장 완벽 호환"]
  },
  {
    id: "defense",
    title: "디펜스 (국방)",
    subtitle: "완전 폐쇄망 보안 sLLM 및 감시 체계",
    description: "국방 보안 규격을 충족하는 AES-256 암호화 기반 온프레미스 의사결정 지원 시스템입니다.",
    iconName: "Shield",
    tags: ["망분리", "AES-256", "완전 0Byte 외부전송"],
    features: ["외부 망 연결 불필요 독립 가동", "전술 지형 및 문서 보안 sLLM", "24/7 무중단 장애 복구"]
  },
  {
    id: "healthcare",
    title: "헬스케어 (의료)",
    subtitle: "환자 개인정보 100% 암호화 및 EMR 연동",
    description: "의료 데이터 및 임상 기록 유출 걱정 없이 사내 전용 sLLM으로 보건 의료 데이터를 분석합니다.",
    iconName: "Activity",
    tags: ["개인정보 보호", "HL7/FHIR", "EMR 연동"],
    features: ["의료 문서 자동 요약 sLLM", "원내 폐쇄망 인프라 구축", "컴플라이언스 100% 준수"]
  },
  {
    id: "smart-building",
    title: "스마트빌딩",
    subtitle: "에너지 최적화 및 빌딩 통합 관제",
    description: "CCTV RTSP 및 출입통제 RFID 데이터를 실시간 수집하여 빌딩 전력 소비를 최적화합니다.",
    iconName: "Building2",
    tags: ["RTSP", "RFID", "에너지 절감"],
    features: ["지능형 출입 관리 및 통합 센서", "냉난방 자동 조절 AI", "이상 징후 즉시 경보"]
  },
  {
    id: "smart-farm",
    title: "스마트팜",
    subtitle: "온프레미스 생육 환경 분석 & 자동 제어",
    description: "인터넷 연결이 원활하지 않은 오지 현장에서도 오프라인 독립 서버로 생육 환경을 자동 조절합니다.",
    iconName: "Sprout",
    tags: ["오프라인 서버", "IoT 제어", "농가 맞춤형"],
    features: ["온습도/일조량 분석 AI", "자동 관수/영양 공급 제어", "네트워크 단절 시에도 100% 가동"]
  },
  {
    id: "smart-home",
    title: "스마트홈",
    subtitle: "프라이버시 보장 가정용 지능형 제어 서버",
    description: "가정 내 카메라 및 스마트 디바이스 데이터를 외부 서버로 전송하지 않고 집 안의 독립 노드에서 제어합니다.",
    iconName: "Home",
    tags: ["프라이버시 100%", "사설 IoT", "음성/비전 AI"],
    features: ["세대 전용 오프라인 AI 가전 연동", "가족 개인정보 사외 유출 Zero", "초저전력 스마트홈 허브"]
  }
];

export interface CustomerCase {
  id: string;
  industry: string;
  companyName: string;
  iconName: string;
  problem: string;
  solution: string;
  roi: string;
  quote: string;
  badgeColor: "amber" | "green" | "teal";
}

export const CUSTOMER_CASES: CustomerCase[] = [
  {
    id: "case-1",
    industry: "중견 자동차부품 제조사",
    companyName: "A사 (제조)",
    iconName: "Car",
    problem: "클라우드 AI 도입 시 기밀 공정 도면 및 QC 데이터 유출 우려로 도입 지연",
    solution: "OnPress OS™ 13B 온프레미스 구축 및 ONVIF CCTV 네비게이션 연동",
    roi: "처리 속도 40% 향상, 보안 사고 0건, 토큰 비용 0원 달성",
    quote: "보안 문제로 클라우드 AI 도입을 주저하던 공정에 OnPress OS™를 적용하여 불량 감지 속도를 40% 이상 단축했습니다.",
    badgeColor: "amber"
  },
  {
    id: "case-2",
    industry: "방위산업 솔루션 기관",
    companyName: "B기관 (국방)",
    iconName: "ShieldAlert",
    problem: "외부 인터넷 연결이 불가능한 1급 군사 보안 폐쇄망 구동 필요",
    solution: "완전 망분리 환경 내 OnPress OS™ 패킷 차단 가동 및 AES-256 데이터 암호화",
    roi: "문서 분석 지연시간 수십 시간 → 0초 단축",
    quote: "외부망 데이터 송신 0바이트를 입증받아 1급 보안 구역에서 안전하게 운영되고 있습니다.",
    badgeColor: "green"
  },
  {
    id: "case-3",
    industry: "종합 의료 재단",
    companyName: "C병원 (헬스케어)",
    iconName: "Stethoscope",
    problem: "환자 진료 기록 분석 시 클라우드 API 과금 가중 및 환자 정보 유출 위협",
    solution: "원내 EMR 서버 직결 sLLM 가동 및 7B 파라미터 경량 모델 도입",
    roi: "연간 API 토큰 과금 1.8억원 절감 (TCO 70% 감소)",
    quote: "환자 개인정보 보호 규정을 100% 준수하면서 의사들의 차트 작성 시간을 절반 이하로 줄였습니다.",
    badgeColor: "teal"
  }
];

export const TECHNICAL_SPECS = [
  {
    category: "sLLM 엔진",
    title: "7B ~ 13B 최적화 모델",
    description: "한국어 및 산업 특화 데이터셋에 고도로 튜닝된 경량 sLLM. 고가의 GPU 서버 없이 일반 CPU 서버에서도 초저지연 구동.",
    monoDetails: ["7B-13B Parameters", "CPU-Only Supported", "0 Token Fee"],
    iconName: "Cpu"
  },
  {
    category: "연동 프로토콜",
    title: "레거시 인프라 네이티브 지원",
    description: "기존 현장 설비를 교체할 필요 없이 ONVIF, RTSP, MQTT, Modbus, RFID 및 NAS(SMB/NFS)와 즉각 API 연동.",
    monoDetails: ["ONVIF / RTSP", "MQTT / Modbus", "RFID & NAS"],
    iconName: "Cable"
  },
  {
    category: "보안 아키텍처",
    title: "완전 폐쇄망 & AES-256",
    description: "외부 클라우드 연결 0바이트. 사내 물리 망분리 구동 및 저장/전송 구간 AES-256 엔드투엔드 암호화.",
    monoDetails: ["100% Data Sovereignty", "AES-256 Encrpytion", "0 Byte Egress"],
    iconName: "Lock"
  }
];

export const RESOURCES_LIST = [
  {
    id: "res-1",
    title: "OnPress OS™ 보안 및 망분리 아키텍처 백서",
    type: "기술 백서 (PDF)",
    size: "4.2 MB",
    description: "외부망 데이터 전송 0바이트를 증명하는 온프레미스 sLLM 보안 설계 명세서"
  },
  {
    id: "res-2",
    title: "제조 현장 ONVIF/Modbus 프로토콜 연동 가이드",
    type: "개발자 가이드",
    size: "2.8 MB",
    description: "기존 CCTV 및 IoT 센서를 OnPress OS와 10분 만에 네이티브 연동하는 API 매뉴얼"
  },
  {
    id: "res-3",
    title: "3년 TCO 비교 계산 및 ROI 검증 보고서",
    type: "비즈니스 리포트",
    size: "1.9 MB",
    description: "클라우드 종량제 API 대비 OnPress OS™ 도입 시 연간 비용 절감 시뮬레이션"
  }
];

export const FAQS = [
  {
    id: "1",
    question: "OnPress OS™는 정말로 GPU 없이 구동 가능한가요?",
    answer: "네, 7B~13B 파라미터 최적화 경량화 및 양자화(Quantization) 기술이 적용되어 일반 엔터프라이즈 CPU 서버 환경에서도 높은 성능으로 즉시 가동됩니다."
  },
  {
    id: "2",
    question: "기존 클라우드 LLM(GPT-4 등)과 비교했을 때 차이점은 무엇인가요?",
    answer: "클라우드 LLM은 질문당 토큰 비용이 발생하고 사내 기밀 데이터가 외부 서버로 전송됩니다. 반면 OnPress OS™는 사내 서버 내 완전 폐쇄망에서 0원의 토큰 비용과 100% 데이터 주권을 제공합니다."
  },
  {
    id: "3",
    question: "PoC(개념 검증) 진행 절차와 소요 기간은 어떻게 되나요?",
    answer: "사전 인프라 미팅 후 1~2주일 이내 현장 테스트용 온프레미스 노드를 세팅하고, 고객사의 샘플 데이터로 성능 및 호환성을 직접 검증해 드립니다."
  }
];
