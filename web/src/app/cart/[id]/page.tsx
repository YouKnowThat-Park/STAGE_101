// app/cart/[id]/page.tsx
import { notFound } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import Image from 'next/image';
import CartSuccessRedirect from '../_components/CartSuccessRedirect';

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';

type CartHistoryItem = {
  id: string;
  payment_key: string;
  name?: string;
  image_url?: string;
  quantity: number;
  total_price: number;
};

export interface CartSuccessProps {
  params: { id: string };
}

export default async function CartSuccessPage({ params }: CartSuccessProps) {
  //  SSR에서 인증 쿠키를 전달해야 /by-payment가 내 소유만 조회됨
  const hdrs = new Headers(headers());
  hdrs.set('cookie', cookies().toString());

  // 1) 단건 조회 → payment_key 확보
  const oneRes = await fetch(`${API}/cart-histories/${params.id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: hdrs,
  });
  if (!oneRes.ok) return notFound();
  const one: CartHistoryItem = await oneRes.json();

  // 2) 같은 payment_key의 전체 히스토리 조회
  const listRes = await fetch(`${API}/cart-histories/by-payment/${one.payment_key}`, {
    cache: 'no-store',
    headers: hdrs,
  });

  if (!listRes.ok) return notFound();

  const items: CartHistoryItem[] = await listRes.json();

  const totalQty = items.reduce((s, i) => s + (i.quantity ?? 0), 0);
  const totalPrice = items.reduce((s, i) => s + (i.total_price ?? 0), 0);

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl space-y-6">
        <div className="text-5xl text-center">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">결제가 완료되었습니다!</h1>

        <div className="text-sm text-gray-700 text-center space-y-1">
          <p>
            <span className="font-medium text-gray-800">주문번호:</span>{' '}
            <span className="font-mono text-blue-600 break-all">{one.payment_key}</span>
          </p>
          <p>
            총 수량 {totalQty} • {totalPrice.toLocaleString()} 포인트
          </p>
          <p className="text-gray-500">10초 후 메인 페이지로 자동 이동합니다.</p>
        </div>

        {/* 구매한 항목 목록 (이름/이미지/수량/가격만) */}
        <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg">
          {items.map((it) => (
            <li key={it.id} className="p-4 flex items-center gap-4">
              {it.image_url ? (
                <Image
                  src={it.image_url}
                  alt={it.name ?? '상품'}
                  width={56}
                  height={56}
                  className="rounded object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded" />
              )}
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{it.name ?? '상품'}</div>
                <div className="text-sm text-gray-600">
                  수량 {it.quantity} • {it.total_price.toLocaleString()}P
                </div>
              </div>
            </li>
          ))}
        </ul>

        <CartSuccessRedirect />
      </div>
    </div>
  );
}
