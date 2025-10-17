import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const theaterId = url.searchParams.get('theaterId');
  const seatIdsRaw = url.searchParams.get('seats');
  const seatIds = seatIdsRaw ? seatIdsRaw.split(',') : [];

  if (!theaterId) {
    return NextResponse.json({ error: 'theaterId is required' }, { status: 400 });
  }

  // ✅ 1. theaterId를 UUID로 변환
  const { data: theater, error: theaterError } = await supabase
    .from('theaters')
    .select('id')
    .eq('type', theaterId)
    .single();

  if (theaterError || !theater) {
    console.error('🚨 유효하지 않은 theaterId:', theaterId);
    return NextResponse.json({ error: 'Invalid theaterId' }, { status: 404 });
  }

  const validTheaterId = theater.id;

  // ✅ 2. reservations 테이블에서 해당 theater_id의 예약 좌석 조회
  let query = supabase
    .from('reservations')
    .select('seat_number, total_price, viewed_at, show_time') // ✅ `viewed_at` & `show_time` 추가
    .eq('theater_id', validTheaterId);

  // ✅ 특정 좌석만 조회해야 할 경우
  if (seatIds.length > 0) {
    query = query.in('seat_number', seatIds);
  }

  const { data: seats, error: seatError } = await query;

  if (seatError) {
    console.error('🔥 getSeats 오류:', seatError.message);
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }

  if (!seats || seats.length === 0) {
    console.error('🚨 해당 좌석 없음:', seatIds);
    return NextResponse.json({ error: 'Seats not found' }, { status: 404 });
  }

  return NextResponse.json({
    reservations: seats,
    totalPrice: seats.reduce((sum, s) => sum + s.total_price, 0), // ✅ 총 가격 계산
  });
}
