'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const formatPhoneNumber = (phone: string | null) => {
  if (!phone) return '정보 없음';
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11
    ? `${digits.slice(0, 3)}-${digits.slice(3, 5)}**-${digits.slice(8, 10)}**`
    : '유효하지 않은 번호';
};

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const userName = searchParams.get('userName');
  const userPhone = searchParams.get('userPhone');
  const reservationId = searchParams.get('reservationId');
  const paymentKey = searchParams.get('paymentKey');
  const userId = searchParams.get('userId');
  const theaterName = searchParams.get('theaterName');
  const showTime = searchParams.get('showTime');

  const [qrToken, setQrToken] = useState<string | null>(null);
  const [seatNumber, setSeatNumber] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    async function confirmPayment() {
      if (!orderId || !reservationId || !amount || isConfirmed) return;

      try {
        console.log('🛠️ 결제 정보 확인 요청:', {
          orderId,
          reservationId,
          amount,
          paymentKey,
          userId,
        });

        // ✅ 기존 결제 정보 조회
        const checkRes = await fetch(
          `/api/payment/success?reservationId=${reservationId}&userId=${userId}`,
        );
        const checkData = await checkRes.json();

        console.log('✅ 기존 결제 정보 응답:', checkData);

        if (checkData.success && checkData.payment) {
          console.log('🎉 기존 결제 정보에서 QR 코드 발견:', checkData.payment.qr_token);

          if (checkData.payment.qr_token) {
            setQrToken(checkData.payment.qr_token);
            setSeatNumber(checkData.payment.reservations?.seat_number || '좌석 정보 없음');
            setIsConfirmed(true);
            return;
          }
        }

        // ✅ 기존 QR이 없을 경우, 결제 요청 진행
        console.log('🚀 새로운 결제 요청 실행');
        const res = await fetch('/api/payment/success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, reservationId, amount, paymentKey, userId }),
        });

        const result = await res.json();
        console.log('✅ 결제 요청 응답:', result);

        if (result.success) {
          console.log('🎉 결제 성공, QR 코드:', result.qr_token);

          if (result.qr_token) {
            setQrToken(result.qr_token);
          } else {
            console.warn('⚠️ QR 코드가 응답에 없음');
          }

          setSeatNumber(result.seat_number || '좌석 정보 없음');
          setIsConfirmed(true);
        } else {
          console.error('🚨 결제 확인 실패:', result.error);
        }
      } catch (error) {
        console.error('🚨 결제 확인 오류:', error);
      }
    }

    confirmPayment();
  }, [orderId, reservationId, amount, paymentKey, userId, isConfirmed]);

  useEffect(() => {
    console.log('📢 현재 qrToken 상태 업데이트:', qrToken);
  }, [qrToken]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-lg w-[600px] flex">
        <div className="bg-red-500 text-white w-1/3 flex flex-col justify-center items-center rounded-l-lg p-4">
          <p className="text-xl font-bold">🎟️ 티켓</p>
        </div>

        <div className="p-6 flex-1">
          <div className="flex gap-5 items-center">
            <p className="text-lg font-semibold">{userName}</p>
            <p className="text-lg font-semibold">{formatPhoneNumber(userPhone)}</p>
          </div>
          <p>{theaterName}</p>
          <p>{showTime}</p>
          <p className="text-gray-700 text-sm mt-3">💺 좌석:</p>
          <p className="text-lg font-semibold">{seatNumber || '좌석 정보 없음'}</p>

          <p className="text-gray-700 text-sm mt-2">🛒 주문 번호:</p>
          <p className="text-[13px] font-semibold">{orderId}</p>

          <p className="text-gray-700 text-sm mt-2">💰 결제 금액:</p>
          <p className="text-lg font-semibold">{amount}원</p>

          {qrToken ? (
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrToken}`}
              alt="QR Code"
              width={24}
              height={24}
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
