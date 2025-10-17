'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CartSuccessPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const orderId = params.id;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center space-y-6">
        {/* ✅ 이모지 아이콘 */}
        <div className="text-5xl">✅</div>

        <h1 className="text-2xl font-bold text-gray-800">결제가 완료되었습니다!</h1>

        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <span className="font-medium text-gray-800">주문번호:</span>{' '}
            <span className="font-mono text-blue-600 break-all">{orderId}</span>
          </p>
          <p>10초 후 메인 페이지로 자동 이동합니다.</p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          홈으로 즉시 이동
        </button>
      </div>
    </div>
  );
};

export default CartSuccessPage;
