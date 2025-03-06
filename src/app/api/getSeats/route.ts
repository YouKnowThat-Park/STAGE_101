import { NextRequest, NextResponse } from 'next/server';
import { serverSupabase } from '@/supabase/supabase-server';

export async function GET(req: NextRequest) {
  const supabase = serverSupabase();

  const url = new URL(req.url);
  const theaterId = url.searchParams.get('theaterId');
  const seatIds = url.searchParams.get('seats')?.split(',') || [];

  console.log('🔍 요청된 theaterId:', theaterId);
  console.log('🔍 요청된 좌석 목록:', seatIds);

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
  console.log('🎭 변환된 theater_id:', validTheaterId);

  // ✅ 2. reservations 테이블에서 해당 theater_id의 예약 좌석 조회
  let query = supabase
    .from('reservations')
    .select('seat_number, total_price')
    .eq('theater_id', validTheaterId);

  // ✅ 특정 좌석만 조회해야 할 경우 (seatIds가 존재하면 필터링)
  if (seatIds.length > 0) {
    console.log('🔍 특정 좌석 필터 적용:', seatIds);
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

  console.log('🎟️ 조회된 좌석 목록:', seats);

  return NextResponse.json({
    reservations: seats,
    totalPrice: seats.reduce((sum, s) => sum + s.total_price, 0),
  });
}
