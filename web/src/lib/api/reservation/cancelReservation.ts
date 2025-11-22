const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const cancelReservation = async (reservationId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/reservations/delete/${reservationId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('예약 취소 실패');
};
