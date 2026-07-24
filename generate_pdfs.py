import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register Korean Malgun Gothic font
font_path = r"C:\Windows\Fonts\malgun.ttf"
font_bold_path = r"C:\Windows\Fonts\malgunbd.ttf"

pdfmetrics.registerFont(TTFont("Malgun", font_path))
if os.path.exists(font_bold_path):
    pdfmetrics.registerFont(TTFont("Malgun-Bold", font_bold_path))
else:
    pdfmetrics.registerFont(TTFont("Malgun-Bold", font_path))

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Malgun", 8)
        self.setFillColor(colors.HexColor("#737373"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 800, "Core Company — OnPress OS™ Technical Documentation")
            self.setStrokeColor(colors.HexColor("#E8E6E1"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)

        # Footer
        page_text = f"{self._pageNumber} / {page_count}"
        self.drawRightString(541, 36, page_text)
        self.drawString(54, 36, "Core Company Proprietary & Confidential")
        self.setStrokeColor(colors.HexColor("#E8E6E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 541, 48)
        self.restoreState()


def build_styles():
    styles = getSampleStyleSheet()
    normal = styles['Normal']
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=normal,
        fontName='Malgun-Bold',
        fontSize=20,
        leading=26,
        textColor=colors.HexColor("#1A1917"),
        spaceAfter=12
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=normal,
        fontName='Malgun',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#525252"),
        spaceAfter=20
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=normal,
        fontName='Malgun-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#E8620A"),
        spaceBefore=14,
        spaceAfter=8
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=normal,
        fontName='Malgun-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1E56C8"),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=normal,
        fontName='Malgun',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#262626"),
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=normal,
        fontName='Malgun',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#A855F7"),
        backColor=colors.HexColor("#1A1917"),
        borderColor=colors.HexColor("#333333"),
        borderWidth=0.5,
        borderPadding=8,
        spaceAfter=8
    )
    
    return title_style, subtitle_style, h1_style, h2_style, body_style, code_style


def generate_security_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    title_style, subtitle_style, h1_style, h2_style, body_style, code_style = build_styles()
    story = []

    # Title & Header Block
    story.append(Paragraph("OnPress OS™ 보안 및 망분리 아키텍처 백서", title_style))
    story.append(Paragraph("문서 유형: 기술 백서 (PDF) | 버전: V1.0 | 작성일: 2026년 7월 24일<br/>작성: Core Company | 대상: CTO, CIO, 보안 책임자, 인프라 아키텍트", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#E8620A"), spaceAfter=15))

    # Executive Summary
    story.append(Paragraph("Executive Summary", h1_style))
    story.append(Paragraph("OnPress OS™는 외부망 데이터 전송 0바이트를 설계 원칙으로 하는 온프레미스 sLLM(소형 거대 언어 모델) 통합 플랫폼입니다. 모든 AI 추론 연산이 고객사 사내 서버 내에서 완결되며, 입력된 데이터는 단 1바이트도 외부로 유출되지 않습니다.", body_style))
    story.append(Paragraph("본 백서는 OnPress OS™의 3중 망분리 아키텍처(물리 계층 → 네트워크 계층 → 애플리케이션 계층)와 E2E 암호화 파이프라인을 상세히 기술하며, 방산·제조·의료 등 보안 규제 산업에서의 실 적용 방안을 제시합니다.", body_style))
    story.append(Spacer(1, 10))

    # Section 1
    story.append(Paragraph("1. 배경: 왜 온프레미스 AI인가", h1_style))
    story.append(Paragraph("1.1 클라우드 AI의 구조적 보안 위험", h2_style))

    table_data = [
        [Paragraph("<b>위험 요소</b>", body_style), Paragraph("<b>설명</b>", body_style), Paragraph("<b>실제 사례</b>", body_style)],
        [Paragraph("데이터 전송 노출", body_style), Paragraph("모든 프롬프트·문서가 외부 API 서버를 경유", body_style), Paragraph("GPT API에 기밀 도면 업로드 시 제3자 서버 저장", body_style)],
        [Paragraph("토큰 과금 폭발", body_style), Paragraph("컨텍스트 길이에 비례한 무한 과금", body_style), Paragraph("30분 작업에 $62~$124 자동 청구", body_style)],
        [Paragraph("서비스 종속성", body_style), Paragraph("API 중단 시 업무 전체 마비", body_style), Paragraph("클라우드 장애로 공장 AI 시스템 다운", body_style)],
        [Paragraph("규제 미준수", body_style), Paragraph("방산·금융·의료 분야 외부망 AI 사용 금지 규정 위반", body_style), Paragraph("방위사업청 보안규정, 의료법 제19조 위반", body_style)]
    ]
    t1 = Table(table_data, colWidths=[110, 210, 160])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E8620A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t1)
    story.append(Spacer(1, 12))

    story.append(Paragraph("1.2 온프레미스 sLLM의 비교 우위", h2_style))
    comp_data = [
        [Paragraph("<b>항목</b>", body_style), Paragraph("<b>클라우드 LLM (GPT-5.6 / Fable 5)</b>", body_style), Paragraph("<b>OnPress OS™</b>", body_style)],
        [Paragraph("데이터 전송", body_style), Paragraph("외부 서버 경유", body_style), Paragraph("<b>0바이트 (폐쇄망)</b>", body_style)],
        [Paragraph("비용 구조", body_style), Paragraph("종량제 (예측 불가)", body_style), Paragraph("<b>고정비 (월 정액)</b>", body_style)],
        [Paragraph("규제 컴플라이언스", body_style), Paragraph("위반 가능성 존재", body_style), Paragraph("<b>완전 준수</b>", body_style)],
        [Paragraph("레이턴시", body_style), Paragraph("인터넷 속도 의존", body_style), Paragraph("<b>로컬 추론 12ms</b>", body_style)]
    ]
    t2 = Table(comp_data, colWidths=[120, 180, 180])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E56C8")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t2)
    story.append(PageBreak())

    # Section 2: 3중 망분리
    story.append(Paragraph("2. 3중 망분리 아키텍처", h1_style))
    story.append(Paragraph("2.1 물리 계층 (Physical Layer)", h2_style))
    story.append(Paragraph("• <b>에어갭(Air-Gap)</b>: AI 추론 서버와 외부망을 물리적으로 완전 분리<br/>• <b>NAS 금고</b>: 모든 학습·추론 데이터를 암호화된 로컬 스토리지에 저장. AES-256 적용<br/>• <b>단방향 게이트웨이</b>: 모델 업데이트 시 외부→내부 단방향 전송만 허용. 내부→외부 트래픽은 iptables로 완전 차단", body_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.2 네트워크 계층 (Network Layer)", h2_style))
    net_data = [
        [Paragraph("<b>구성 요소</b>", body_style), Paragraph("<b>사양</b>", body_style), Paragraph("<b>설명</b>", body_style)],
        [Paragraph("VLAN 분리", body_style), Paragraph("802.1Q 표준", body_style), Paragraph("AI 트래픽 전용 VLAN 태깅, 일반 업무망과 분리", body_style)],
        [Paragraph("MAC 주소 필터링", body_style), Paragraph("화이트리스트 기반", body_style), Paragraph("등록된 디바이스만 AI 노드 접근 허용", body_style)],
        [Paragraph("mTLS 상호 인증", body_style), Paragraph("X.509 인증서", body_style), Paragraph("AI 노드 ↔ NAS ↔ 클라이언트 간 양방향 TLS", body_style)],
        [Paragraph("로컬 DNS", body_style), Paragraph("Pi-hole + Unbound", body_style), Paragraph("외부 DNS 쿼리 차단, 내부 전용 호스트명 해석", body_style)]
    ]
    t3 = Table(net_data, colWidths=[110, 130, 240])
    t3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#8B3AC8")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t3)
    story.append(Spacer(1, 10))

    story.append(Paragraph("2.3 애플리케이션 계층 & SDK 예시", h2_style))
    code_text = """const node = new OnPressNode({
  endpoint: "http://192.168.1.100:8080", // 로컬 IP 전용
  aesKey: process.env.LOCAL_VAULT_KEY, // 환경변수 주입
});

const result = await node.infer({
  model: "onpress-13b-v2",
  protocol: "ONVIF_RTSP",
  prompt: "라인 #3 CCTV 시각 감시 이상 징후 분석"
});
// → { tokenCost: 0, latencyMs: 12, egressBytes: 0, dataLeakRisk: "none" }"""
    story.append(Paragraph(code_text.replace('\n', '<br/>'), code_style))

    story.append(PageBreak())

    # Section 3: E2E Encryption
    story.append(Paragraph("3. E2E 데이터 암호화 파이프라인", h1_style))
    e2e_data = [
        [Paragraph("<b>단계</b>", body_style), Paragraph("<b>암호화 방식</b>", body_style), Paragraph("<b>키 관리</b>", body_style)],
        [Paragraph("센서 → 수집 노드", body_style), Paragraph("TLS 1.3 + PSK", body_style), Paragraph("사전 공유키, 기기별 고유 페어링", body_style)],
        [Paragraph("수집 → 저장 (NAS)", body_style), Paragraph("AES-256-GCM", body_style), Paragraph("HSM 또는 로컬 볼트", body_style)],
        [Paragraph("저장 → 추론", body_style), Paragraph("메모리 내 복호화", body_style), Paragraph("추론 완료 즉시 메모리 소거 (memset_s)", body_style)],
        [Paragraph("저장 데이터 (At Rest)", body_style), Paragraph("LUKS2 + dm-crypt", body_style), Paragraph("TPM 2.0 바인딩", body_style)]
    ]
    t4 = Table(e2e_data, colWidths=[140, 160, 180])
    t4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F7A5A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t4)
    story.append(Spacer(1, 14))

    # Section 4: Compliance Matrix
    story.append(Paragraph("4. 규제 컴플라이언스 매트릭스", h1_style))
    comp_matrix = [
        [Paragraph("<b>규제/인증</b>", body_style), Paragraph("<b>요구사항</b>", body_style), Paragraph("<b>OnPress OS™ 준수 방식</b>", body_style)],
        [Paragraph("방위사업청 보안규정", body_style), Paragraph("군사 기밀 외부망 전송 금지", body_style), Paragraph("물리적 에어갭 + 제로 이그레스", body_style)],
        [Paragraph("ISMS-P", body_style), Paragraph("개인정보 암호화·접근 통제", body_style), Paragraph("AES-256 + RBAC 접근 제어", body_style)],
        [Paragraph("GDPR Art.32", body_style), Paragraph("처리의 안전성 확보", body_style), Paragraph("E2E 암호화 + 데이터 현지화", body_style)],
        [Paragraph("HIPAA", body_style), Paragraph("의료정보 전송 시 암호화 필수", body_style), Paragraph("TLS 1.3 + 저장 데이터 암호화", body_style)]
    ]
    t5 = Table(comp_matrix, colWidths=[120, 180, 180])
    t5.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#B86A00")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t5)

    doc.build(story, canvasmaker=NumberedCanvas)


def generate_protocol_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    title_style, subtitle_style, h1_style, h2_style, body_style, code_style = build_styles()
    story = []

    story.append(Paragraph("제조 현장 ONVIF/Modbus 프로토콜 연동 가이드", title_style))
    story.append(Paragraph("문서 유형: 개발자 가이드 | 버전: V1.0 | 작성일: 2026년 7월 24일<br/>작성: Core Company | 대상: 현장 엔지니어, 시스템 통합 개발자, 공장 자동화 담당자", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#E8620A"), spaceAfter=15))

    story.append(Paragraph("개요", h1_style))
    story.append(Paragraph("본 가이드는 기존 제조 현장에 설치된 CCTV(ONVIF)·PLC(Modbus)·IoT 센서(MQTT) 장비를 OnPress OS™와 10분 이내에 네이티브 연동하는 절차를 설명합니다. 복잡한 게이트웨이·프로토콜 컨버터 없이, OnPress OS의 통합 프로토콜 어댑터를 통해 현장 데이터를 AI 추론 파이프라인에 직접 연결할 수 있습니다.", body_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("1. 지원 프로토콜 매트릭스", h1_style))
    story.append(Paragraph("1.1 ONVIF (Open Network Video Interface Forum)", h2_style))
    
    onvif_data = [
        [Paragraph("<b>ONVIF 프로필</b>", body_style), Paragraph("<b>지원 기능</b>", body_style), Paragraph("<b>OnPress 연동 방식</b>", body_style)],
        [Paragraph("Profile S", body_style), Paragraph("비디오 스트리밍 (RTSP)", body_style), Paragraph("ONVIF_RTSP 핸들러", body_style)],
        [Paragraph("Profile G", body_style), Paragraph("엣지 저장·재생", body_style), Paragraph("ONVIF_EDGE 핸들러", body_style)],
        [Paragraph("Profile T", body_style), Paragraph("H.265/HEVC + 메타데이터", body_style), Paragraph("ONVIF_ADV 핸들러", body_style)],
        [Paragraph("Profile M", body_style), Paragraph("이벤트·분석 메타데이터", body_style), Paragraph("ONVIF_EVENT 핸들러", body_style)]
    ]
    t1 = Table(onvif_data, colWidths=[120, 180, 180])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E8620A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t1)
    story.append(Spacer(1, 10))

    story.append(Paragraph("1.2 Modbus (PLC / 컨트롤러 연동)", h2_style))
    modbus_data = [
        [Paragraph("<b>버전</b>", body_style), Paragraph("<b>전송 계층</b>", body_style), Paragraph("<b>대표 장비</b>", body_style), Paragraph("<b>OnPress 연동 방식</b>", body_style)],
        [Paragraph("Modbus RTU", body_style), Paragraph("RS-485", body_style), Paragraph("PLC, 온도 컨트롤러", body_style), Paragraph("MODBUS_RTU 핸들러", body_style)],
        [Paragraph("Modbus TCP", body_style), Paragraph("이더넷 (port 502)", body_style), Paragraph("HMI, SCADA 게이트", body_style), Paragraph("MODBUS_TCP 핸들러", body_style)],
        [Paragraph("Modbus ASCII", body_style), Paragraph("RS-232", body_style), Paragraph("구형 계측기", body_style), Paragraph("ASCII 파서 내장", body_style)]
    ]
    t2 = Table(modbus_data, colWidths=[100, 110, 140, 130])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E56C8")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t2)
    story.append(PageBreak())

    story.append(Paragraph("2. 빠른 시작: 10분 연동 워크플로우", h1_style))
    code_text = """// Step 1: CCTV ONVIF 연동 코드 예시
const cam1 = await node.connect({
  protocol: "ONVIF",
  uri: "rtsp://192.168.1.10:554/stream1",
  profile: "T", // H.265 + 메타데이터
  analytics: ["motion", "line"], // 움직임 감지 + 라인 침입
  label: "생산라인_#3_CCTV"
});

// Step 2: PLC Modbus TCP 연동 코드 예시
const plc1 = await node.connect({
  protocol: "MODBUS_TCP",
  host: "192.168.1.50",
  port: 502,
  registers: [
    { address: 40001, type: "holding", label: "온도_로1" },
    { address: 40002, type: "holding", label: "압력_로1" }
  ],
  pollInterval: 1000 // 1초 주기 폴링
});"""
    story.append(Paragraph(code_text.replace('\n', '<br/>'), code_style))

    doc.build(story, canvasmaker=NumberedCanvas)


def generate_tco_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    title_style, subtitle_style, h1_style, h2_style, body_style, code_style = build_styles()
    story = []

    story.append(Paragraph("3년 TCO 비교 계산 및 ROI 검증 보고서", title_style))
    story.append(Paragraph("문서 유형: 비즈니스 리포트 | 버전: V1.0 | 작성일: 2026년 7월 24일<br/>작성: Core Company | 대상: CEO, CFO, CIO, 구매 담당자", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#E8620A"), spaceAfter=15))

    story.append(Paragraph("Executive Summary", h1_style))
    story.append(Paragraph("본 보고서는 클라우드 종량제 AI API(GPT-5.6 Sol, Claude Fable 5)와 OnPress OS™ 온프레미스 sLLM의 3년 TCO(총소유비용)를 비교 분석한 결과입니다.", body_style))
    story.append(Paragraph("<b>핵심 발견: 5인 사무실 기준, OnPress OS™ 도입 시:</b><br/>• GPT-5.6 대비 3년 누적 <b>₩2억 8,000만원 절감 (ROI 1,087%)</b><br/>• Claude Fable 5 대비 3년 누적 <b>₩5억 8,600만원 절감 (ROI 2,271%)</b><br/>→ 초기 구축비는 3개월 이내 회수 가능하며, 지자체 실증사업 활용 시 초기 구축비 0원으로 즉시 흑자 전환 가능합니다.", body_style))
    story.append(Spacer(1, 10))

    story.append(Paragraph("1. 3년 TCO 시뮬레이션 (5인 기준)", h1_style))
    tco_data = [
        [Paragraph("<b>연도</b>", body_style), Paragraph("<b>GPT-5.6 Sol</b>", body_style), Paragraph("<b>OnPress OS™</b>", body_style), Paragraph("<b>누적 차액</b>", body_style)],
        [Paragraph("1년차", body_style), Paragraph("₩1억 200만", body_style), Paragraph("₩1,165만", body_style), Paragraph("<b>₩9,035만원 절감</b>", body_style)],
        [Paragraph("2년차", body_style), Paragraph("₩1억 200만", body_style), Paragraph("₩660만", body_style), Paragraph("<b>₩1억 9,575만원 절감</b>", body_style)],
        [Paragraph("3년차", body_style), Paragraph("₩1억 200만", body_style), Paragraph("₩660만", body_style), Paragraph("<b>₩2억 8,000만원 절감</b>", body_style)],
        [Paragraph("<b>3년 합계</b>", body_style), Paragraph("<b>₩3억 600만</b>", body_style), Paragraph("<b>₩2,580만</b>", body_style), Paragraph("<b>₩2억 8,000만 (91.6% 절감)</b>", body_style)]
    ]
    t1 = Table(tco_data, colWidths=[80, 130, 130, 140])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#B86A00")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t1)
    story.append(Spacer(1, 14))

    story.append(Paragraph("2. ROI 분석 및 투자회수기간", h1_style))
    roi_data = [
        [Paragraph("<b>시나리오</b>", body_style), Paragraph("<b>총 투자비</b>", body_style), Paragraph("<b>3년 누적 절감액</b>", body_style), Paragraph("<b>ROI (%)</b>", body_style)],
        [Paragraph("일반 구축 (vs GPT-5.6)", body_style), Paragraph("₩2,580만", body_style), Paragraph("₩2억 8,000만", body_style), Paragraph("<b>1,087%</b>", body_style)],
        [Paragraph("일반 구축 (vs Fable 5)", body_style), Paragraph("₩2,580만", body_style), Paragraph("₩5억 8,600만", body_style), Paragraph("<b>2,271%</b>", body_style)],
        [Paragraph("실증사업 (vs GPT-5.6)", body_style), Paragraph("₩1,980만", body_style), Paragraph("₩2억 8,620만", body_style), Paragraph("<b>1,445%</b>", body_style)],
        [Paragraph("실증사업 (vs Fable 5)", body_style), Paragraph("₩1,980만", body_style), Paragraph("₩5억 9,220만", body_style), Paragraph("<b>2,990%</b>", body_style)]
    ]
    t2 = Table(roi_data, colWidths=[150, 110, 130, 90])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#3A6D11")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E8E6E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t2)

    doc.build(story, canvasmaker=NumberedCanvas)


if __name__ == "__main__":
    docs_dir = r"C:\Users\kadones\.gemini\antigravity\scratch\test-homepage\public\docs"
    os.makedirs(docs_dir, exist_ok=True)

    sec_path = os.path.join(docs_dir, "onpress_security_whitepaper.pdf")
    proto_path = os.path.join(docs_dir, "onpress_protocol_guide.pdf")
    tco_path = os.path.join(docs_dir, "onpress_tco_roi_report.pdf")

    generate_security_pdf(sec_path)
    generate_protocol_pdf(proto_path)
    generate_tco_pdf(tco_path)

    print("All 3 PDFs generated successfully in public/docs/")
