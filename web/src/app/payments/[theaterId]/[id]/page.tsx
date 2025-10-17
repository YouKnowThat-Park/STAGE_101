import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { serverSupabase } from '../../../../supabase/supabase-server';
import { headers } from 'next/headers'; // ✅ 추가

interface CheckoutPageProps {
  params: { id: string; theaterId: string };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const seatIds = params.id.split('-');

  // ✅ Supabase에서 서버에서 직접 유저 정보 가져오기
  const supabase = await serverSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return redirect('/sign-in');
  }

  const userId = data.user.id;

  // ✅ 요청 origin 추출 (http or https 자동 감지)
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  // ✅ 좌석 정보 가져오기
  const seatRes = await fetch(
    `${baseUrl}/api/getSeats?theaterId=${params.theaterId}&seats=${seatIds.join(',')}`,
    {
      headers: { Authorization: `Bearer ${userId}` },
      cache: 'no-store',
    },
  );

  if (!seatRes.ok) {
    throw new Error('🚨 좌석 정보를 불러오지 못했습니다.');
  }

  const { reservations, totalPrice } = await seatRes.json();

  if (!reservations || reservations.length === 0) {
    throw new Error('🚨 예약된 좌석 정보를 찾을 수 없습니다.');
  }

  const viewedAt = reservations[0]?.viewed_at;
  const showTime = reservations[0]?.show_time;

  return (
    <CheckoutClient
      userId={userId}
      seatIds={seatIds}
      theaterId={params.theaterId}
      totalPrice={totalPrice}
      viewed_at={viewedAt}
      show_time={showTime}
    />
  );
}
