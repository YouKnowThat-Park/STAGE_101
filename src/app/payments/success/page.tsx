'use client';

import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const formatPhoneNumber = (phone: string | null) => {
  if (!phone) return '정보 없음';
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11
    ? `${digits.slice(0, 3)}-${digits.slice(3, 4)}**-${digits.slice(7, 9)}**`
    : '유효하지 않은 번호';
};

const PaymentSuccessPage = () => {
  const router = useRouter();
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
  const [accessAllowed, setAccessAllowed] = useState<boolean | null>(null);

  // ✅ 뒤로가기 차단 (popstate 감지해서 alert)
  useEffect(() => {
    const onPopState = () => {
      alert('이미 결제가 완료된 세션입니다.');
      history.pushState(null, '', location.href);
    };

    // ✅ 진짜 뒤로가기 눌렀을 때만 감지하게끔 history 조작
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // ✅ 결제 파라미터 검증 및 세션 체크
  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');

    // ❌ 완전 차단하지 않음 → 경고만 출력
    if (paymentKey === null || paymentKey === 'undefined') {
      console.warn('⚠️ paymentKey가 없지만 결제 페이지 접근 허용');
    }

    setAccessAllowed(true);
  }, [router, searchParams]);

  // ✅ 결제 확인 요청
  useEffect(() => {
    if (!accessAllowed) return;

    async function confirmPayment() {
      if (!orderId || !reservationId || !amount || isConfirmed) return;

      try {
        const checkRes = await fetch(
          `/api/payment/success?reservationId=${reservationId}&userId=${userId}`,
        );
        const checkData = await checkRes.json();

        if (checkData.success && checkData.payment?.qr_token) {
          setQrToken(checkData.payment.qr_token);
          setSeatNumber(checkData.payment.reservations?.seat_number || '좌석 정보 없음');
          setIsConfirmed(true);
          return;
        }

        const res = await fetch('/api/payment/success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, reservationId, amount, paymentKey, userId }),
        });

        const result = await res.json();

        if (result.success) {
          setQrToken(result.qr_token ?? null);
          setSeatNumber(result.seat_number || '좌석 정보 없음');
          setIsConfirmed(true);
        }
      } catch (error) {
        console.error('결제 확인 오류:', error);
      }
    }

    confirmPayment();
  }, [accessAllowed, orderId, reservationId, amount, paymentKey, userId, isConfirmed]);

  if (accessAllowed === null) return null;

  return (
    <div className="flex justify-center items-center py-14">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 relative">
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold text-black">{theaterName}</h2>
          <p className="text-sm text-gray-500">{showTime}</p>
        </div>

        <div className="flex justify-between text-sm text-gray-800">
          <p>
            <span className="text-purple-500">👤</span> {userName}
          </p>
          <p>
            <span className="text-red-500">📞</span> {formatPhoneNumber(userPhone)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
            <p className="text-gray-500 text-xs mb-1">좌석</p>
            <p className="text-base font-semibold text-indigo-600">{seatNumber}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg shadow-inner">
            <p className="text-gray-500 text-xs mb-1">결제 금액</p>
            <p className="text-base font-semibold text-blue-500">
              {Number(amount).toLocaleString()}원
            </p>
          </div>
          <div className="col-span-2 bg-gray-100 p-3 rounded-lg shadow-inner break-words">
            <p className="text-gray-500 text-xs mb-1">주문 번호</p>
            <p className="text-[13px] font-mono text-gray-700">{orderId}</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          {qrToken ? (
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrToken}`}
              alt="QR Code"
              width={150}
              height={150}
              className="rounded-md border"
            />
          ) : (
            <p className="text-gray-400">QR 코드 생성 중...</p>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="inline-block text-sm text-blue-600 font-medium hover:underline">
            홈으로 이동
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
