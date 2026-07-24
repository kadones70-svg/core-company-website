import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Success | Core Company — PoC 신청 완료",
  description: "Core Company OnPress OS™ PoC 신청이 성공적으로 제출되었습니다.",
};

export default function SuccessPage() {
  return (
    <div className="w-full bg-[#1A1917] text-white min-h-[80vh] flex items-center justify-center py-20 px-6">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#E8620A] font-dm-mono uppercase tracking-wider">
            SUBMISSION CONFIRMED
          </span>
          <h1 className="text-2xl font-extrabold text-white">PoC 신청이 완료되었습니다!</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Core Company 전문 엔지니어가 작성해주신 세부 사항을 확인한 후, <br />
            <strong>영업일 기준 24시간 이내</strong>에 이메일 및 전화로 직접 회신해 드립니다.
          </p>
        </div>

        <div className="p-4 bg-neutral-950 rounded border border-neutral-800 text-left text-xs font-dm-mono space-y-1 text-neutral-400">
          <div>• Notification Sent to: kadones70@gmail.com</div>
          <div>• Status: Encrypted & Queued</div>
        </div>

        <Link
          href="/"
          className="w-full py-3.5 bg-[#E8620A] hover:bg-[#d15606] text-white font-bold rounded-md text-xs transition-all inline-flex items-center justify-center gap-2 shadow-md min-h-[48px]"
        >
          <span>홈으로 돌아가기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
