'use client';

import { loadTossPayments, TossPaymentsInstance } from '@tosspayments/payment-sdk';
import { useEffect, useState } from 'react';
import { useUserHook } from '../../../../hooks/user/useUserHook';
import { v4 as uuidv4 } from 'uuid';
import { useTheaterData } from '../../../../hooks/theater/useTheaterData';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin; // 예: http://localhost:3000
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'; // SSR fallback
};

interface CheckoutClientProps {
  userId: string;
  seatIds: string[];
  theaterId: string;
  totalPrice: number;
  viewed_at: string;
  show_time: string;
  reservationId: string;
}

export default function CheckoutClient({
  userId,
  seatIds,
  theaterId,
  totalPrice,
  viewed_at,
  show_time,
  reservationId,
}: CheckoutClientProps) {
  const { data: userData, isLoading } = useUserHook();
  const { data: theaterData } = useTheaterData(theaterId);

  const [tossPayments, setTossPayments] = useState<TossPaymentsInstance | null>(null);
  const [viewedAt, setViewedAt] = useState(viewed_at);
  const [showTime, setShowTime] = useState(show_time);

  useEffect(() => {
    if (viewed_at) setViewedAt(viewed_at);
    if (show_time) setShowTime(show_time);
  }, [viewed_at, show_time]);

  useEffect(() => {
    async function initTossPayments() {
      if (!CLIENT_KEY) {
        return;
      }

      try {
        const toss = await loadTossPayments(CLIENT_KEY);
        setTossPayments(toss);
      } catch (error) {
        console.error('❌ TossPayments 로드 실패:', error);
      }
    }

    initTossPayments();
  }, []);

  const handleTossPayment = async () => {
    if (!tossPayments) {
      console.error('🚨 토스 결제 모듈이 로드되지 않았습니다.');
      return;
    }

    try {
      const orderId = uuidv4();
      const theaterName = theaterData?.name || '이름 없음';
      const showTime = theaterData?.show_time || '시간대 없음';
      const baseUrl = getBaseUrl();

      const userName = encodeURIComponent(userData?.name ?? '');
      const userPhone = encodeURIComponent(userData?.phone ?? '');
      const successUrl = `${baseUrl}/payments/success?reservationId=${reservationId}&userId=${userId}&orderId=${orderId}&amount=${totalPrice}&userName=${userName}&userPhone=${userPhone}&theaterName=${encodeURIComponent(theaterName)}&showTime=${encodeURIComponent(showTime)}`;
      const failUrl = `${baseUrl}/payment/fail`;

      await tossPayments.requestPayment('카드', {
        amount: totalPrice,
        orderId,
        orderName: `영화 티켓 (${seatIds.length}석)`,
        successUrl,
        failUrl,
      });
    } catch (error) {
      console.error('🚨 결제 실패:', error);
    }
  };

  return (
    <div className="flex justify-center items-center py-24 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🎫 결제 페이지</h2>

        <div className="space-y-3 text-gray-700 text-sm">
          <p>
            <span className="font-medium text-gray-900">공연명:</span>{' '}
            {theaterData?.name || '제목 없음'}
          </p>
          <p>
            <span className="font-medium text-gray-900">상영 시간:</span> {theaterData?.show_time}
          </p>
          <p>
            <span className="font-medium text-gray-900">선택 좌석:</span>{' '}
            {seatIds.join(', ') || '없음'}
          </p>
          <p>
            <span className="font-medium text-gray-900">예매자:</span> {userData?.name}
          </p>
          <p>
            <span className="font-medium text-gray-900">연락처:</span>{' '}
            {formatPhoneNumber(userData?.phone)}
          </p>
          <p className="text-lg font-bold text-right mt-4">
            총 결제 금액: <span className="text-blue-600">{totalPrice.toLocaleString()}원</span>
          </p>
        </div>

        <button
          onClick={handleTossPayment}
          className="w-full mt-6 py-3 rounded-md text-white bg-blue-500 hover:bg-blue-600 font-semibold transition"
        >
          토스로 결제하기
        </button>
      </div>
    </div>
  );
}
