import type { TheaterListParams, TheaterListResponse } from 'src/types/theater/theater-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const fetchTheaterList = async (
  params: TheaterListParams = {},
): Promise<TheaterListResponse> => {
  const qs = new URLSearchParams();

  if (params.type) qs.set('type', params.type);
  if (params.status !== undefined) qs.set('status', String(params.status));
  if (params.include_stats) qs.set('include_stats', 'true');
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.offset) qs.set('offset', String(params.offset));

  const url = `${API_BASE}/theaters/list${qs.toString() ? `?${qs.toString()}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('공연 목록을 불러올 수 없습니다.');
  return res.json();
};
