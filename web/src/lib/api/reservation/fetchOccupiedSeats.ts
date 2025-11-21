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
