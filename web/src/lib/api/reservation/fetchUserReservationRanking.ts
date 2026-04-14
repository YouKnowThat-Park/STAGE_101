import { UserReservationRanking } from 'src/types/reservation/reservation-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchUserReservationRanking = async (
  userId: string,
): Promise<UserReservationRanking> => {
  const res = await fetch(`${API_BASE}/reservations/users/${userId}/ranking`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('예매 랭킹 정보를 불러오지 못했습니다.');
  }

  return res.json();
};
