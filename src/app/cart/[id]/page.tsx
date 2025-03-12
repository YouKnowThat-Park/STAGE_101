'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CartSuccessPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const orderId = params.id; // ✅ 동적 라우트로 받은 주문 ID

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-500">✅ 결제가 완료되었습니다!</h1>
      <p className="text-lg text-gray-700 mt-2">주문번호: {orderId}</p>
      <p className="text-lg text-gray-700">메인 페이지로 이동합니다...</p>
      <button
        onClick={() => router.push('/')}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        홈으로 이동
      </button>
    </div>
  );
};

export default CartSuccessPage;
