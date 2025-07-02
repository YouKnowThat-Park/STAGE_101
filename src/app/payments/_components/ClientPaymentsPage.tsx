'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSeats } from '@/supabase/supabaseSubscription'; // 좌석 정보 가져오는 로직
import { useReserveSeats } from '@/hooks/useReserveSeats';
import { browserSupabase } from '@/supabase/supabase-client';
import { useTheaterData } from '@/hooks/useTheaterData';
import TheaterCalendar from '@/app/theater/_components/TheaterCalendar';

interface ClientPaymentsPageProps {
  initialSeats: string[];
  theaterId: string;
}

const supabase = browserSupabase();

export default function ClientPaymentsPage({ initialSeats, theaterId }: ClientPaymentsPageProps) {
  const [step, setStep] = useState(1);
  const [viewedAt, setViewedAt] = useState<string>(''); // ✅ 빈 문자열로 초기화하여 안정성 확보
  const { data: theaterData, isLoading, error } = useTheaterData(theaterId);
  const [reservedSeats, setReservedSeats] = useState<string[]>(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { reserveSeats, loading, error: reserveError } = useReserveSeats();
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    async function fetchUser() {
      const { data: session } = await supabase.auth.getSession();
      setUserId(session.session?.user?.id || null);
    }
    fetchUser();
  }, []);

  // ✅ 좌석 정보 불러오기
  useEffect(() => {
    async function fetchData() {
      if (!theaterId || !viewedAt || !theaterData?.show_time) return;
      const seats = await fetchSeats(theaterId, viewedAt, theaterData.show_time);
      setReservedSeats(seats);
    }
    fetchData();
  }, [theaterId, viewedAt, theaterData?.show_time]);

  // ✅ 날짜 선택 후 Step 변경
  const handleCalendarNext = (date: Date) => {
    setViewedAt(date.toISOString().split('T')[0]); // ✅ viewedAt만 저장
    setStep(2);
  };

  // ✅ 좌석 선택
  const handleSeatClick = (seat: string) => {
    if (reservedSeats.includes(seat)) {
      console.warn(`⚠️ 이미 예약된 좌석: ${seat}`);
      return;
    }

    setSelectedSeats((prev) => {
      const updatedSeats = prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat].slice(0, 4);
      return updatedSeats;
    });
  };

  // Supabase Realtime 리팩토링 과정에서 누락된 코드 복구
  useEffect(() => {
    if (!theaterId || !viewedAt || !theaterData?.show_time) return;

    const channel = supabase
      .channel('realtime:reservations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
        },
        async () => {
          const seats = await fetchSeats(theaterId, viewedAt, theaterData.show_time);
          setReservedSeats(seats);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [theaterId, viewedAt, theaterData?.show_time]);

  // ✅ 결제하기
  const handlePayment = async () => {
    if (
      !selectedSeats.length ||
      !userId ||
      !theaterId ||
      !viewedAt ||
      !theaterData?.show_time ||
      !theaterData?.price
    ) {
      console.error('🚨 [프론트엔드] 필수 정보 누락:', {
        selectedSeats,
        userId,
        theaterId,
        viewedAt,
        showTime: theaterData?.show_time,
        price: theaterData?.price,
      });

      alert('🚨 날짜, 유저 정보, 좌석 정보, 상영 시간, 가격이 모두 필요합니다.');
      return;
    }

    const totalPrice = selectedSeats.length * theaterData.price;

    const success = await reserveSeats({
      seats: selectedSeats,
      user_id: userId,
      theater_id: theaterId,
      viewed_at: viewedAt,
      show_time: theaterData.show_time,
      price: theaterData.price,
      total_price: totalPrice,
    });

    if (!success) {
      console.error('🚨 [프론트엔드] 예약 실패:', reserveError);
      alert(reserveError || '좌석 예약 실패');
      return;
    }

    router.push(`/payments/${theaterId}/${selectedSeats.join('-')}`);
  };

  if (!theaterId) {
    return <div className="text-white text-center p-6">🚨 극장 정보가 없습니다.</div>;
  }
  if (isLoading) {
    return <p className="text-center text-gray-500">🎭 데이터 로딩 중...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">❌ 극장 정보를 불러오는 중 오류 발생</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center  text-black p-6">
      {/* STEP 1: 달력 (날짜 선택) */}
      {step === 1 && (
        <TheaterCalendar theaterId={theaterId} onDateTimeSelect={handleCalendarNext} />
      )}

      {/* STEP 2: 좌석 선택 */}
      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold mb-4">{theaterData?.name || '극장'} - 좌석 선택</h1>

          <div className="flex flex-col items-center gap-[6px] mt-6 px-2 w-full">
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-[4px]">
                {[...Array(10)].map((_, seatIndex) => {
                  const seat = String.fromCharCode(65 + rowIndex) + (seatIndex + 1);
                  const isReserved = reservedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);

                  return (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isReserved}
                      className={`rounded-md text-[2.8vw] sm:text-[2vw] md:text-sm
              w-[7vw] h-[7vw] min-w-[24px] min-h-[24px] max-w-[36px] max-h-[36px]
              flex items-center justify-center transition font-semibold
              ${
                isReserved
                  ? 'bg-gray-500 cursor-not-allowed text-white'
                  : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 hover:bg-gray-400 text-white'
              }`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-lg text-white">선택된 좌석: {selectedSeats.join(', ') || '없음'}</p>
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-md font-bold bg-gray-300 hover:bg-gray-400"
              >
                이전
              </button>

              <button
                onClick={handlePayment}
                className={`px-6 py-3 rounded-md text-white font-bold transition ${
                  selectedSeats.length > 0 && !loading
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedSeats.length === 0 || loading}
              >
                {loading ? '예약 중...' : '결제하기'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
