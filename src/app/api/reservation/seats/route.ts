import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await serverSupabase();
  try {
    const { seats, user_id, theater_id, total_price } = await req.json();

    if (!seats || !user_id || !theater_id || total_price === undefined) {
      return NextResponse.json({ error: '필수 정보 누락' }, { status: 400 });
    }

    const seatsArray = Array.isArray(seats) ? seats : seats.split(',');

    const { data: existingReservations } = await supabase
      .from('reservations')
      .select('id')
      .in('seat_number', seatsArray)
      .eq('user_id', user_id)
      .eq('theater_id', theater_id)
      .eq('status', 'pending'); // ✅ 기존 `pending` 예약이 있으면 막기

    console.log('existingReservations:', existingReservations);
    if (existingReservations?.length) {
      return NextResponse.json({ error: '이미 예약된 좌석이 있습니다.' }, { status: 409 });
    }

    // ✅ `pending` 상태로 좌석 예약
    const insertData = seatsArray.map((seat: string) => ({
      seat_number: seat,
      user_id,
      theater_id,
      status: 'pending',
      total_price,
    }));

    const { error } = await supabase.from('reservations').insert(insertData);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('🚨 좌석 예약 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
