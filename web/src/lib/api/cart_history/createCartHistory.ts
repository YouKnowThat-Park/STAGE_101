import { CartHistoryItem } from 'src/types/cart/cart-history-type';

export const createCartHistory = async (payload: {
  payment_key: string;
  total_price: number;
  quantity: number;
  status: 'pending' | 'completed' | 'canceled';
  image_url?: string;
  name?: string;
  cart_id?: string;
  cart_item_ids: string[];
}): Promise<CartHistoryItem[]> => {
  const res = await fetch(`/bff/cart-histories/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err: { detail?: string } = await res.json().catch(() => ({}));
    throw new Error(err.detail || '거래 기록 생성 실패');
  }
  return res.json();
};
