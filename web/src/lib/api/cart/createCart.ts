const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const createCart = async (data: {
  user_id: string;
  shop_id: string;
  name: string;
  point: number;
  quantity: number;
  image_url: string;
}) => {
  const res = await fetch(`${API_BASE}/cart/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || '장바구니에 상품 추가 실패했습니다.');
  return result;
};
