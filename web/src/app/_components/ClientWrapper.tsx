import Footer from '../Footer';
import Header from '../Header';
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
