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

  // ✅ 클라이언트 컴포넌트로 **순수 데이터만 전달**
  return (
    <CheckoutClient
      userId={userId} // ✅ 함수가 아니라 userId 값만 전달
      seatIds={seatIds}
      theaterId={params.theaterId}
      totalPrice={totalPrice}
    />
  );
}
