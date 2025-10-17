interface Reservation {
  id: string;
  seat_number: string;
  total_price: number;
  status: string;
  created_at: string;
  theater_name: string; // ✅ 극장 이름 추가
  start_date: string; // ✅ 상영 시작 날짜
  end_date: string | null; // ✅ 상영 종료 날짜 (없을 수도 있음)
  main_img: string;
  type: string;
  payment_method: string;
  qr_token: string | null;
}

export const fetchTicketHistory = async (userId: string): Promise<Reservation[]> => {
  if (!userId) throw new Error('유효한 사용자 ID가 필요합니다.');

  const url = `/api/reservation/history?${new URLSearchParams({ userId })}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error('예약 내역을 불러올 수 없습니다.');

  const rawData = await res.json();

  return rawData.map((ticket: any) => ({
    ...ticket,
    theater_name: ticket.theaters?.name || '정보 없음',
    start_date: ticket.theaters?.start_date || '정보 없음', // ✅ start_date 적용
    end_date: ticket.theaters?.end_date || null, // ✅ end_date 적용 (없을 수도 있음)
    main_img: ticket.theaters?.main_img || '',
    type: ticket.theaters?.type || '',
    payment_method: ticket.payments?.payment_method || '정보 없음', // ✅ 배열이 아니라 객체일 가능성 고려
    qr_token: ticket.qr_sessions?.qr_token || null, // ✅ QR 코드 값이 없으면 null 처리
  }));
};
