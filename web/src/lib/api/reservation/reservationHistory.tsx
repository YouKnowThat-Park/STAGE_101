import { threadId } from 'worker_threads';

export interface ReservationType {
  id: string;
  theater_id: string;
  seat_number: string;
  total_price: number;
  status: string;
  created_at: string;
  theater_name: string;
  start_date: string;
  end_date: string | null;
  main_img: string;
  type: string;
  payment_method: string;
  qr_token: string | null;
}

export interface TheaterResponse {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  main_img: string;
  type: string;
}

export interface PaymentResponseInner {
  payment_method: string;
}

export interface QrSessionResponse {
  qr_token: string | null;
}

export interface ReservationApiResponse {
  id: string;
  theater_id: string;
  seat_number: string[];
  total_price: number;
  status: string;
  created_at: string;
  viewed_at?: string | null;
  show_time?: string | null;
  theater?: TheaterResponse | null;
  payment?: PaymentResponseInner | null;
  qr_session?: QrSessionResponse | null;
}

export interface PaymentResponse {
  id: string;
  user_id: string;
  reservation_id: string;
  amount: number;
  point_earned: number;
  payment_key: string;
  payment_method: string;
  status: string; // 'paid'
  created_at: string;
}

export interface PaymentCreatePayload {
  user_id: string;
  reservation_id: string;
  amount: number;
  point_earned: number;
  payment_key: string;
  payment_method: string;
}

export interface ReserveSeatsPayload {
  seat_number: string[];
  user_id: string;
  theater_id: string;
  viewed_at: string;
  show_time: string;
  price: number;
  total_price: number;
}

export interface UseReserveSeatsResult {
  reserveSeats: (payload: ReserveSeatsPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const fetchTicketHistory = async (userId: string): Promise<ReservationType[]> => {
  const res = await fetch('http://localhost:8000/reservations/me', {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('예약 내역을 불러올 수 없습니다.');

  const rawData: ReservationApiResponse[] = await res.json();
  return rawData.map((ticket) => {
    const seatString = ticket.seat_number.join(', ');

    return {
      id: ticket.id,
      theater_id: ticket.theater_id,
      seat_number: seatString,
      total_price: ticket.total_price,
      status: ticket.status,
      created_at: ticket.created_at,
      theater_name: ticket.theater?.name ?? '정보 없음',
      start_date: ticket.theater?.start_date ?? '정보 없음',
      end_date: ticket.theater?.end_date ?? null,
      main_img: ticket.theater?.main_img ?? '',
      type: ticket.theater?.type ?? '',
      payment_method: ticket.payment?.payment_method ?? '정보 없음',
      qr_token: ticket.qr_session?.qr_token ?? null,
    };
  });
};

export const createPayment = async (payload: PaymentCreatePayload): Promise<PaymentResponse> => {
  const res = await fetch('http://localhost:8000/payment/create', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('결제 처리에 실패했습니다.');
  }

  const data = (await res.json()) as PaymentResponse;
  return data;
};

export const cancelReservation = async (reservationId: string): Promise<void> => {
  const response = await fetch(`http://localhost:8000/reservations/delete/${reservationId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('예약 취소 실패');
};

export const reserveSeatApi = async (
  payload: ReserveSeatsPayload,
): Promise<ReservationApiResponse[]> => {
  // ✅ 프론트에서 미리 검증 (백엔드 불필요 호출 방지)
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
    // ✅ 서버 응답 오류 상세 출력
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

export const fetchReservedSeats = async (
  theaterId: string,
  viewedAt: string,
  showTime: string,
): Promise<string[]> => {
  const params = new URLSearchParams({
    theater_id: theaterId,
    viewed_at: viewedAt,
    show_time: showTime,
  });

  const res = await fetch(`http://localhost:8000/reservations/occupied?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('좌석 정보를 불러올 수 없습니다.');
  }

  const data = (await res.json()) as string[];
  return data;
};

export const fetchOccupiedSeats = async (
  theaterId: string,
  viewedAt: string,
  showTime: string,
): Promise<string[]> => {
  const params = new URLSearchParams({
    theater_id: theaterId,
    viewed_at: viewedAt,
    show_time: showTime,
  });

  const res = await fetch(`http://localhost:8000/reservations/occupied?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('좌석 정보를 불러올 수 없습니다.');
  }

  const data = (await res.json()) as string[];
  return data;
};

export interface CheckoutSummaryResponse {
  reservations: ReservationApiResponse[];
  total_price: number;
}

export const fetchCheckoutSummary = async (
  theaterId: string,
  seatIds: string[],
  cookie: string,
): Promise<CheckoutSummaryResponse> => {
  const params = new URLSearchParams({
    theater_id: theaterId,
    seats: seatIds.join(','),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'}/reservations/checkout-summary?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        cookie,
      },
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || '결제용 좌석 정보를 불러올 수 없습니다.');
  }

  return (await res.json()) as CheckoutSummaryResponse;
};
