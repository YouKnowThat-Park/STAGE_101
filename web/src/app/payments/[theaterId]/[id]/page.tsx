import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { headers } from 'next/headers'; // ✅ 추가
import { fetchCheckoutSummary } from 'src/lib/api/reservation/reservationHistory';
import { CheckoutPageProps } from 'src/types/payment/payment-type';

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const seatIds = params.id.split('-');

  const headersList = headers();
  const cookie = headersList.get('cookie') ?? '';
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

  const meRes = await fetch(`${apiBase}/users/me`, {
    headers: { cookie },
    cache: 'no-store',
  });

  if (!meRes.ok) {
    return redirect('/sign-in');
  }

  const me = (await meRes.json()) as { id: string }; // 서버 응답 스펙에 맞게 타입 수정
  const userId = me.id;

  const { reservations, total_price } = await fetchCheckoutSummary(
    params.theaterId,
    seatIds,
    cookie,
  );

  if (!reservations || reservations.length === 0) {
    throw new Error('🚨 예약된 좌석 정보를 찾을 수 없습니다.');
  }
  const first = reservations[0];

  if (!first.viewed_at || !first.show_time) {
    // 여기서 한 번 걸러버리면, 아래에서는 무조건 string이라고 TypeScript가 이해함
    throw new Error('🚨 예약 정보에 viewed_at 또는 show_time이 없습니다.');
  }
  const viewedAt: string = first.viewed_at;
  const showTime: string = first.show_time;
  const reservationId: string = first.id;

  return (
    <CheckoutClient
      userId={userId}
      seatIds={seatIds}
      theaterId={params.theaterId}
      totalPrice={total_price}
      viewed_at={viewedAt}
      show_time={showTime}
      reservationId={reservationId}
    />
  );
}
