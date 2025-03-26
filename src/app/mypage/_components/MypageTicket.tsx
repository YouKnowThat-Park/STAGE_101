'use client';

import { useTicketHistory } from '@/hooks/useTicketHistory';
import { useUserStore } from '@/store/userStore';
import NoTicketIcon from '@/ui/icon/NoTicketIcon';
import Image from 'next/image';
import { useState } from 'react';

// ✅ 'HH:mm' 형식으로 변환
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const MypageTicket = () => {
  const userId = useUserStore((state) => state.id);
  const { data: history, refetchHistory } = useTicketHistory(userId ?? '');
  const [loading, setLoading] = useState(false);

  const cancelReservation = async (reservationId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/reviews/delete-review', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_id: reservationId }),
      });

      if (!response.ok) throw new Error('예약 취소 실패');
      await refetchHistory();
      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error(error);
      alert('예약 취소 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center bg-white h-[500px] gap-5">
      {!history || history.length === 0 ? (
        <div className="flex flex-col items-center mt-8">
          <NoTicketIcon />
          <p>No tickets booked.</p>
        </div>
      ) : (
        <div className="w-full max-w-lg h-[480px] p-5 max-[431px]:p-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-4">
            {history.map((ticket) => (
              <li key={ticket.id} className="p-4 bg-white rounded-lg border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <h2 className="text-2xl font-black border-b border-black pb-1">STAGE_101</h2>
                    <p className="font-black text-lg mt-1">{ticket.theater_name}</p>

                    <div className="flex justify-between items-center mt-2 max-[431px]:flex-col max-[431px]:items-start">
                      {/* 📌 세로 텍스트 (모바일 전용) */}
                      <div className="hidden max-[431px]:flex flex-row text-xs leading-[12px] whitespace-pre-wrap font-bold text-gray-700 text-center items-start gap-10">
                        {/* 가로로 정렬된 항목 */}
                        <div className="flex flex-col items-center gap-2">
                          <p>봤던날짜</p>
                          <p>{ticket.type}</p>
                          <p>{ticket.seat_number}</p>
                        </div>

                        {/* QR 코드 */}
                        <span className="flex-shrink-0">
                          <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${ticket.qr_token}`}
                            alt="QR Code"
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px]"
                          />
                        </span>
                      </div>

                      {/* 📌 가로 텍스트 (PC 전용) */}
                      <div className="flex gap-4 text-sm justify-center items-center mt-1 font-black max-[431px]:hidden">
                        <p>봤던 날짜</p>
                        <p>{ticket.type}</p>
                        <p>{ticket.seat_number}</p>
                      </div>

                      {/* QR 코드 */}
                      <div className="flex justify-center mt-2 max-[431px]:hidden">
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${ticket.qr_token}`}
                          alt="QR Code"
                          width={60}
                          height={60}
                          className="border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 우측 썸네일 이미지 */}
                  <Image
                    src={ticket.main_img}
                    alt="theaterImg"
                    height={100}
                    width={100}
                    className="border border-black max-[431px]:w-[60px] max-[431px]:h-[60px] object-cover"
                  />
                </div>

                <div className="flex flex-wrap gap-2 text-xs mt-3 justify-between items-center">
                  <div>
                    <p>✅ 결제 금액: {ticket.total_price.toLocaleString()}원</p>
                    <p>✅ 결제 시간: {formatTime(ticket.created_at)}</p>
                  </div>
                  <button
                    className="text-xs text-red-500"
                    onClick={() => cancelReservation(ticket.id)}
                    disabled={loading}
                  >
                    {loading ? '취소 중...' : '취소 하기'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default MypageTicket;
