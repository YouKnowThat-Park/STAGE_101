import { useState } from 'react';

interface ReserveSeatsProps {
  seats: string[];
  userId: string;
  theaterId: string;
}

export function useReserveSeats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserveSeats = async ({ seats, userId, theaterId }: ReserveSeatsProps) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ 기존 `pending` 상태 예약 조회
      const resCheck = await fetch('/api/reservation/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats, user_id: userId, theater_id: theaterId }),
      });

      const { exists } = await resCheck.json();

      // ✅ 기존 예약이 존재하면 **즉시 종료 (추가 예약 방지)**
      if (exists) {
        console.warn('⚠️ 이미 pending 상태의 예약이 존재함. 추가 예약 안함.');
        return false; // ✅ 예약 생성 안 함!
      }

      // ✅ 예약 생성 (기존 예약이 없을 경우에만 실행됨)
      const res = await fetch('/api/reservation/seats/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seats,
          user_id: userId,
          theater_id: theaterId,
          total_price: seats.length * 500, // 가격 로직 유지
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reserveSeats, loading, error };
}
