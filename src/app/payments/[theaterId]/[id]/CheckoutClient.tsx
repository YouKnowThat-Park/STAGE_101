'use client';

import { loadTossPayments, TossPaymentsInstance } from '@tosspayments/payment-sdk';
import { useEffect, useState } from 'react';
import { useUserHook } from '@/hooks/useUserHook';
import { v4 as uuidv4 } from 'uuid'; // ✅ UUID 라이브러리 추가
import { useTheaterData } from '@/hooks/useTheaterData';

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CheckoutClientProps {
  userId: string;
  seatIds: string[];
  theaterId: string;
  totalPrice: number;
  viewed_at: string; // ✅ 추가
  show_time: string; // ✅ 추가
}

export default function CheckoutClient({
  userId,
  seatIds,
  theaterId,
  totalPrice,
  viewed_at,
  show_time,
}: CheckoutClientProps) {
  const { name, phone, isLoading } = useUserHook(userId);
  const { data: theaterData } = useTheaterData(theaterId);

  const [tossPayments, setTossPayments] = useState<TossPaymentsInstance | null>(null);

  //테스트용 스테이트
  const [viewedAt, setViewedAt] = useState(viewed_at);
  const [showTime, setShowTime] = useState(show_time);

  useEffect(() => {
    if (viewed_at) setViewedAt(viewed_at);
    if (show_time) setShowTime(show_time);
  }, [viewed_at, show_time]); // ✅ props 값이 변경되면 상태 업데이트

  useEffect(() => {
    async function initTossPayments() {
      if (!CLIENT_KEY) {
        console.error('🚨 TOSS CLIENT KEY가 설정되지 않았습니다.');
        return;
      }

      try {
        const toss = await loadTossPayments(CLIENT_KEY); // ✅ SDK 로드
        setTossPayments(toss);
      } catch (error) {
        console.error('❌ TossPayments 로드 실패:', error);
      }
    }

    initTossPayments();
  }, [CLIENT_KEY]); // ✅ CLIENT_KEY 변경 시 다시 실행

  if (isLoading) return <p className="text-white">로딩 중...</p>;

  const createReservation = async () => {
    const formattedViewedAt = new Date(viewed_at).toISOString();
    const formattedShowTime = show_time.length === 8 ? show_time.slice(0, 5) : show_time;

    const requestData = {
      user_id: userId,
      theater_id: theaterId,
      seats: seatIds,
      total_price: totalPrice,
      viewed_at: formattedViewedAt,
      show_time: formattedShowTime, // ✅ "16:00" 형식으로 변환
    };

    try {
      const response = await fetch(`${API_URL}/api/reservation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || '예약 생성 실패');

      return data.reservationId;
    } catch (error) {
      console.error('🚨 예약 생성 실패:', error);
      return null;
    }
  };

  const handleTossPayment = async () => {
    if (!tossPayments) {
      console.error('🚨 토스 결제 모듈이 로드되지 않았습니다.');
      return;
    }

    try {
      const reservationId = await createReservation();
      if (!reservationId) {
        console.error('🚨 예약 생성 실패, 결제 진행 불가');
        return;
      }

      const orderId = uuidv4(); // ✅ UUID로 orderId 생성
      const theaterName = theaterData?.name || '이름 없음';
      const showTime = theaterData?.show_time || '시간대 없음';
      const successUrl = `${API_URL}/payments/success?reservationId=${reservationId}&userId=${userId}&orderId=${orderId}&amount=${totalPrice}&userName=${encodeURIComponent(name)}&userPhone=${encodeURIComponent(phone)}&theaterName=${encodeURIComponent(theaterName)}&showTime=${encodeURIComponent(showTime)}`;
      const failUrl = `${API_URL}/payment/fail`;

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
            <span className="font-medium text-gray-900">예매자:</span> {name}
          </p>
          <p>
            <span className="font-medium text-gray-900">연락처:</span> {phone}
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
