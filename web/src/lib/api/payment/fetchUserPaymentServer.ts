import { ServerOptions } from 'src/types/common/common-type';
import { PaymentHistoryItem } from 'src/types/payment/payment-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const getUserPaymentsServer = async (
  userId: string,
  options: ServerOptions = {},
): Promise<PaymentHistoryItem[]> => {
  const headers: HeadersInit = {};

  if (options.cookie) {
    (headers as Record<string, string>).cookie = options.cookie;
  }

  const res = await fetch(`${API_BASE}/payment/${userId}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('결제 내역 조회 실패:', text || res.statusText);
    return [];
  }

  const data = (await res.json()) as PaymentHistoryItem[];
  return data;
};
