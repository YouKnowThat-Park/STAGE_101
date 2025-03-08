'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const formatPhoneNumber = (phone: string | null) => {
  if (!phone) return '정보 없음';

  // 숫자만 추출
  const digits = phone.replace(/\D/g, '');

  // 10자리 또는 11자리 번호만 처리
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}**-${digits.slice(7, 9)}**`; // ✅ 010-00**-00**
  } else if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}**-${digits.slice(8, 10)}**`; // ✅ 010-00**-00**
  } else {
    return '유효하지 않은 번호'; // 예외 처리
  }
};

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const userName = searchParams.get('userName');
  const userPhone = searchParams.get('userPhone');
  const seatNumbers = searchParams.get('seatNumbers')?.split(',') || []; // ✅ 좌석 정보 추가
  const reservationId = searchParams.get('reservationId');
  const paymentKey = searchParams.get('paymentKey');
  const userId = searchParams.get('userId');
  const theaterName = searchParams.get('theaterName');
  const showTime = searchParams.get('showTime');

  // ✅ 추가된 부분: qrToken을 상태로 관리
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false); // ✅ 중복 실행 방지

  useEffect(() => {
    async function confirmPayment() {
      if (!orderId || !reservationId || !amount || isConfirmed) return; // ✅ 중복 실행 방지

      try {
        // ✅ 결제 기록이 이미 존재하는지 확인
        const checkRes = await fetch(
          `/api/payment/success?reservationId=${reservationId}&userId=${userId}`,
        );
        const checkData = await checkRes.json();

        if (checkData.success && checkData.payment) {
          console.log('✅ 이미 결제된 예약입니다. 중복 요청 안 함.');
          setIsConfirmed(true);
          setQrToken(checkData.payment.qr_token);
          return;
        }

        // ✅ 결제 확인 요청 (처음 실행 시)
        const res = await fetch('/api/payment/success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, reservationId, amount, paymentKey, userId }),
        });

        const result = await res.json();
        if (!result.success) {
          console.error('🚨 결제 확인 실패:', result.error);
        } else {
          setIsConfirmed(true);
          setQrToken(result.qr_token);
        }
      } catch (error) {
        console.error('🚨 결제 확인 오류:', error);
      }
    }

    confirmPayment();
  }, [orderId, reservationId, amount, isConfirmed]);

  return (
    <div className="flex justify-center items-center h-screen">
      {/* 🎟️ 가로형 티켓 */}
      <div className="bg-white rounded-lg shadow-lg w-[600px] flex">
        {/* 🎟️ 왼쪽 (결제 완료) */}
        <div className="bg-red-500 text-white w-1/3 flex flex-col justify-center items-center rounded-l-lg p-4">
          <p className="text-xl font-bold">🎟️ 티켓</p>
        </div>

        {/* 🎟️ 오른쪽 (구매자 & 결제 정보) */}
        <div className="p-6 flex-1">
          <div className="flex gap-5 items-center">
            <p className="text-lg font-semibold">{userName}</p>
            <p className="text-lg font-semibold">{formatPhoneNumber(userPhone)}</p>
          </div>
          <p>{theaterName}</p>
          <p>{showTime}</p>
          <p className="text-gray-700 text-sm mt-3">💺 좌석:</p>
          <p className="text-lg font-semibold">
            {seatNumbers.length > 0 ? seatNumbers.join(', ') : '좌석 정보 없음'}
          </p>

          <p className="text-gray-700 text-sm mt-2">🛒 주문 번호:</p>
          <p className="text-[13px] font-semibold">{orderId}</p>

          <p className="text-gray-700 text-sm mt-2">💰 결제 금액:</p>
          <p className="text-lg font-semibold">{amount}원</p>

          {/* ✅ QR 코드 표시 */}
          {qrToken ? (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrToken}`}
              alt="QR Code"
              className="w-24 h-24 mt-4"
            />
          ) : (
            <p className="text-gray-500 mt-4">QR 코드 생성 중...</p>
          )}

          <a href="/" className="text-blue-500 font-bold hover:underline text-sm mt-4 inline-block">
            홈으로 이동
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
