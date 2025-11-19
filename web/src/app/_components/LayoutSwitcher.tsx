'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../Header';
import Footer from '../Footer';
import QrLayout from '../qr_session/QrLayout';
import { LayoutSwitcherProps } from 'src/types/common/common-type';

export default function LayoutSwitcher({ children, user }: LayoutSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  //  qr_session 쪽에서는 "QR 전용 레이아웃"만 사용
  if (pathname.startsWith('/qr_session')) {
    return <QrLayout>{children}</QrLayout>;
  }

  //  나머지 경로에서는 기존 루트 레이아웃 구조 유지
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
      <Header user={user} />
      {children}
      <Footer />
    </div>
  );
}
