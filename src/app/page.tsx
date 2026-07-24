import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import DataSovereignty from '@/components/home/DataSovereignty';
import ZeroTokenFee from '@/components/home/ZeroTokenFee';
import LegacyIntegration from '@/components/home/LegacyIntegration';
import CustomerReferences from '@/components/home/CustomerReferences';
import ContactForm from '@/components/home/ContactForm';

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <DataSovereignty />
      <ZeroTokenFee />
      <LegacyIntegration />
      <CustomerReferences />
      <ContactForm />
    </div>
  );
}
