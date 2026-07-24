import React from 'react';
import { CUSTOMER_CASES } from '@/lib/constants';
import { Quote, CheckCircle, TrendingUp } from 'lucide-react';

export const metadata = {
  title: "Customers | Core Company — 온프레미스 AI 성공 사례",
  description: "제조, 국방, 헬스케어 등 OnPress OS™ 도입으로 데이터 주권을 확보하고 TCO를 절감한 주요 고객 사례",
};

export default function CustomersPage() {
  return (
    <div className="w-full bg-[#F8F7F4] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#3A6D11]/10 text-[#3A6D11] text-xs font-dm-mono font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>CUSTOMER SUCCESS STORIES</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1917] tracking-tight">
            검증된 리얼 월드 도입 사례
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            클라우드 AI의 보안 및 과금 제약에서 벗어나 기술 독립과 압도적 ROI를 달성한 리더들의 이야기입니다.
          </p>
        </div>

        {/* Case Studies Deep Dive */}
        <div className="space-y-8 mb-16">
          {CUSTOMER_CASES.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#E8E6E1] p-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-neutral-100 gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-[#E8620A] font-dm-mono uppercase">{item.industry}</span>
                  <h2 className="text-xl font-bold text-[#1A1917] mt-1">{item.companyName}</h2>
                </div>
                <div className="bg-[#1A1917] text-white px-4 py-2 rounded-md font-dm-mono text-xs font-bold">
                  ROI: {item.roi}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-6">
                <div className="space-y-4">
                  <div className="bg-[#F8F7F4] p-4 rounded-lg border border-[#E8E6E1]">
                    <span className="text-[10px] font-bold text-neutral-400 font-dm-mono uppercase block mb-1">도입 전 페인포인트 (Problem)</span>
                    <p className="text-xs text-neutral-700 leading-relaxed">{item.problem}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200">
                    <span className="text-[10px] font-bold text-[#3A6D11] font-dm-mono uppercase block mb-1">OnPress OS™ 솔루션 (Solution)</span>
                    <p className="text-xs text-neutral-800 font-medium leading-relaxed">{item.solution}</p>
                  </div>
                </div>

                <div className="bg-neutral-900 text-white p-6 rounded-lg border border-neutral-800 flex flex-col justify-between h-full">
                  <blockquote className="text-xs text-neutral-300 italic leading-relaxed">
                    <Quote className="w-5 h-5 text-[#E8620A] mb-2" />
                    &quot;{item.quote}&quot;
                  </blockquote>
                  <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] font-dm-mono text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Verified Field Customer
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
