'use client';

import { loadTossPayments, TossPaymentsInstance } from '@tosspayments/payment-sdk';
import { useEffect, useState } from 'react';
import { useUserHook } from '../../../../hooks/user/useUserHook';
import { v4 as uuidv4 } from 'uuid';
import { useTheaterData } from '../../../../hooks/theater/useTheaterData';
import { formatPhoneNumber } from 'src/utils/formatPhoneNumber';
import Image from 'next/image';
import { useUserStore } from 'src/store/userStore';

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
  main_img?: string;
}

export default function CheckoutClient({
  userId,
  seatIds,
  theaterId,
  totalPrice,
  viewed_at,
  show_time,
  reservationId,
  main_img,
}: CheckoutClientProps) {
  const { name, phone } = useUserStore();
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

      const userName = encodeURIComponent(name ?? '');
      const userPhone = encodeURIComponent(phone ?? '');
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
    <section className="w-full min-h-[calc(100vh-120px)] bg-black text-white py-20 px-4">
      {/* 배경 포인트 */}
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent shadow-[0_0_40px_rgba(255,255,255,0.06)]">
          {/* 상단 라벨 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-amber-400" />
              <p className="text-sm tracking-wide text-white/80">STAGE_101 · CHECKOUT</p>
            </div>
            <p className="text-xs text-white/50">Secure Payment (Test)</p>
          </div>

          {/* 본문 */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 p-6 md:p-8">
            {/* 좌측: 결제 정보 카드 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">🎫 결제 페이지</h2>
              <p className="mt-1 text-sm text-white/60">
                선택한 좌석/상영 정보를 확인하고 결제를 진행하세요.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">공연명</span>
                  <span className="font-medium text-white text-right">
                    {theaterData?.name || '제목 없음'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">상영 시간</span>
                  <span className="font-medium text-white">{theaterData?.show_time || '-'}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">선택 좌석</span>
                  <span className="font-medium text-white text-right">
                    {seatIds?.length ? seatIds.join(', ') : '없음'}
                  </span>
                </div>

                <div className="h-px bg-white/10 my-2" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">예매자</span>
                  <span className="font-medium text-white">{name || '정보 없음'}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-white/70">연락처</span>
                  <span className="font-medium text-white">
                    {phone ? formatPhoneNumber(phone) : '정보 없음'}
                  </span>
                </div>

                <div className="mt-5 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">총 결제 금액</span>
                    <span className="text-lg font-bold text-amber-300">
                      {totalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleTossPayment}
                  className="mt-4 w-full rounded-md bg-amber-400/90 hover:bg-amber-400 text-black font-semibold py-3 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!tossPayments}
                  title={!tossPayments ? '결제 모듈 로딩 중...' : '결제 진행'}
                >
                  {tossPayments ? '토스로 결제하기' : '결제 모듈 로딩 중...'}
                </button>

                <p className="mt-3 text-xs text-white/45 leading-relaxed">
                  결제 버튼을 누르면 토스 결제창으로 이동합니다.
                </p>
              </div>
            </div>

            {/* 우측: 포스터 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/60 mb-3">POSTER</p>

              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-black">
                <Image
                  src={(theaterData?.main_img ?? main_img) || '/default.png'}
                  alt="공연 포스터"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 320px"
                  priority
                />
              </div>

              <p className="mt-3 text-xs text-white/50">
                이미지/공연 정보는 포트폴리오 데모용입니다.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ 섹션 밑 문구 추가 */}
        <p className="mt-6 text-center text-xs text-white/50">
          ※ 본 결제는 <span className="text-amber-300 font-medium">가상의 테스트 결제</span>이며,
          실제 결제가 발생하지 않는 포트폴리오 데모입니다.
        </p>
      </div>
    </section>
  );
}
