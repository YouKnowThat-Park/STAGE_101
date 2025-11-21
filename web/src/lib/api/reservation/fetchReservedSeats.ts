import {
  ReservationApiResponse,
  ReserveSeatsPayload,
} from 'src/types/reservation/reservation-type';

export const reserveSeatApi = async (
  payload: ReserveSeatsPayload,
): Promise<ReservationApiResponse[]> => {
  // 프론트에서 미리 검증 (백엔드 불필요 호출 방지)
  if (!Array.isArray(payload.seat_number) || payload.seat_number.length === 0) {
    throw new Error('❌ seat_number는 최소 1개 이상이어야 합니다.');
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.viewed_at)) {
    throw new Error(`❌ viewed_at 형식 오류: ${payload.viewed_at} (YYYY-MM-DD 형식 필요)`);
  }

  if (!/^\d{2}:\d{2}$/.test(payload.show_time)) {
    throw new Error(`❌ show_time 형식 오류: ${payload.show_time} (HH:mm 형식 필요)`);
  }

  const expectedTotal = payload.seat_number.length * payload.price;
  if (payload.total_price !== expectedTotal) {
    throw new Error(
      `❌ total_price 불일치: ${payload.total_price} !== ${payload.seat_number.length} * ${payload.price}`,
    );
  }

  // ✅ 실제 API 호출
  const res = await fetch('http://localhost:8000/reservations/create', {
    method: 'POST',
    credentials: 'include', // 쿠키 포함
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let msg = `❌ 좌석 예약 요청 실패 (HTTP ${res.status})`;
    try {
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await res.json();
        msg =
          data?.detail || // FastAPI의 HTTPException
          data?.message ||
          data?.error ||
          JSON.stringify(data);
      } else {
        const text = await res.text();
        if (text) msg = text;
      }
    } catch (err) {
      console.error('❗ 응답 파싱 중 에러 발생:', err);
    }

    console.error('🚨 예약 요청 실패:', msg);
    throw new Error(msg);
  }

  const data = (await res.json()) as ReservationApiResponse[];
  return data;
};
