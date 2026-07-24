import React from 'react';
import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/constants';
import CoreLogo from '@/components/common/CoreLogo';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1917] text-neutral-400 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <CoreLogo size={32} className="w-8 h-8" />
            <span className="font-extrabold text-xl tracking-tight text-white">CORE COMPANY</span>
          </div>
          <p className="text-sm text-neutral-300 font-medium">
            &quot;{COMPANY_INFO.tagline}&quot;
          </p>
          <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
            {COMPANY_INFO.productDesc}. 외부 클라우드 연결 0바이트로 기업의 핵심 지적 재산과 보안 데이터를 완벽히 보호합니다.
          </p>
          <div className="pt-2 text-xs font-dm-mono text-[#E8620A]">
            OnPress OS™ v2.6 Enterprise Edition
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wider">주요 메뉴</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/product" className="hover:text-white transition-colors">Product (OnPress OS™)</Link></li>
            <li><Link href="/solutions" className="hover:text-white transition-colors">Solutions (산업별 솔루션)</Link></li>
            <li><Link href="/customers" className="hover:text-white transition-colors">Customers (성공 사례)</Link></li>
            <li><Link href="/resources" className="hover:text-white transition-colors">Resources (기술 백서)</Link></li>
            <li><Link href="/company" className="hover:text-white transition-colors">Company (회사 소개)</Link></li>
          </ul>
        </div>

        {/* Info Column */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wider">거점 및 연락처</h4>
          <div className="text-xs space-y-2 leading-relaxed font-dm-mono">
            <p><strong className="text-neutral-200">본사:</strong> {COMPANY_INFO.location}</p>
            <p><strong className="text-neutral-200">이메일:</strong> {COMPANY_INFO.email}</p>
            <p className="flex items-center gap-1 text-neutral-300 pt-1">
              <strong className="text-neutral-200">공식 블로그:</strong>
              <a
                href={`https://${COMPANY_INFO.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8620A] hover:underline flex items-center gap-1"
              >
                <span>네이버 블로그</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <div className="pt-3 border-t border-neutral-800 flex gap-4 text-xs font-sans">
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-white transition-colors">오시는 길</a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1100px] mx-auto px-6 pt-12 mt-12 border-t border-neutral-800/60 flex flex-col md:flex-row justify-between items-center text-[11px] font-dm-mono text-neutral-400 gap-4">
        <span>© {COMPANY_INFO.established}-2026 Core Company Inc. All rights reserved.</span>
        <span>100% Data Sovereignty • On-Premise sLLM OS</span>
      </div>
    </footer>
  );
}
