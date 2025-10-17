'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasCheckedAccess = useRef(false);

  useEffect(() => {
    if (hasCheckedAccess.current) return;
    hasCheckedAccess.current = true;

    const timeout = setTimeout(() => {
      const pathname = window.location.pathname;

      // ✅ 결제 완료 페이지는 접근 차단 안 함 (토스 리다이렉트 대응)
      if (pathname === '/payments/success') {
        return;
      }

      const allowed = sessionStorage.getItem('allowPaymentsAccess');
      const paymentDone = sessionStorage.getItem('paymentDone');

      if (paymentDone === 'true') {
        alert('이미 결제가 완료된 세션입니다.');
        router.replace('/');
        return;
      }

      if (allowed !== 'true') {
        alert('잘못된 접근입니다.');
        router.replace('/');
        return;
      }

      sessionStorage.removeItem('allowPaymentsAccess');
    }, 10); // 약간 지연시킴: sessionStorage 준비 타이밍 대응

    return () => clearTimeout(timeout);
  }, [router]);

  return <>{children}</>;
}
