const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchCartData = async (user_id: string) => {
  const res = await fetch(`${API_BASE}/cart/?user_id=${user_id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '장바구니 조회 실패 했습니다.');
  }
  return res.json();
};

export const addToCartData = async (data: {
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

export const updateCartQuantity = async (data: {
  user_id: string;
  shop_id: string;
  quantity: number;
}) => {
  const res = await fetch(`${API_BASE}/cart/`);
};

export const deleteCartItem = async (user_id: string, shop_id: string) => {
  const res = await fetch(`${API_BASE}/cart/?user_id=${user_id}&shop_id=${shop_id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || '장바구니 삭제 실패');

  return result;
};
