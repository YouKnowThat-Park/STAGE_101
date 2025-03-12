interface Reservation {
  id: string;
  seat_number: string;
  total_price: number;
  status: string;
  created_at: string;
  theater_name: string; // ✅ 극장 이름 추가
  screening_date: string; // ✅ 상영 날짜 추가
  main_img: string;
  type: string;
  payment_method: string;
  qr_token: string;
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
    screening_date: ticket.theaters?.screening_date || '정보 없음',
    main_img: ticket.theaters?.main_img || '',
    type: ticket.theaters?.type || '',
    payment_method: ticket.payments?.[0]?.payment_method || '정보 없음', // ✅ 배열의 첫 번째 요소에서 값 가져오기
    qr_token: ticket.qr_sessions?.qr_token || null, // ✅ QR 코드 추가
  }));
};
