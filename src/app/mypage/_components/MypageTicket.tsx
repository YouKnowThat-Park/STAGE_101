import { useTicketHistory } from '@/hooks/useTicketHistory';
import { useUserStore } from '@/store/userStore';
import NoTicketIcon from '@/ui/icon/NoTicketIcon';
import Image from 'next/image';
import React from 'react';
import { Anton } from 'next/font/google'; // ✅ Emblema One 폰트 가져오기

export const anton = Anton({
  weight: '400',
  subsets: ['latin'],
});

// ✅ 'HH:mm' 형식으로 변환하는 함수
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const MypageTicket = () => {
  const userId = useUserStore((state) => state.id);
  const { data: history } = useTicketHistory(userId ?? '');

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
        <div className="w-full max-w-lg p-5 rounded-lg shadow-md border bg-[#151515] border-black h-[480px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <h2 className="text-xl font-semibold mb-4 text-white">My Tickets</h2>
          <ul className="space-y-4">
            {history.map((ticket) => (
              <li key={ticket.id} className="p-4 bg-white rounded-lg border border-black">
                {/* ✅ STAGE_101 & 이미지 한 줄 정렬 */}
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <h2 className=" text-2xl font-black border-b border-black pb-1">STAGE_101</h2>
                    {/* ✅ 영화 제목을 h2 바로 아래 배치 */}
                    <p className="font-black text-lg mt-1">{ticket.theater_name}</p>
                    <div className="flex gap-5 text-sm justify-center items-center mt-1 font-black">
                      <p>{ticket.screening_date}</p>
                      <p>{ticket.type}</p>
                      <p>{ticket.seat_number}</p>
                      <div className="flex justify-center mt-3">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${ticket.qr_token}`}
                          alt="QR Code"
                          className="w-12 h-12"
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

                <div className="flex gap-2 text-xs mt-1">
                  <p>✅ 결제 금액: {ticket.total_price}원</p>
                  <p>✅ 결제 시간: {formatTime(ticket.created_at)}</p>
                  <p>✅ 결제: {ticket.payment_method || '정보 없음'}</p>
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
