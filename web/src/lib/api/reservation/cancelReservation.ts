export const cancelReservation = async (reservationId: string): Promise<void> => {
  const response = await fetch(`http://localhost:8000/reservations/delete/${reservationId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('예약 취소 실패');
};
