const BASE_URL = 'http://localhost:8000';

export async function fetchShops() {
  const res = await fetch(`${BASE_URL}/shops/`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('shop 데이터를 불러오지 못했습니다.');
  return res.json();
}

export async function fetchShopById(id: string) {
  const res = await fetch(`${BASE_URL}/shops/${id}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('해당 shop 데이터를 찾을 수 없습니다.');
  return res.json();
}
