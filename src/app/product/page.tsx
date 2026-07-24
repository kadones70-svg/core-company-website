import React from 'react';
import Link from 'next/link';
import { TECHNICAL_SPECS } from '@/lib/constants';
import { Cpu, ShieldCheck, Cable, Download, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: "Product | OnPress OS™ — 온프레미스 sLLM 운영체제 사양",
  description: "OnPress OS™ 7B~13B 최적화 sLLM 엔진, AES-256 보안 아키텍처 및 레거시 프로토콜 연동 명세서",
};

export default function ProductPage() {
  return (
    <div className="w-full bg-[#F8F7F4] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1E56C8]/10 text-[#1E56C8] text-xs font-dm-mono font-bold">
            <Cpu className="w-3.5 h-3.5" />
            <span>PRODUCT DEEP DIVE — ONPRESS OS™</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1917] tracking-tight">
            온프레미스 sLLM 운영체제 <br />
            <span className="text-[#E8620A]">OnPress OS™</span> 기술 스펙
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            클라우드 종량제 과금과 데이터 유출 걱정을 원천 차단하는 사내 랙서버 맞춤형 경량화 sLLM 엔터프라이즈 OS입니다.
          </p>
        </div>

        {/* 3 Grid Technical Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TECHNICAL_SPECS.map((spec, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl border border-[#E8E6E1] shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#1A1917] text-white flex items-center justify-center mb-6">
                  {idx === 0 && <Cpu className="w-6 h-6 text-[#8B3AC8]" />}
                  {idx === 1 && <Cable className="w-6 h-6 text-[#E8620A]" />}
                  {idx === 2 && <ShieldCheck className="w-6 h-6 text-[#1E56C8]" />}
                </div>
                <span className="text-xs font-bold text-neutral-400 font-dm-mono block mb-1 uppercase">{spec.category}</span>
                <h3 className="text-xl font-bold text-[#1A1917] mb-3">{spec.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">{spec.description}</p>
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-2 font-dm-mono text-xs">
                {spec.monoDetails.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-neutral-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3A6D11]" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security & Architecture Deep-Dive */}
        <div className="bg-[#1A1917] text-white rounded-xl p-10 border border-neutral-800 mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-bold text-[#1E56C8] font-dm-mono">SECURITY ARCHITECTURE</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">완전 물리 망분리 & AES-256 암호화</h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
              OnPress OS™는 사내 서버 내 독립 컨테이너 가상화 기술로 외부 네트워크 접근을 100% 차단하며, 저장(At-Rest) 및 전송(In-Transit) 모든 구간에서 AES-256 표준 암호화를 적용합니다.
            </p>
          </div>
          <div className="md:col-span-4 text-center md:text-right">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E8620A] text-white font-bold rounded-md text-xs hover:bg-[#d15606] transition-all min-h-[48px]"
            >
              <Download className="w-4 h-4" />
              <span>보안 아키텍처 백서 (PDF)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
