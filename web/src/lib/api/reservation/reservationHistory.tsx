interface Reservation {
  id: string;
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

export const fetchTicketHistory = async (userId: string): Promise<Reservation[]> => {
  const res = await fetch('http://localhost:8000/reservations/me', {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('예약 내역을 불러올 수 없습니다.');

  const rawData = await res.json();

  return rawData.map((ticket: any) => ({
    ...ticket,
    theater_name: ticket.theater?.name || '정보 없음',
    start_date: ticket.theater?.start_date || '정보 없음',
    end_date: ticket.theater?.end_date || null,
    main_img: ticket.theater?.main_img || '',
    type: ticket.theater?.type || '',
    payment_method: ticket.payment?.payment_method || '정보 없음',
    qr_token: ticket.qr_session?.qr_token || null,
  }));
};
