import { CartHistoryItem } from 'src/types/cart/cart-history-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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
  const res = await fetch(`${API_BASE}/cart-histories`, {
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
