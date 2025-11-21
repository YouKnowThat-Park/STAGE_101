import { ReservationApiResponse, ReservationType } from 'src/types/reservation/reservation-type';

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
