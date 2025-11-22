import { ServerOptions } from 'src/types/common/common-type';
import { QrDetailResponse } from 'src/types/qr-session/qr-session-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchQrByReservationServer = async (
  reservationId: string,
  options: ServerOptions = {},
): Promise<QrDetailResponse | null> => {
  if (!reservationId) return null;

  const headers: HeadersInit = {};

  if (options.cookie) {
    (headers as Record<string, string>).cookie = options.cookie;
  }

  const res = await fetch(`${API_BASE}/qr-sessions/by-reservation/${reservationId}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('QR 세션 조회 실패:', text || res.statusText);
    return null;
  }

  const data = (await res.json()) as QrDetailResponse;
  return data;
};
