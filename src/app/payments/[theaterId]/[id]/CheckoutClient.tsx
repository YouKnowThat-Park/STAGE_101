'use client';

import { loadTossPayments, TossPaymentsInstance } from '@tosspayments/payment-sdk';
import { useEffect, useState } from 'react';
import { useUserHook } from '@/hooks/useUserHook';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CheckoutClientProps {
  userId: string;
  seatIds: string[];
  theaterId: string;
  totalPrice: number;
}

export default function CheckoutClient({
  userId,
  seatIds,
  theaterId,
  totalPrice,
}: CheckoutClientProps) {
  const { name, phone, isLoading } = useUserHook(userId);
  const [tossPayments, setTossPayments] = useState<TossPaymentsInstance | null>(null);

  useEffect(() => {
    async function initTossPayments() {
      try {
        const toss = await loadTossPayments(CLIENT_KEY); // ✅ 올바르게 SDK 로드
        setTossPayments(toss);
      } catch (error) {
        console.error('❌ TossPayments 로드 실패:', error);
      }
    }
    initTossPayments();
  }, []);

  if (isLoading) return <p className="text-white">로딩 중...</p>;

  const handleTossPayment = async () => {
    if (!tossPayments) {
      console.error('🚨 토스 결제 모듈이 로드되지 않았습니다.');
      return;
    }

    try {
      console.log('✅ 요청된 결제 정보:', {
        amount: totalPrice,
        orderId: `order-${Date.now()}`,
        orderName: `영화 티켓 (${seatIds.length}석)`,
        successUrl: `${API_URL}/payment/success`,
        failUrl: `${API_URL}/payment/fail`,
        customerName: name,
        customerMobilePhone: phone,
      });

      // ✅ requestPayment() 호출
      await tossPayments.requestPayment('카드', {
        amount: totalPrice,
        orderId: `order-${Date.now()}`,
        orderName: `영화 티켓 (${seatIds.length}석)`,
        successUrl: `${API_URL}/payment/success`,
        failUrl: `${API_URL}/payment/fail`,
        customerName: name,
        customerMobilePhone: phone,
      });
    } catch (error) {
      console.error('🚨 결제 실패:', error);
    }
  };

  return (
    <div className="text-white text-center p-6">
      <h1 className="text-2xl font-bold">결제 페이지</h1>
      <p className="mt-4">선택한 좌석: {seatIds.join(', ')}</p>
      <p className="mt-2">총 가격: {totalPrice.toLocaleString()}원</p>

      <button
        onClick={handleTossPayment}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md text-white font-bold mt-6"
      >
        토스로 결제하기
      </button>
    </div>
  );
}
