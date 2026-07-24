import React from 'react';
import Link from 'next/link';
import { Lock, FileText, ArrowRight, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

export default function DataSovereignty() {
  return (
    <section className="w-full bg-[#F8F7F4] py-24 border-b border-[#E8E6E1]">
      <div className="max-w-[900px] mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E56C8]/10 text-[#1E56C8] text-xs font-dm-mono font-bold mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>DATA SOVEREIGNTY GUARANTEE</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold text-[#1A1917] tracking-tight mb-6">
          클라우드로 넘어간 데이터, 정말 안전하다고 믿으십니까?
        </h2>

        <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-12">
          OnPress OS™는 완벽한 오프라인 폐쇄망 구동으로 데이터 유출 가능성을 원천 차단합니다. <br className="hidden md:inline" />
          당신의 핵심 공정 데이터와 지적 재산은 단 한 바이트도 사외로 유출되지 않습니다.
        </p>

        {/* Data Flow Diagram Card */}
        <div className="bg-white border border-[#E8E6E1] rounded-xl p-8 shadow-sm mb-10 text-left">
          <h3 className="text-sm font-bold text-neutral-500 font-dm-mono mb-6 uppercase tracking-wider">
            Architecture: Offline Isolated Closed Network
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Step 1: On-Premise Factory */}
            <div className="p-5 bg-[#F8F7F4] rounded-lg border border-[#E8E6E1] text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#1A1917] text-white flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-bold text-sm text-[#1A1917] mb-1">고객 사내 현장 (공장/본사)</h4>
              <p className="text-xs text-neutral-500">CCTV, IoT 센서, EMR, 도면 데이터 생성</p>
            </div>

            {/* Step 2: OnPress OS Server (Core Blue) */}
            <div className="p-5 bg-[#1E56C8]/5 rounded-lg border-2 border-[#1E56C8] text-center relative shadow-sm">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#1E56C8] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#1E56C8] mb-1">OnPress OS™ 온프레미스 Node</h4>
              <p className="text-xs text-neutral-600">사내 랙 서버 탑재 • sLLM 엔진 구동</p>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-dm-mono text-[#3A6D11] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Safe Processing
              </div>
            </div>

            {/* Step 3: Blocked Cloud Egress */}
            <div className="p-5 bg-neutral-100 rounded-lg border border-dashed border-neutral-300 text-center opacity-75 relative">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center font-bold">
                <XCircle className="w-5 h-5 text-[#C43A1A]" />
              </div>
              <h4 className="font-bold text-sm text-neutral-500 line-through mb-1">외부 퍼블릭 클라우드</h4>
              <p className="text-xs text-neutral-400">데이터 전송 0 Bytes 차단</p>
              <span className="absolute top-2 right-2 text-[10px] font-dm-mono bg-[#C43A1A] text-white px-2 py-0.5 rounded font-bold">
                BLOCKED
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#1E56C8] text-[#1E56C8] hover:bg-[#1E56C8] hover:text-white font-bold rounded-md transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>보안 아키텍처 백서 다운로드</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
