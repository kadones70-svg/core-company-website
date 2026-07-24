import React from 'react';
import Link from 'next/link';
import { Cable, Video, Cpu, KeyRound, HardDrive, ArrowRight } from 'lucide-react';

export default function LegacyIntegration() {
  const protocols = [
    { name: 'ONVIF / RTSP', icon: Video, desc: '지능형 CCTV 및 실시간 영상 스트리밍 분석' },
    { name: 'MQTT / Modbus', icon: Cpu, desc: '제조 공정 PLC 및 산업용 IoT 센서 수집' },
    { name: 'RFID / 출입통제', icon: KeyRound, desc: '지문, RFID 칩, 생체 출입 보안 모듈 연동' },
    { name: 'NAS (SMB / NFS)', icon: HardDrive, desc: '사내 파일 서버 및 도면/문서 자동 색인' },
  ];

  return (
    <section className="w-full bg-[#F8F7F4] py-24 border-b border-[#E8E6E1]">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B3AC8]/10 text-[#8B3AC8] text-xs font-dm-mono font-bold mb-4">
            <Cable className="w-3.5 h-3.5" />
            <span>NATIVE PROTOCOL INTEGRATION</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-[#1A1917] tracking-tight mb-6">
            기존 현장 설비를 뜯어고칠 필요가 전혀 없습니다.
          </h2>

          <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            ONVIF(CCTV)·MQTT/Modbus(IoT 센서)·RFID 출입 통제 등 <br className="hidden md:inline" />
            기존 인프라와 API 수정 없이 즉각 네이티브 연동됩니다.
          </p>
        </div>

        {/* Protocol Compatibility Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {protocols.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-[#E8E6E1] hover:border-[#8B3AC8] transition-all shadow-sm flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#8B3AC8]/10 text-[#8B3AC8] flex items-center justify-center shrink-0 group-hover:bg-[#8B3AC8] group-hover:text-white transition-colors">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#1A1917] text-base font-dm-mono">{p.name}</h3>
                    <span className="text-[10px] bg-emerald-100 text-[#3A6D11] px-1.5 py-0.5 rounded font-bold">
                      NATIVE
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integration Architecture Banner */}
        <div className="bg-white p-6 rounded-xl border border-[#E8E6E1] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <div className="text-xs font-bold text-[#8B3AC8] font-dm-mono">ZERO CODE INTEGRATION</div>
            <div className="text-sm font-bold text-[#1A1917]">기존 시스템 수정 없이 10분 내 세팅 완료</div>
            <div className="text-xs text-neutral-500">RESTful API, gRPC, WebSocket SDK 완비</div>
          </div>
          <Link
            href="/product"
            className="px-5 py-2.5 bg-transparent border-1.5 border-[#8B3AC8] text-[#8B3AC8] hover:bg-[#8B3AC8]/10 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>연동 지원 기술 명세서 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
