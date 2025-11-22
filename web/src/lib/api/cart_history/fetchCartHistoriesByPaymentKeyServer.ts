import { CartHistoryItem } from 'src/types/cart/cart-history-type';
import { ServerOptions } from 'src/types/common/common-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchCartHistoriesByPaymentKeyServer = async (
  paymentKey: string,
  options: ServerOptions = {},
): Promise<CartHistoryItem[]> => {
  const headers: HeadersInit = {};

  if (options.cookie) {
    (headers as Record<string, string>).cookie = options.cookie;
  }

  const res = await fetch(`${API_BASE}/cart-histories/by-payment/${paymentKey}`, {
    cache: 'no-store',
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `장바구니 히스토리 목록 조회 실패: ${res.status}`);
  }

  const data = (await res.json()) as CartHistoryItem[];
  return data;
};
