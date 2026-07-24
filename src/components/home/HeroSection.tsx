'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ArrowRight, Server, Lock, Cpu, CheckCircle2, Zap } from 'lucide-react';

export default function HeroSection() {
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const pathname = usePathname();

  const handlePocClick = (e: React.MouseEvent) => {
    const contactEl = document.getElementById('contact');
    if (pathname === '/' && contactEl) {
      e.preventDefault();
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#1A1917] text-white pt-20 pb-28 border-b border-neutral-800 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E56C8]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8620A]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        {/* A/B Test Mode Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs">
            <span className="text-neutral-400 px-3 py-1 font-mono text-[11px]">A/B 메시지 선택:</span>
            <button
              onClick={() => setVariant('A')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                variant === 'A'
                  ? 'bg-[#1E56C8] text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Variant A (보안/통제)
            </button>
            <button
              onClick={() => setVariant('B')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                variant === 'B'
                  ? 'bg-[#E8620A] text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Variant B (효율/호환)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-[#E8620A] font-dm-mono font-medium">
              <ShieldCheck className="w-4 h-4 text-[#E8620A]" />
              <span>ONPRESS OS™ ENTERPRISE EDITION</span>
            </div>

            {variant === 'A' ? (
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white tracking-tight">
                당신의 데이터는 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#1E56C8]">
                  단 한 발자국도 밖으로
                </span><br />
                나가지 않습니다.
              </h1>
            ) : (
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white tracking-tight">
                현장 설비 변경 없이, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#E8620A]">
                  끊김 없는 맞춤형 AI를
                </span><br />
                심다.
              </h1>
            )}

            <p className="text-base md:text-lg text-neutral-300 max-w-xl leading-relaxed">
              {variant === 'A'
                ? '외부 클라우드 의존 없이, 철저히 사내 폐쇄망에서 통제되는 엔터프라이즈 온프레미스 sLLM 운영체제입니다.'
                : '고가의 GPU나 외부 인터넷 없이도 ONVIF·MQTT 등 기존 인프라와 즉각 연동되는 현장 밀착형 온프레미스 AI.'}
            </p>

            <div className="text-xs text-neutral-400 font-dm-mono pt-1">
              데이터 주권이 필요한 모든 현장을 위해 — 제조·국방·헬스케어·스마트빌딩·스마트팜·스마트홈
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/contact"
                onClick={handlePocClick}
                className="px-7 py-3.5 bg-[#E8620A] hover:bg-[#d15606] text-white font-bold rounded-md flex items-center justify-center gap-2 shadow-lg transition-all min-h-[48px]"
              >
                <span>무료 PoC 일정 잡기 →</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/product"
                className="px-7 py-3.5 bg-transparent border-2 border-[#8B3AC8] text-[#8B3AC8] hover:bg-[#8B3AC8]/10 font-bold rounded-md flex items-center justify-center transition-all min-h-[48px]"
              >
                기술 아키텍처 보기
              </Link>
            </div>

            {/* Technical Badges */}
            <div className="pt-8 border-t border-neutral-800/80 grid grid-cols-3 gap-4 font-dm-mono">
              <div className="bg-neutral-900/80 p-3 rounded border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">TOKEN FEE</span>
                <strong className="text-base text-[#B86A00]">0 KRW</strong>
              </div>
              <div className="bg-neutral-900/80 p-3 rounded border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">DATA SOVEREIGNTY</span>
                <strong className="text-base text-[#1E56C8]">100%</strong>
              </div>
              <div className="bg-neutral-900/80 p-3 rounded border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">ENGINE SPEC</span>
                <strong className="text-base text-[#8B3AC8]">7B - 13B</strong>
              </div>
            </div>
          </div>

          {/* Right Abstract Server Rack Diagram */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-dm-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  SYSTEM ACTIVE (CLOSED NET)
                </span>
              </div>

              {/* OnPress Node Visual */}
              <div className="py-6 space-y-4 font-dm-mono text-xs">
                <div className="p-3 bg-neutral-950 rounded border border-neutral-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#1E56C8]" />
                    <span className="text-neutral-200">OnPress OS™ Core Node</span>
                  </div>
                  <span className="text-emerald-400 text-[11px]">ON-PREMISE</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-950/60 rounded border border-neutral-800 text-neutral-300">
                    <div className="text-[10px] text-neutral-500">sLLM Engine</div>
                    <div className="font-bold text-[#8B3AC8] flex items-center gap-1 mt-1">
                      <Cpu className="w-3.5 h-3.5" /> 13B Q4 Quant
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-950/60 rounded border border-neutral-800 text-neutral-300">
                    <div className="text-[10px] text-neutral-500">Security Vault</div>
                    <div className="font-bold text-[#1E56C8] flex items-center gap-1 mt-1">
                      <Lock className="w-3.5 h-3.5" /> AES-256
                    </div>
                  </div>
                </div>

                {/* Cloud Isolated Alert Box */}
                <div className="p-3 bg-[#C43A1A]/10 border border-[#C43A1A]/30 rounded flex justify-between items-center text-[#C43A1A]">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Cloud Egress Status
                  </span>
                  <span className="font-bold text-xs">0 Bytes (X Blocked)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Latency: &lt; 15ms</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Isolated
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
