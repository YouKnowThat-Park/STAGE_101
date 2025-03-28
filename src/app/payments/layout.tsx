'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasCheckedAccess = useRef(false);

  useEffect(() => {
    if (hasCheckedAccess.current) return;
    hasCheckedAccess.current = true;

    // 💡 여기서 약간 지연시켜 sessionStorage 준비 기다림
    const timeout = setTimeout(() => {
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
    }, 10); // 10ms면 충분함

    return () => clearTimeout(timeout);
  }, [router]);

  return <>{children}</>;
}
