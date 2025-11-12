'use client';

import React from 'react';
import { useCartHistory } from 'src/hooks/cart_history/useCartHistory';
import NoHistoryIcon from '../../../ui/icon/NoHistoryIcon';
import Image from 'next/image';
import { useDeleteCartHistory } from 'src/hooks/cart_history/useDeleteCartHistory';
import HistorySkeleton from './HistorySkeleton';

const MypageHistory = () => {
  const { history, isLoading } = useCartHistory();
  const { mutate: cancelHistory } = useDeleteCartHistory();

  const handleCancel = (paymentKey: string) => {
    const targetHistory = history?.find((item) => item.payment_key === paymentKey);
    if (!targetHistory) return;

    if (targetHistory.status === 'completed') {
      alert('이미 수령된 거래는 취소할 수 없습니다.');
      return;
    }

    if (targetHistory.status === 'canceled') {
      alert('이미 취소된 거래입니다.');
      return;
    }

    if (!confirm('이 결제를 취소하시겠습니까?')) return;

    cancelHistory(targetHistory.id, {
      onSuccess: () => {
        alert('결제가 취소되었습니다.');
      },
    });
  };

  return (
    <section className="flex flex-col items-center bg-white h-[500px] gap-5">
      {isLoading ? (
        // ✅ Skeleton UI
        <HistorySkeleton />
      ) : history?.length === 0 ? (
        // ✅ 거래 내역 없음
        <div className="flex flex-col items-center mt-8">
          <NoHistoryIcon />
          <p>You have no transaction history yet.</p>
        </div>
      ) : (
        // ✅ 거래 내역 있음
        <div className="w-full max-w-lg h-[480px] p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {history?.map((cart, index) => (
            <div
              key={index}
              className="flex flex-row border p-4 rounded-lg bg-white shadow-lg gap-4 mb-2"
            >
              {/* 왼쪽 텍스트 영역 */}
              <div className="flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-1">{cart.name || '상품명 없음'}</h2>
                <hr className="border-gray-300 mb-2" />

                <div className="flex flex-col gap-1 w-full text-xs mt-2 text-gray-500">
                  <p>이 상품은 매장에서 직접 수령하는 상품입니다.</p>
                  <p>사용 기한이 있는 상품은 만료 후 교환 및 환불이 불가합니다.</p>
                  <p>모든 상품은 소비자 보호법 및 회사 정책에 따라 적용됩니다.</p>
                </div>

                <div className="flex flex-wrap justify-between items-start mt-3 gap-y-1">
                  <div className="flex flex-wrap gap-x-3 text-sm text-gray-800">
                    <span>✅ {new Date(cart.created_at).toISOString().split('T')[0]}</span>
                    <span>💰 {cart.total_price.toLocaleString()}원</span>
                    <p className="text-gray-700 text-sm">
                      {cart.status === 'pending'
                        ? '❎ 미수령'
                        : cart.status === 'completed'
                          ? '✅ 수령 완료'
                          : '⛔ 결제 취소됨'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 오른쪽 이미지 영역 */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative rounded-lg overflow-hidden border w-28 h-28 max-[420px]:w-24 max-[420px]:h-24">
                  <Image
                    src={cart.image_url || '/default-image.png'}
                    alt={cart.name || '상품 이미지'}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>

                {cart.status === 'pending' && (
                  <button
                    className="mt-2 text-red-500 text-sm border-b-2"
                    onClick={() => handleCancel(cart.payment_key)}
                  >
                    취소 하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MypageHistory;
