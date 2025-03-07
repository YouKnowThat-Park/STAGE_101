import Footer from '@/app/Footer';
import Header from '@/app/Header';
import React from 'react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
