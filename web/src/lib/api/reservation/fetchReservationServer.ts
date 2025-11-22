import { ServerOptions } from 'src/types/common/common-type';
import { ReservationForPayment } from 'src/types/payment/payment-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchReservationsServer = async (
  options: ServerOptions = {},
): Promise<ReservationForPayment[]> => {
  const headers: HeadersInit = {};

  if (options.cookie) {
    (headers as Record<string, string>).cookie = options.cookie;
  }

  const res = await fetch(`${API_BASE}/reservations/me`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || '예약 내역을 불러올 수 없습니다.');
  }

  const data = (await res.json()) as ReservationForPayment[];
  return data;
};
