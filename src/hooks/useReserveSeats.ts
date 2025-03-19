import { useState } from 'react';
interface ReserveSeatsProps {
  seats: string[];
  user_id: string;
  theater_id: string;
  viewed_at: string;
  show_time: string;
  price: number; // ✅ 추가
  total_price: number;
}

export function useReserveSeats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reserveSeats = async ({
    seats,
    user_id,
    theater_id,
    viewed_at,
    show_time,
    total_price,
  }: ReserveSeatsProps) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📡 [프론트엔드] 서버로 예약 요청 전송 중...');

      // ✅ `viewed_at`을 ISO 8601 형식으로 변환
      const formattedViewedAt = new Date(`${viewed_at}T00:00:00.000Z`).toISOString();

      const response = await fetch('/api/reservation/seats/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seats,
          user_id,
          theater_id,
          viewed_at: formattedViewedAt, // ✅ 변환된 값 사용
          show_time, // ✅ 그대로 전달
          total_price,
        }),
      });

      console.log('📡 [프론트엔드] 서버 응답 상태 코드:', response.status);

      const result = await response.json();
      console.log('✅ [프론트엔드] 서버 응답 데이터:', result);

      if (!response.ok) {
        console.error('🚨 [프론트엔드] 예약 실패:', result.error);
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('🚨 [프론트엔드] 요청 중 오류 발생:', err);
      setError('서버 요청 실패');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reserveSeats, loading, error };
}
