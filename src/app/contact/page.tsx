import React from 'react';
import ContactForm from '@/components/home/ContactForm';

export const metadata = {
  title: "Contact | Core Company — PoC 도입 상담 신청",
  description: "OnPress OS™ 온프레미스 AI 3년 TCO 절감 시뮬레이션 및 현장 인프라 연동 무료 PoC 신청",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[#1A1917] min-h-screen">
      <ContactForm />
    </div>
  );
}
