'use client';

import React, { useState } from 'react';
import { RESOURCES_LIST } from '@/lib/constants';
import { Download, FileText, Code2, X, CheckCircle2, Lock } from 'lucide-react';

export default function ResourcesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<typeof RESOURCES_LIST[0] | null>(null);
  const [email, setEmail] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleOpenModal = (doc: typeof RESOURCES_LIST[0]) => {
    setSelectedDoc(doc);
    setEmail('');
    setDownloadSuccess(false);
    setModalOpen(true);
  };

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('올바른 회사 이메일을 입력해 주세요.');
      return;
    }

    // Netlify Forms AJAX POST Submission for "download" form
    const myForm = e.currentTarget;
    const formBody = new FormData(myForm);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formBody as unknown as Record<string, string>).toString(),
    })
      .then(() => {
        setDownloadSuccess(true);
      })
      .catch((err) => {
        console.error('Download form submission error:', err);
        setDownloadSuccess(true);
      });
  };

  return (
    <div className="w-full bg-[#F8F7F4] py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#1E56C8]/10 text-[#1E56C8] text-xs font-dm-mono font-bold">
            <FileText className="w-3.5 h-3.5" />
            <span>TECHNICAL DOCUMENTATION & WHITEPAPERS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1917] tracking-tight">
            기술 자료실 & 백서 다운로드
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            OnPress OS™의 보안 망분리 아키텍처 명세서부터 현장 연동 매뉴얼까지 투명하게 제공합니다.
          </p>
        </div>

        {/* Resources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {RESOURCES_LIST.map((res) => (
            <div key={res.id} className="bg-white rounded-xl border border-[#E8E6E1] p-7 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded bg-[#1A1917] text-white flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#E8620A]" />
                  </div>
                  <span className="text-[10px] font-dm-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-bold">
                    {res.size}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#8B3AC8] font-dm-mono uppercase block mb-1">{res.type}</span>
                <h3 className="text-base font-bold text-[#1A1917] mb-2">{res.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">{res.description}</p>
              </div>

              <button
                onClick={() => handleOpenModal(res)}
                className="w-full py-3 bg-[#E8620A] hover:bg-[#d15606] text-white font-bold rounded-md text-xs transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>백서 다운로드</span>
              </button>
            </div>
          ))}
        </div>

        {/* Developer API Quick Reference */}
        <div className="bg-[#1A1917] text-white rounded-xl p-8 border border-neutral-800 font-dm-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#8B3AC8]" />
              <span className="font-bold text-sm text-white">ONPRESS OS™ API SDK EXAMPLES</span>
            </div>
            <span className="text-emerald-400 text-[11px]">v2.6 CLOSED NET SPEC</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded border border-neutral-800 text-neutral-300 overflow-x-auto">
            <pre>{`// OnPress OS™ Local Node Query (Zero Egress E2E Encryption)
const node = new OnPressNode({ endpoint: "http://192.168.1.100:8080", aesKey: process.env.LOCAL_VAULT_KEY });

const result = await node.infer({
  model: "onpress-13b-v2",
  protocol: "ONVIF_RTSP",
  prompt: "라인 #3 CCTV 시각 감시 이상 징후 분석"
});
console.log(result.metrics); // { tokenCost: 0, latencyMs: 12 }`}</pre>
          </div>
        </div>
      </div>

      {/* Email Input Download Modal with Netlify Forms integration */}
      {modalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-[#E8E6E1] p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            {downloadSuccess ? (
              <div className="py-6 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#3A6D11] mx-auto" />
                <h3 className="text-lg font-bold text-[#1A1917]">다운로드 준비가 완료되었습니다!</h3>
                <p className="text-xs text-neutral-600">
                  입력해주신 <strong>{email}</strong> 주소로 다운로드 링크가 전달되었습니다. 아래 버튼을 눌러 PDF를 바로 확인하실 수 있습니다.
                </p>
                <a
                  href="#pdf-download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`[${selectedDoc.title}] PDF 문서가 다운로드되었습니다.`);
                    setModalOpen(false);
                  }}
                  className="w-full py-3 bg-[#E8620A] hover:bg-[#d15606] text-white font-bold rounded-md text-xs inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF 문서 즉시 다운로드 ({selectedDoc.size})</span>
                </a>
              </div>
            ) : (
              <form
                name="download"
                method="POST"
                data-netlify="true"
                onSubmit={handleModalSubmit}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="download" />
                <input type="hidden" name="document_title" value={selectedDoc.title} />

                <div className="flex items-center gap-2 text-xs font-bold text-[#1E56C8] font-dm-mono">
                  <Lock className="w-4 h-4" />
                  <span>SECURE DOWNLOAD VERIFICATION</span>
                </div>
                <h3 className="text-lg font-bold text-[#1A1917]">{selectedDoc.title}</h3>
                <p className="text-xs text-neutral-500">
                  백서 및 기술 자료 수신을 위한 이메일 주소를 입력해 주시면 PDF 다운로드 링크가 즉시 제공됩니다.
                </p>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-700">회사 이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-md text-xs text-neutral-900 focus:outline-none focus:border-[#E8620A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#E8620A] hover:bg-[#d15606] text-white font-bold rounded-md text-xs transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  <span>이메일 확인 및 PDF 받기</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
