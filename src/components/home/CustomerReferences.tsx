import React from 'react';
import Link from 'next/link';
import { CUSTOMER_CASES } from '@/lib/constants';
import { Quote, ArrowRight, CheckCircle } from 'lucide-react';

export default function CustomerReferences() {
  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'amber':
        return 'border-[#B86A00] text-[#B86A00] bg-[#B86A00]/5';
      case 'green':
        return 'border-[#3A6D11] text-[#3A6D11] bg-[#3A6D11]/5';
      case 'teal':
        return 'border-[#0F7A5A] text-[#0F7A5A] bg-[#0F7A5A]/5';
      default:
        return 'border-neutral-500 text-neutral-500 bg-neutral-50';
    }
  };

  return (
    <section className="w-full bg-white py-24 border-b border-[#E8E6E1]">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A6D11]/10 text-[#3A6D11] text-xs font-dm-mono font-bold mb-4">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>PROVEN ENTERPRISE ROI & CASES</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-[#1A1917] tracking-tight mb-6">
            수십 시간의 지연을 0초로 단축한 제조 현장의 혁신.
          </h2>

          <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            &quot;보안 문제로 클라우드 AI 도입을 주저하던 공정에 OnPress OS™를 적용… <br className="hidden md:inline" />
            처리 속도 40% 향상, 보안 사고 0건&quot;
          </p>
        </div>

        {/* Customer Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {CUSTOMER_CASES.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E8E6E1] p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Top Bar Accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  item.badgeColor === 'amber'
                    ? 'bg-[#B86A00]'
                    : item.badgeColor === 'green'
                    ? 'bg-[#3A6D11]'
                    : 'bg-[#0F7A5A]'
                }`}
              />

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border font-dm-mono ${getBadgeClass(item.badgeColor)}`}>
                    {item.industry}
                  </span>
                  <span className="text-xs font-bold text-neutral-400 font-dm-mono">{item.companyName}</span>
                </div>

                <blockquote className="text-xs text-neutral-700 leading-relaxed mb-4 italic relative">
                  <Quote className="w-4 h-4 text-neutral-300 inline mr-1" />
                  &quot;{item.quote}&quot;
                </blockquote>

                <div className="space-y-2 text-xs border-t border-neutral-100 pt-3">
                  <div>
                    <strong className="text-neutral-400 block text-[10px] uppercase">Problem</strong>
                    <span className="text-neutral-600">{item.problem}</span>
                  </div>
                  <div>
                    <strong className="text-neutral-400 block text-[10px] uppercase">Solution</strong>
                    <span className="text-neutral-800 font-medium">{item.solution}</span>
                  </div>
                </div>
              </div>

              {/* ROI Output */}
              <div className="mt-4 pt-3 border-t border-neutral-100 font-dm-mono text-xs font-bold text-[#E8620A]">
                ROI: {item.roi}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8620A] text-white hover:bg-[#d15606] font-bold rounded-md transition-all text-xs shadow-sm"
          >
            <span>산업별 도입 사례 전체 보기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
