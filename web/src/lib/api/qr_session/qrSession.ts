import { QrSessionResponse } from '../reservation/reservationHistory';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export interface QrSessionCreatePayload {
  user_id: string;
  theater_id: string;
  reservation_id: string;
}
export interface QrDetailResponse {
  qr_token: string | null;
  theater_id: string;
  theater_name: string;
  main_img: string | null;
  viewed_at: string | null;
  show_time: string | null;
}

export const fetchQrDetail = async (reservationId: string): Promise<QrDetailResponse> => {
  const res = await fetch(`${API_BASE_URL}/qr-sessions/by-reservation/${reservationId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `QR 상세 조회 실패 ${res.status}`);
  }

  const data = await res.json();

  return {
    qr_token: data.qr_token ?? null,
    theater_id: data.theater_id,
    theater_name: data.theater_name,
    main_img: data.main_img ?? null,
    viewed_at: data.viewed_at ?? null,
    show_time: data.show_time ?? null,
  };
};
