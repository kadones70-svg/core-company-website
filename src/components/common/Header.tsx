'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';
import CoreLogo from '@/components/common/CoreLogo';
import { Menu, X, Download } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePocClick = (e: React.MouseEvent) => {
    const contactEl = document.getElementById('contact');
    if (pathname === '/' && contactEl) {
      e.preventDefault();
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A1917]/95 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo with Official 3D Isometric Emblem */}
        <Link href="/" className="flex items-center gap-3 group">
          <CoreLogo size={36} className="w-9 h-9 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight leading-none text-white group-hover:text-[#E8620A] transition-colors">
              CORE COMPANY
            </span>
            <span className="text-[10px] text-neutral-400 font-dm-mono tracking-wider">OnPress OS™</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors relative py-1 ${
                  isActive ? 'text-[#E8620A] font-semibold' : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8620A] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/resources"
            className="px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#8B3AC8]" />
            <span>백서 다운</span>
          </Link>
          <Link
            href="/contact"
            onClick={handlePocClick}
            className="px-4 py-2 text-xs font-bold bg-[#E8620A] hover:bg-[#d15606] text-white rounded-md transition-all shadow-sm flex items-center gap-1"
          >
            <span>PoC 문의</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-300 hover:text-white"
          aria-label="메뉴 열기/닫기"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-[#1A1917] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-2 ${
                  pathname === item.href ? 'text-[#E8620A] font-bold' : 'text-neutral-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center text-sm font-semibold border border-neutral-700 rounded-md text-white"
            >
              백서 다운로드
            </Link>
            <Link
              href="/contact"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handlePocClick(e);
              }}
              className="w-full py-3 text-center text-sm font-bold bg-[#E8620A] rounded-md text-white cursor-pointer"
            >
              무료 PoC 일정 잡기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
