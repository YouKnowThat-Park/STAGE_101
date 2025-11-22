import { ServerOptions } from 'src/types/common/common-type';
import { PaymentCreatePayload, PaymentResponse } from 'src/types/payment/payment-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const createPaymentServer = async (
  payload: PaymentCreatePayload,
  options: ServerOptions = {},
): Promise<PaymentResponse> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // 서버에서 쿠키를 넘길 경우
  if (options.cookie) {
    (headers as Record<string, string>).cookie = options.cookie;
  }

  const res = await fetch(`${API_BASE}/payment/create`, {
    method: 'POST',
    headers,
    cache: 'no-store',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || '결제 처리에 실패했습니다.');
  }

  const data = (await res.json()) as PaymentResponse;
  return data;
};
