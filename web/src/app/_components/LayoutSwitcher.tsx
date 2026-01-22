'use client';

import React, { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../Header';
import Footer from '../Footer';
import QrLayout from '../qr_session/QrLayout';
import { LayoutSwitcherProps } from 'src/types/common/common-type';
import Loading from '../loading';

export default function LayoutSwitcher({ children, user }: LayoutSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  //  qr_session 쪽에서는 "QR 전용 레이아웃"만 사용
  if (pathname.startsWith('/qr_session')) {
    return <QrLayout>{children}</QrLayout>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />

      <main className="flex-1 relative">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>

      <Footer />
    </div>
  );
}
