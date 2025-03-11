'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSeats, subscribeToSeats } from '@/supabase/supabaseSubscription';
import { useReserveSeats } from '@/hooks/useReserveSeats';
import { browserSupabase } from '@/supabase/supabase-client';
import { useTheaterData } from '@/hooks/useTheaterData';

interface ClientPaymentsPageProps {
  initialSeats: string[];
  theaterId: string;
}

const supabase = browserSupabase();

export default function ClientPaymentsPage({ initialSeats, theaterId }: ClientPaymentsPageProps) {
  console.log(theaterId);
  if (!theaterId) {
    return <div className="text-white text-center p-6">🚨 극장 정보가 없습니다.</div>;
  }

  const { data: theaterData, isLoading, error } = useTheaterData(theaterId);
  const [reservedSeats, setReservedSeats] = useState<string[]>(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { reserveSeats, loading, error: reserveError } = useReserveSeats();
  const router = useRouter();

  useEffect(() => {
    console.log(`🔄 [useEffect] reservedSeats 변경됨:`, reservedSeats);
  }, [reservedSeats]);

  useEffect(() => {
    async function fetchUser() {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        setUserId(null);
        return;
      }
      setUserId(session.session?.user?.id || null);
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchData() {
      console.log(`🎯 [useEffect] fetchSeats 실행: ${theaterId}`);

      const seats = await fetchSeats(theaterId);
      console.log(`✅ [useEffect] fetchSeats 완료, 좌석:`, seats);

      setReservedSeats(seats); // ✅ 직접 업데이트
    }

    fetchData();
  }, [theaterId]);

  const handleSeatClick = (seat: string) => {
    if (reservedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat].slice(0, 4),
    );
  };

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

    router.push(`/payments/${theaterId}/${selectedSeats.join('-')}`);
  };

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
