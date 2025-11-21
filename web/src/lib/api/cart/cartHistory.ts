import { CartHistoryItem } from 'src/types/cart/cart-history-type';

export const postCartHistory = async (payload: {
  payment_key: string;
  total_price: number;
  quantity: number;
  status: 'pending' | 'completed' | 'canceled';
  image_url?: string;
  name?: string;
  cart_id?: string;
  cart_item_ids: string[];
}): Promise<CartHistoryItem> => {
  const res = await fetch('http://localhost:8000/cart-histories', {
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

export const fetchCartHistory = async (): Promise<CartHistoryItem[]> => {
  const res = await fetch('http://localhost:8000/cart-histories/me', {
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || '거래 내역 조회 실패');
  }

  return res.json();
};

export const fetchCartHistoriesByPayment = async (
  paymentKey: string,
): Promise<CartHistoryItem[]> => {
  const res = await fetch(`http://localhost:8000/cart-histories/by-payment/${paymentKey}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}) as any);
    throw new Error(err.detail || '해당 결제의 히스토리가 없습니다.');
  }
  return res.json();
};

export const DeleteCartHistory = async (id: string) => {
  const res = await fetch('http://localhost:8000/cart-histories/cancel', {
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
