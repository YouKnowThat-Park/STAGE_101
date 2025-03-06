import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = serverSupabase();

  try {
    // ✅ 요청 바디에서 필드 추출
    const { seat_number, user_id, theater_id, total_price } = await req.json();

    if (!seat_number || !user_id || !theater_id || !total_price) {
      return NextResponse.json({ error: '필수 정보 누락' }, { status: 400 });
    }

    // ✅ Supabase 좌석 확인
    const { data: existing, error: checkError } = await supabase
      .from('reservations')
      .select('status')
      .eq('seat_number', seat_number)
      .single();

    if (checkError) throw new Error(checkError.message);
    if (existing && existing.status !== 'available') {
      return NextResponse.json({ error: '이미 예약된 좌석입니다.' }, { status: 409 });
    }

    // ✅ 좌석 예약 진행 (필수 필드 포함)
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          seat_number: String(seat_number), // 🔥 `seat_number`가 `TEXT`면 string 변환
          user_id: String(user_id),
          theater_id: String(theater_id),
          total_price: Number(total_price), // 🔥 `total_price`는 숫자로 변환
          status: 'reserved',
        },
      ])
      .select(); // 🔥 insert 후 자동으로 생성된 데이터 반환

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, reservation: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
