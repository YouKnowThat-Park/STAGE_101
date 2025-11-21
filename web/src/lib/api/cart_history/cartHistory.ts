import { CartHistoryItem } from 'src/types/cart/cart-history-type';

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
