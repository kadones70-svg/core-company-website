import React from 'react';
import { COMPANY_INFO } from '@/lib/constants';
import { Shield, MapPin, History } from 'lucide-react';

export const metadata = {
  title: "Company | Core Company — 회사 소개 및 미션",
  description: "온프레미스 AI로 기업의 데이터 주권을 회복하는 기술 독립 기업 Core Company 소개 (본사: 대한민국 광주)",
};

export default function CompanyPage() {
  return (
    <div className="w-full bg-[#F8F7F4] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1A1917] text-white text-xs font-dm-mono font-bold">
            <Shield className="w-3.5 h-3.5 text-[#E8620A]" />
            <span>ABOUT CORE COMPANY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1917] tracking-tight">
            &quot;온프레미스 AI, 공간에 심다&quot;
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            {COMPANY_INFO.mission}. 무분별한 클라우드 종속에서 벗어나 기업 스스로가 고유한 지적 재산과 데이터 주권을 완벽히 장악하는 미래를 엽니다.
          </p>
        </div>

        {/* 3 Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl border border-[#E8E6E1] shadow-sm">
            <div className="w-10 h-10 rounded bg-[#1E56C8]/10 text-[#1E56C8] flex items-center justify-center mb-4 font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-[#1A1917] mb-2">데이터 주권 (Sovereignty)</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              사내 주요 공정 데이터는 단 1바이트도 사외로 유출되어서는 안 됩니다. 철저한 망분리와 암호화로 데이터 완전 통제권을 되찾아 드립니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#E8E6E1] shadow-sm">
            <div className="w-10 h-10 rounded bg-[#8B3AC8]/10 text-[#8B3AC8] flex items-center justify-center mb-4 font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-[#1A1917] mb-2">기술 독립 (Independence)</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              특정 해외 빅테크 클라우드 API 가격 인상이나 규제 변동에 휘둘리지 않고 100% 자립 가능한 온프레미스 sLLM 소프트웨어 생태계를 만듭니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-[#E8E6E1] shadow-sm">
            <div className="w-10 h-10 rounded bg-[#E8620A]/10 text-[#E8620A] flex items-center justify-center mb-4 font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-[#1A1917] mb-2">고객 현장 중심 (Field First)</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              탁상공론식 이론이 아닌 실제 제조 공장, 국방 관제실, 병원 진료실 등 고객의 실제 물리 공간 환경에 최적화된 인프라를 공급합니다.
            </p>
          </div>
        </div>

        {/* Company History & Location Details */}
        <div className="bg-white rounded-xl border border-[#E8E6E1] p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E8620A] font-dm-mono">
              <History className="w-4 h-4" />
              <span>COMPANY HISTORY & BASE</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1A1917]">대한민국 광주에 뿌리를 둔 기술 기업</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Core Company는 2026년 대한민국 광주광역시에 거점을 두고 설립되었으며, 제조 및 보안 산업 현장에 특화된 엔터프라이즈 온프레미스 sLLM OS 솔루션을 전 세계 시장으로 확장하고 있습니다.
            </p>
            <div className="pt-2 font-dm-mono text-xs text-neutral-700 space-y-1">
              <div>• 2026.01: Core Company 법인 설립</div>
              <div>• 2026.03: OnPress OS™ Enterprise v2.6 상용화 출시</div>
              <div>• 2026.05: 스마트팩토리 & 디펜스 보안망 PoC 파트너십 체결</div>
            </div>
          </div>

          <div className="bg-[#1A1917] text-white p-6 rounded-lg border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 font-dm-mono text-xs text-emerald-400">
              <MapPin className="w-4 h-4" />
              <span>HEADQUARTERS LOCATION</span>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong className="text-neutral-300">회사명:</strong> Core Company Inc.</p>
              <p><strong className="text-neutral-300">대표 제품:</strong> OnPress OS™</p>
              <p><strong className="text-neutral-300">거점:</strong> 대한민국 광주광역시 (본사)</p>
              <p><strong className="text-neutral-300">도메인:</strong> corecompany.net</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
