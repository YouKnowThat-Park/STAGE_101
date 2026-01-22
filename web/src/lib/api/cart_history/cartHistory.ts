import { CartHistoryItem } from 'src/types/cart/cart-history-type';

export const fetchCartHistory = async (): Promise<CartHistoryItem[]> => {
  const res = await fetch('/bff/cart-histories', {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || '거래 내역 조회 실패');
  }

  return res.json();
};
