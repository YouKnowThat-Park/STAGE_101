'use client';

import { useTicketHistory } from '../../../hooks/useTicketHistory';
import { useUserStore } from '../../../store/userStore';
import NoTicketIcon from '../../../ui/icon/NoTicketIcon';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const MypageTicket = () => {
  const userId = useUserStore((state) => state.id);
  const {
    data: history,
    refetchHistory,
    isLoading: loadingTickets,
  } = useTicketHistory(userId ?? '');
  const [loadingCancel, setLoadingCancel] = useState(false);

  const cancelReservation = async (reservationId: string) => {
    setLoadingCancel(true);
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
      setLoadingCancel(false);
    }
  };

  return (
    <section className="flex flex-col items-center bg-white h-[500px] gap-5">
      {loadingTickets ? (
        // ✅ Skeleton UI
        <div className="w-full max-w-lg h-[480px] p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="p-4 bg-white rounded-lg border border-gray-300 animate-pulse flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-300 rounded w-1/3" />
                    <div className="h-5 bg-gray-300 rounded w-1/2" />
                    <div className="flex gap-4 mt-2">
                      <div className="h-4 bg-gray-300 rounded w-20" />
                      <div className="h-4 bg-gray-300 rounded w-20" />
                      <div className="h-4 bg-gray-300 rounded w-10" />
                    </div>
                  </div>
                  <div className="w-[100px] h-[100px] bg-gray-300 rounded-lg" />
                </div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <div className="h-3 w-1/2 bg-gray-300 rounded" />
                  <div className="h-3 w-20 bg-gray-300 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : !history || history.length === 0 ? (
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
                      <div className="hidden max-[431px]:flex flex-row text-xs leading-[12px] whitespace-pre-wrap font-bold text-gray-700 text-center items-start gap-10">
                        <div className="flex flex-col items-center gap-2">
                          <p>{ticket.type}</p>
                          <p>{ticket.seat_number}</p>
                        </div>
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

                      <div className="flex gap-4 text-sm justify-center items-center mt-1 font-black max-[431px]:hidden">
                        <div className="text-[10px]">
                          <p>{ticket.start_date}</p>
                          <p className="ml-7">~</p>
                          <p>{ticket.end_date}</p>
                        </div>

                        <p>{ticket.type}</p>
                        <p>{ticket.seat_number}</p>
                      </div>

                      <div className="flex justify-center mt-2 md:mr-10 max-[431px]:hidden">
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

                  <Image
                    src={ticket.main_img}
                    alt="theaterImg"
                    height={100}
                    width={100}
                    className="border border-black max-[431px]:w-[60px] max-[431px]:h-[60px] object-cover"
                  />
                </div>

                <div className="flex flex-wrap gap-2 text-xs mt-3 justify-between items-center">
                  <div className="flex gap-2">
                    <p>✅ 결제 금액: {ticket.total_price.toLocaleString()}원</p>
                    <p>✅ 결제 시간: {formatTime(ticket.created_at)}</p>
                  </div>
                  <button
                    className="text-xs text-red-500"
                    onClick={() => cancelReservation(ticket.id)}
                    disabled={loadingCancel}
                  >
                    {loadingCancel ? '취소 중...' : '취소 하기'}
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
