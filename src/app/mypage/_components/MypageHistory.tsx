import { useUserStore } from '@/store/userStore';
import { CartHistory } from '@/types/cart-history-type';
import NoHistoryIcon from '@/ui/icon/NoHistoryIcon';
import React, { useEffect, useState } from 'react';

const MypageHistory = () => {
  const [history, setHistory] = useState<CartHistory[]>([]);
  const userId = useUserStore((state) => state.id);

  useEffect(() => {
    if (!userId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/cart/history?userId=${userId}`);
        const data = await res.json();

        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error('❌ 거래 내역 불러오기 실패:', error);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <section className="flex flex-col  items-center bg-white h-[500px] gap-5">
      {history.length === 0 ? (
        <>
          <div className="flex flex-col items-center">
            <NoHistoryIcon />
            <p>거래 내역이 없습니다.</p>
          </div>
        </>
      ) : (
        <div className="">
          {/* ✅ 높이 제한 & 내부 스크롤 추가 */}
          <div className="w-full max-w-lg p-5 rounded-lg shadow-md border bg-[#151515] border-black h-[480px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <h2 className="text-2xl font-bold text-white mb-4">My History</h2>
            <ul className="space-y-4">
              {history.map((item, index) => (
                <li key={index} className="border p-4 rounded-lg bg-white shadow">
                  <p className="text-lg font-semibold">결제 키: {item.payment_key}</p>
                  <p className="text-sm text-gray-600">
                    구매일: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  <p>수령: {item.status ? '수령 완료' : '수령 안함'}</p>
                  <p className="text-sm">수량: {item.quantity}개</p>
                  <p className="text-sm font-bold text-gray-800">
                    총 금액: {item.total_price.toLocaleString()}원
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default MypageHistory;
