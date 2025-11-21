const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const deleteCartItem = async (user_id: string, shop_id: string) => {
  const res = await fetch(`${API_BASE}/cart/?user_id=${user_id}&shop_id=${shop_id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || '장바구니 삭제 실패');

  return result;
};
