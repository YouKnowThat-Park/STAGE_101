import { ReservationApiResponse } from 'src/types/reservation/reservation-type';

export interface CheckoutSummaryResponse {
  reservations: ReservationApiResponse[];
  total_price: number;
}
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchCheckoutSummary = async (
  theaterId: string,
  seatIds: string[],
  cookie: string,
): Promise<CheckoutSummaryResponse> => {
  const params = new URLSearchParams({
    theater_id: theaterId,
    seats: seatIds.join(','),
  });

  const res = await fetch(`${API_BASE}/reservations/checkout-summary?${params.toString()}`, {
    method: 'GET',
    headers: {
      cookie,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || '결제용 좌석 정보를 불러올 수 없습니다.');
  }

  return (await res.json()) as CheckoutSummaryResponse;
};
