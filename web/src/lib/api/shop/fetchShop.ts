const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchShops = async () => {
  const res = await fetch(`${API_BASE}/shops/`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('shop 데이터를 불러오지 못했습니다.');
  return res.json();
};

export const fetchShopById = async (id: string) => {
  const res = await fetch(`${API_BASE}/shops/${id}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('해당 shop 데이터를 찾을 수 없습니다.');
  return res.json();
};
