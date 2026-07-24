'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, TrendingDown, Coins, ArrowRight } from 'lucide-react';

export default function ZeroTokenFee() {
  const [dailyQueries, setDailyQueries] = useState<number>(10000);
  const pathname = usePathname();

  const handlePocClick = (e: React.MouseEvent) => {
    const contactEl = document.getElementById('contact');
    if (pathname === '/' && contactEl) {
      e.preventDefault();
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cloud API estimate: approx 15 KRW per query (input + output tokens)
  const cloudAnnualCost = (dailyQueries * 15 * 365) / 10000; // 10k KRW (만원)
  // OnPress OS estimate: Fixed server amortized cost + 0 KRW token fee
  const onPressAnnualCost = 1500; // 1500만원 (서버 라이선스 고정)

  const savings = Math.max(0, Math.round(cloudAnnualCost - onPressAnnualCost));

  return (
    <section className="w-full bg-white py-24 border-b border-[#E8E6E1]">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B86A00]/10 text-[#B86A00] text-xs font-dm-mono font-bold mb-4">
            <Coins className="w-3.5 h-3.5" />
            <span>ZERO RUNNING TOKEN COST</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-[#1A1917] tracking-tight mb-6">
            토큰 비용 0원, 무한히 확장하는 엔터프라이즈 AI.
          </h2>

          <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            사용할수록 눈덩이처럼 불어나는 종량제 API 과금에 지치셨습니까? <br className="hidden md:inline" />
            7B~13B 최적화 경량화 기술로 고가의 GPU 서버 없이 0원의 러닝 코스트로 AI를 운영하십시오.
          </p>
        </div>

        {/* 3-Year TCO Comparison Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Cloud API Card */}
          <div className="bg-[#F8F7F4] p-6 rounded-xl border border-[#E8E6E1]">
            <span className="text-xs font-bold text-neutral-500 font-dm-mono">OPTION A: PUBLIC CLOUD API</span>
            <h3 className="text-lg font-bold text-[#1A1917] mt-1 mb-4">기존 종량제 클라우드 LLM</h3>
            
            <div className="space-y-3 font-dm-mono text-xs">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span>토큰 비용 방식</span>
                <span className="text-[#C43A1A] font-bold">호출당 종량제 과금</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span>트래픽 증가 시</span>
                <span className="text-[#C43A1A] font-bold">비용 기하급수 상승</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>3년 예상 TCO</span>
                <span className="text-base font-bold text-[#C43A1A]">약 1.5억 ~ 3.2억원</span>
              </div>
            </div>
          </div>

          {/* OnPress OS Card (Amber highlight) */}
          <div className="bg-gradient-to-br from-[#B86A00]/5 to-white p-6 rounded-xl border-2 border-[#B86A00] shadow-sm relative">
            <span className="absolute -top-3 right-4 bg-[#B86A00] text-white text-[10px] font-dm-mono font-bold px-2.5 py-0.5 rounded-full">
              RECOMMENDED
            </span>
            <span className="text-xs font-bold text-[#B86A00] font-dm-mono">OPTION B: ONPRESS OS™</span>
            <h3 className="text-lg font-bold text-[#1A1917] mt-1 mb-4">온프레미스 sLLM 운영체제</h3>

            <div className="space-y-3 font-dm-mono text-xs">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span>토큰 비용 방식</span>
                <span className="text-[#3A6D11] font-bold">0 KRW (무제한 사용)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span>인프라 요구사항</span>
                <span className="text-[#1E56C8] font-bold">일반 CPU 랙서버 가능</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>3년 예상 TCO</span>
                <span className="text-base font-extrabold text-[#B86A00]">단일 도입비용 외 0원</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive ROI Calculator Widget */}
        <div className="bg-[#1A1917] text-white p-8 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-2 mb-6 text-[#B86A00] font-dm-mono font-bold text-sm">
            <Calculator className="w-4 h-4" />
            <span>실시간 3년 TCO 절감 ROI 계산기</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <label className="block text-xs font-medium text-neutral-300">
                일일 예상 AI 질의/분석 건수: <strong className="text-[#B86A00] font-dm-mono text-sm">{dailyQueries.toLocaleString()}건</strong>
              </label>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={dailyQueries}
                onChange={(e) => setDailyQueries(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#B86A00]"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 font-dm-mono">
                <span>2,000건/일</span>
                <span>25,000건/일</span>
                <span>50,000건/일</span>
              </div>
            </div>

            <div className="md:col-span-5 bg-neutral-900 p-5 rounded-lg border border-neutral-800 text-center">
              <span className="text-xs text-neutral-400 font-dm-mono">예상 연간 비용 절감액</span>
              <div className="text-2xl md:text-3xl font-extrabold text-[#B86A00] font-dm-mono my-2 flex items-center justify-center gap-1">
                <TrendingDown className="w-6 h-6 text-[#3A6D11]" />
                약 {savings.toLocaleString()} 만원
              </div>
              <span className="text-[11px] text-neutral-500">종량제 대비 3년 누적 TCO 절감률 약 72%</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
            <Link
              href="/contact"
              onClick={handlePocClick}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#E8620A] hover:underline"
            >
              <span>맞춤형 견적 시뮬레이션 신청하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
