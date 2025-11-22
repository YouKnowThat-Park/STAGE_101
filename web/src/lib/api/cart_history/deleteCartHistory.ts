const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const deleteCartHistory = async (id: string) => {
  const res = await fetch(`${API_BASE}0/cart-histories/cancel`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || '해당 상품은 취소할 수 없습니다.');
  }
};
