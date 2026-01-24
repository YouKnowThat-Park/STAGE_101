const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export interface PopularityTheaterProps {
  name: string;
  type: string;
  value: number;
}

export const fetchPopularityTheater = async (): Promise<PopularityTheaterProps[]> => {
  const res = await fetch(`${API_BASE}/reservations/popularityTheater`);

  if (!res.ok) {
    throw new Error('데이터를 불러오지 못했습니다.');
  }

  const data = await res.json();

  return data;
};
