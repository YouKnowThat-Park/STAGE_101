'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { subscribeToSeats } from '@/supabase/supabaseSubscription';
import { useReserveSeats } from '@/hooks/useReserveSeats';
import { browserSupabase } from '@/supabase/supabase-client';
import { useTheaterData } from '@/hooks/useTheaterData';

interface ClientPaymentsPageProps {
  initialSeats: string[];
  theaterId: string;
}

const supabase = browserSupabase();

export default function ClientPaymentsPage({ initialSeats, theaterId }: ClientPaymentsPageProps) {
  // 🚨 theaterId가 없으면 즉시 오류 반환 (필수값)
  if (!theaterId) {
    return <div className="text-white text-center p-6">🚨 극장 정보가 없습니다.</div>;
  }

  const { data: theaterData, isLoading, error } = useTheaterData(theaterId);
  const [reservedSeats, setReservedSeats] = useState<string[]>(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null); // ✅ 유저 ID 상태 추가
  const { reserveSeats, loading, error: reserveError } = useReserveSeats();
  const router = useRouter();

  // ✅ Supabase에서 유저 정보 가져오기 (최초 한 번 실행)
  useEffect(() => {
    async function fetchUser() {
      const { data: session, error } = await supabase.auth.getSession(); // ✅ 세션 정보 가져오기
      if (error) {
        setUserId(null);
        return;
      }
      setUserId(session.session?.user?.id || null); // ✅ 세션에서 유저 ID 가져오기
    }

    fetchUser();
  }, []);

  // ✅ 좌석 실시간 구독 (최초 한 번 실행)
  useEffect(() => {
    const unsubscribe = subscribeToSeats(setReservedSeats);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe(); // ✅ 함수인지 확인한 후 실행
      }
    };
  }, []);

  // ✅ 좌석 클릭 핸들러 (최대 4개까지만 선택 가능)
  const handleSeatClick = (seat: string) => {
    if (reservedSeats.includes(seat)) return; // 🚫 이미 예약된 좌석은 선택 불가

    setSelectedSeats((prev) => {
      if (prev.includes(seat)) {
        return prev.filter((s) => s !== seat); // ✅ 선택 해제
      } else if (prev.length < 4) {
        return [...prev, seat]; // ✅ 최대 4개까지만 선택 가능
      }
      return prev;
    });
  };

  // ✅ 결제 버튼 클릭 핸들러 → 선택된 좌석과 함께 결제 페이지로 이동
  const handlePayment = async () => {
    if (selectedSeats.length === 0 || !userId || !theaterId) {
      alert('🚨 유저 정보 또는 극장 정보가 없습니다.');
      return;
    }
    const success = await reserveSeats({ seats: selectedSeats, userId, theaterId });

    if (!success) {
      alert(reserveError || '좌석 예약 실패');
      return;
    }

    const seatId = selectedSeats.join('-');
    router.push(`/payments/${theaterId}/${seatId}`); // ✅ 극장 ID도 함께 전달
  };

  if (isLoading) return <p className="text-white text-center p-6">🚀 극장 정보 불러오는 중...</p>;
  if (error)
    return <p className="text-red-500 text-center p-6">❌ 극장 정보를 불러올 수 없습니다.</p>;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold">{theaterData?.name || '극장'} - 좌석 선택</h1>

      <div className="flex flex-col items-center gap-2 mt-6">
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {[...Array(10)].map((_, seatIndex) => {
              const seat = String.fromCharCode(65 + rowIndex) + (seatIndex + 1);
              const isReserved = reservedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  onClick={() => handleSeatClick(seat)}
                  disabled={isReserved}
                  className={`w-10 h-10 flex items-center justify-center text-white rounded-md cursor-pointer transition 
                    ${
                      isReserved
                        ? 'bg-gray-500 cursor-not-allowed'
                        : isSelected
                          ? 'bg-blue-500'
                          : 'bg-green-500 hover:bg-gray-400'
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
        <p className="text-lg">선택된 좌석: {selectedSeats.join(', ') || '없음'}</p>
        <button
          onClick={handlePayment}
          className={`mt-4 px-6 py-3 rounded-md text-white font-bold transition ${
            selectedSeats.length > 0
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-500 cursor-not-allowed'
          }`}
          disabled={selectedSeats.length === 0 || loading}
        >
          {loading ? '예약 중...' : '결제하기'}
        </button>
      </div>
    </div>
  );
}
