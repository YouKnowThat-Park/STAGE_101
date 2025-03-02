const API_BASE = '/api/cart';

export const fetchCartData = async (userId: string) => {
  const res = await fetch(`${API_BASE}?user_id=${userId}`);
  if (!res.ok) throw new Error('장바구니 데이터를 불러오지 못했습니;다.');
  return (await res.json()).data;
};

export const deleteCartData = async (userId: string, shopId: string) => {
  const res = await fetch(`/api/cart?user_id=${userId}&shop_id=${shopId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('장바구니 삭제 실패');
  return (await res.json()).message;
};
