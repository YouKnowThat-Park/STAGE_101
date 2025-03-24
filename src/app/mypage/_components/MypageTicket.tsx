import { useTicketHistory } from '@/hooks/useTicketHistory';
import { useUserStore } from '@/store/userStore';
import NoTicketIcon from '@/ui/icon/NoTicketIcon';
import Image from 'next/image';
import React, { useState } from 'react';

// ✅ 'HH:mm' 형식으로 변환하는 함수
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const MypageTicket = () => {
  const userId = useUserStore((state) => state.id);
  const { data: history, refetchHistory } = useTicketHistory(userId ?? ''); // refetchHistory 가져오기
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const cancelReservation = async (reservationId: string) => {
    setLoading(true); // 로딩 상태 활성화
    try {
      const response = await fetch('/api/reviews/delete-review', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_id: reservationId }),
      });

      if (!response.ok) throw new Error('예약 취소 실패');

      // 예약 취소 후 목록을 새로고침
      await refetchHistory(); // 데이터 갱신
      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error(error);
      alert('예약 취소 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  return (
    <section className="flex flex-col  items-center bg-white h-[500px] gap-5">
      {!history || history.length === 0 ? (
        // ✅ 예약 내역이 없을 때
        <div className="flex flex-col items-center">
          <NoTicketIcon />
          <p>No tickets booked.</p>
        </div>
      ) : (
        // ✅ 예약 내역이 있을 때
        <div className="w-full max-w-lg h-[480px] p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-4">
            {history.map((ticket) => (
              <li key={ticket.id} className="p-4 bg-white rounded-lg border border-gray-700 ">
                {/* ✅ STAGE_101 & 이미지 한 줄 정렬 */}
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <h2 className=" text-2xl font-black border-b border-black pb-1">STAGE_101</h2>
                    {/* ✅ 영화 제목을 h2 바로 아래 배치 */}
                    <p className="font-black text-lg mt-1">{ticket.theater_name}</p>
                    <div className="flex gap-5 text-sm justify-center items-center mt-1 font-black">
                      <p>봤던 날짜</p>
                      <p>{ticket.type}</p>
                      <p>{ticket.seat_number}</p>
                      <div className="flex justify-center mt-3">
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${ticket.qr_token}`}
                          alt="QR Code"
                          className="w-12 h-12"
                          height={50}
                          width={50}
                          style={{ width: '50px', height: '50px' }}
                        />
                      </div>
                    </div>
                  </div>
                  <Image
                    src={ticket.main_img}
                    alt="theaterImg"
                    height={100}
                    width={100}
                    className="border border-black"
                  />
                </div>

                <div className="flex gap-2 text-xs mt-3">
                  <p>✅ 결제 금액: {ticket.total_price}원</p>
                  <p>✅ 결제 시간: {formatTime(ticket.created_at)}</p>
                  <button
                    className="text-xs text-red-500 ml-[100px] mt-1"
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
