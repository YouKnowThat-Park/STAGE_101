import { serverSupabase } from '@/supabase/supabase-server';
import { ReserveType } from '@/types/reserve-type';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = serverSupabase();
  try {
    const body = await req.json();

    const { seats, user_id, theater_id, total_price } = body;
    const seatsArray = Array.isArray(seats) ? seats : seats.split(',');

    if (!seatsArray.length || !user_id || !theater_id || total_price === undefined) {
      console.error('🚨 필수 정보 누락:', { seatsArray, user_id, theater_id, total_price });
      return NextResponse.json({ error: '필수 정보 누락' }, { status: 400 });
    }

    // ✅ 1. `type` 컬럼을 기준으로 UUID 조회
    const { data: theaterData, error: theaterError } = await supabase
      .from('theaters')
      .select('id')
      .eq('type', theater_id) // 🔥 'type' 필드에서 검색
      .single();

    if (theaterError || !theaterData) {
      return NextResponse.json({ error: '유효하지 않은 theater_id' }, { status: 400 });
    }

    const validTheaterId = theaterData.id; // ✅ 변환된 UUID 사용

    // ✅ 2. 이미 예약된 좌석인지 확인
    const { data: existingSeats, error: checkError } = await supabase
      .from('reservations')
      .select('seat_number, status')
      .in('seat_number', seatsArray as string[]);

    if (checkError) throw new Error(checkError.message);

    const alreadyReserved = existingSeats.some((seat) => seat.status !== 'available');
    if (alreadyReserved) {
      return NextResponse.json({ error: '이미 예약된 좌석이 있습니다.' }, { status: 409 });
    }

    // ✅ 3. `pending` 상태로 좌석 예약
    const insertData: ReserveType[] = seatsArray.map((seat: string) => ({
      seat_number: seat,
      user_id: String(user_id),
      theater_id: validTheaterId, // ✅ 변환된 UUID 사용
      status: 'pending',
      total_price: Number(total_price),
    }));

    const { data, error } = await supabase.from('reservations').insert(insertData);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, reservations: data }, { status: 201 });
  } catch (error) {
    console.error('🚨 서버 오류:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
