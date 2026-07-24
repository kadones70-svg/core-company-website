'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SOLUTIONS } from '@/lib/constants';
import { Factory, Shield, Activity, Building2, Sprout, Home, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SolutionsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const getIcon = (name: string) => {
    switch (name) {
      case 'Factory': return Factory;
      case 'Shield': return Shield;
      case 'Activity': return Activity;
      case 'Building2': return Building2;
      case 'Sprout': return Sprout;
      default: return Home;
    }
  };

  const filteredSolutions = activeTab === 'all'
    ? SOLUTIONS
    : SOLUTIONS.filter((s) => s.id === activeTab);

  return (
    <div className="w-full bg-[#F8F7F4] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#8B3AC8]/10 text-[#8B3AC8] text-xs font-dm-mono font-bold">
            <span>VERTICAL INDUSTRY SOLUTIONS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1917] tracking-tight">
            산업별 맞춤형 온프레미스 AI 솔루션
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            제조 현장의 PLC 센서부터 국방 폐쇄망, 병원 EMR 데이터, 스마트홈 사설 서버까지 현장 도메인 특성에 완전히 조화되는 전용 AI 노드를 심습니다.
          </p>
        </div>

        {/* Interactive Industry Tab Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
              activeTab === 'all'
                ? 'bg-[#1A1917] text-white shadow-md'
                : 'bg-white text-neutral-600 border border-[#E8E6E1] hover:bg-neutral-100'
            }`}
          >
            전체 보기 (6개 산업)
          </button>
          {SOLUTIONS.map((sol) => (
            <button
              key={sol.id}
              onClick={() => setActiveTab(sol.id)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                activeTab === sol.id
                  ? 'bg-[#E8620A] text-white shadow-md'
                  : 'bg-white text-neutral-600 border border-[#E8E6E1] hover:bg-neutral-100'
              }`}
            >
              {sol.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Solutions List */}
        <div className="space-y-8 mb-16">
          {filteredSolutions.map((sol) => {
            const IconComp = getIcon(sol.iconName);
            return (
              <div
                key={sol.id}
                className="bg-white rounded-xl border border-[#E8E6E1] p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center hover:border-[#8B3AC8] transition-colors"
              >
                <div className="md:col-span-4 space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1A1917] text-white flex items-center justify-center">
                    <IconComp className="w-6 h-6 text-[#E8620A]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#1A1917]">{sol.title}</h2>
                  <p className="text-xs font-semibold text-[#8B3AC8]">{sol.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {sol.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-dm-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4 border-t md:border-t-0 md:border-l border-neutral-100 md:pl-8 pt-4 md:pt-0">
                  <p className="text-xs text-neutral-600 leading-relaxed">{sol.description}</p>
                  <div className="space-y-2 font-dm-mono text-xs text-neutral-800">
                    {sol.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#3A6D11]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/#contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8620A] hover:underline"
                    >
                      <span>{sol.title} 도입 상담 신청</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
