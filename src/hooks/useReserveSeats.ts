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

    const res = await fetch('/api/reservation/seats/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seats,
        user_id: userId,
        theater_id: theaterId,
        total_price: seats.length * 10000, // ✅ 가격 계산
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
      return false;
    }

    return true;
  };

  return { reserveSeats, loading, error };
}
