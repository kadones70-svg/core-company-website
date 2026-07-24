import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Core Company | OnPress OS™ — 온프레미스 sLLM 운영체제",
  description: "온프레미스 AI, 공간에 심다. 토큰 비용 0원·데이터 주권 100%·완전 폐쇄망 구동 엔터프라이즈 sLLM 운영체제 OnPress OS™",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F8F7F4] text-[#1A1917] font-sans selection:bg-[#E8620A]/20 selection:text-[#E8620A]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
