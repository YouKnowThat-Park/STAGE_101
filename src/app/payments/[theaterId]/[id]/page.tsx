import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { serverSupabase } from '@/supabase/supabase-server';

interface CheckoutPageProps {
  params: { id: string; theaterId: string };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const seatIds = params.id.split('-');

  // ✅ Supabase에서 서버에서 직접 유저 정보 가져오기
  const supabase = await serverSupabase();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return redirect('/sign-in'); // 로그인 안 되어 있으면 리다이렉트
  }

  const userId = data.user.id;

  // ✅ 좌석 정보 가져오기
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const seatRes = await fetch(
    `${API_URL}/api/getSeats?theaterId=${params.theaterId}&seats=${seatIds.join(',')}`,
    {
      headers: { Authorization: `Bearer ${userId}` },
      cache: 'no-store',
    },
  );

  if (!seatRes.ok) {
    throw new Error('🚨 좌석 정보를 불러오지 못했습니다.');
  }

  const { reservations, totalPrice } = await seatRes.json();

  // ✅ `viewed_at`과 `show_time`을 가져오기
  if (!reservations || reservations.length === 0) {
    throw new Error('🚨 예약된 좌석 정보를 찾을 수 없습니다.');
  }

  const viewedAt = reservations[0]?.viewed_at; // ✅ 첫 번째 예약의 날짜
  const showTime = reservations[0]?.show_time; // ✅ 첫 번째 예약의 상영 시간

  // ✅ 클라이언트 컴포넌트로 데이터 전달
  return (
    <CheckoutClient
      userId={userId}
      seatIds={seatIds}
      theaterId={params.theaterId}
      totalPrice={totalPrice}
      viewed_at={viewedAt} // ✅ 추가
      show_time={showTime} // ✅ 추가
    />
  );
}
