'use client';

import React, { useState } from 'react';
import { Send, Clock, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function ContactForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    solution: 'smart-factory',
    role: '',
    pain_point: '',
    infra: '',
    privacyAgree: false,
    'bot-field': '',
  });

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('이름과 회사 이메일을 입력해 주세요.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.privacyAgree) {
      alert('개인정보 수집 및 이용 동의는 필수 선택 항목입니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 100% Free Instant Email Delivery to kadones70@gmail.com via FormSubmit AJAX API
      await fetch('https://formsubmit.co/ajax/kadones70@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[Core Company PoC 문의] ${formData.name}님 (${formData.email})`,
          성함: formData.name,
          회사이메일: formData.email,
          관심솔루션: formData.solution,
          직급_담당업무: formData.role,
          주요페인포인트: formData.pain_point,
          현재인프라: formData.infra,
        })
      });
    } catch (err) {
      console.error('Form submit error:', err);
    } finally {
      window.location.href = '/success';
    }
  };

  return (
    <section id="contact" className="w-full bg-[#1A1917] text-white py-24 border-b border-neutral-800">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8620A]/10 text-[#E8620A] text-xs font-dm-mono font-bold">
              <span>GET IN TOUCH FOR POC</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              온프레미스 AI 도입, <br />
              전문 엔지니어와 상담하세요.
            </h2>

            <p className="text-xs text-neutral-400 leading-relaxed">
              귀사의 기존 인프라(CCTV, PLC, 센서) 연동 가능 여부와 3년 TCO 절감 시뮬레이션을 무상으로 진단해 드립니다.
            </p>

            <div className="space-y-4 pt-4 border-t border-neutral-800 text-xs font-dm-mono">
              <div className="flex items-center gap-3 text-neutral-300">
                <Clock className="w-4 h-4 text-[#E8620A]" />
                <span>영업일 기준 1일 이내 전문 엔지니어 회신</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Mail className="w-4 h-4 text-[#1E56C8]" />
                <span>contact@corecompany.net</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#8B3AC8]" />
                <span>본사: 대한민국 광주광역시</span>
              </div>
            </div>
          </div>

          {/* Right: Instant Free Email Form */}
          <div className="md:col-span-7 bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-xl relative">
            <form
              name="contact"
              method="POST"
              action="/success"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Hidden Fields for Netlify Forms & Honeypot */}
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden" hidden>
                <label>
                  Don&apos;t fill this out if you&apos;re human:{' '}
                  <input
                    name="bot-field"
                    value={formData['bot-field']}
                    onChange={(e) => setFormData({ ...formData, 'bot-field': e.target.value })}
                  />
                </label>
              </p>

              {/* Step Indicator */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs font-dm-mono">
                <span className="text-neutral-400">
                  STEP {step} / 2 {step === 1 ? '(기본 정보)' : '(인프라 세부)'}
                </span>
                <div className="flex gap-1.5">
                  <div className={`w-6 h-1 rounded-full ${step >= 1 ? 'bg-[#E8620A]' : 'bg-neutral-800'}`} />
                  <div className={`w-6 h-1 rounded-full ${step === 2 ? 'bg-[#E8620A]' : 'bg-neutral-800'}`} />
                </div>
              </div>

              {/* STEP 1 Fields */}
              <div className={step === 1 ? 'space-y-4 block' : 'hidden'}>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">
                    성함 <span className="text-[#E8620A]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8620A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">
                    회사 이메일 <span className="text-[#E8620A]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8620A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">관심 솔루션 분야</label>
                  <select
                    name="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-white focus:outline-none focus:border-[#E8620A]"
                  >
                    <option value="smart-factory">스마트팩토리 (제조 공정)</option>
                    <option value="defense">디펜스 (국방 보안망)</option>
                    <option value="healthcare">헬스케어 (의료 EMR)</option>
                    <option value="smart-building">스마트빌딩 (통합관제)</option>
                    <option value="smart-farm">스마트팜 (독립 서버)</option>
                    <option value="smart-home">스마트홈 (사설 서버)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3.5 bg-[#E8620A] hover:bg-[#d15606] text-white font-bold rounded-md text-xs transition-all flex items-center justify-center gap-1.5 shadow-md min-h-[48px]"
                >
                  <span>다음 단계로 이동</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* STEP 2 Fields */}
              <div className={step === 2 ? 'space-y-4 block' : 'hidden'}>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">직급 / 담당 업무</label>
                  <input
                    type="text"
                    name="role"
                    placeholder="예: CTO, CIO, 공장장, 시설관리자"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8620A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">주요 페인포인트</label>
                  <input
                    type="text"
                    name="pain_point"
                    placeholder="예: API 토큰 과금 상승, 데이터 유출 위험 등"
                    value={formData.pain_point}
                    onChange={(e) => setFormData({ ...formData, pain_point: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8620A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-300">현재 인프라 및 핵심 요구사항</label>
                  <textarea
                    name="infra"
                    rows={3}
                    placeholder="예: CCTV ONVIF 연동 필요, 망분리 랙서버 세팅 검토 등"
                    value={formData.infra}
                    onChange={(e) => setFormData({ ...formData, infra: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8620A]"
                  />
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                    <input
                      type="checkbox"
                      name="privacyAgree"
                      checked={formData.privacyAgree}
                      onChange={(e) => setFormData({ ...formData, privacyAgree: e.target.checked })}
                      className="accent-[#E8620A] w-4 h-4"
                    />
                    <span>[필수] 개인정보 수집 및 이용 동의</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-md text-xs"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3.5 bg-[#E8620A] hover:bg-[#d15606] text-white font-bold rounded-md text-xs transition-all flex items-center justify-center gap-1.5 min-h-[48px] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? '전송 중...' : 'PoC 신청 제출하기'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
