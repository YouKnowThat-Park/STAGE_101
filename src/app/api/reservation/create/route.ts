import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// ✅ Supabase 클라이언트 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { userId, theaterId, seatIds } = await req.json();

    // ✅ 1. `theaters` 테이블에서 `UUID` 및 `price` 조회
    const { data: theaterData, error: theaterError } = await supabase
      .from('theaters')
      .select('id, price')
      .eq('type', theaterId) // 🔥 `type` 기준으로 `id(UUID)` 조회
      .single();

    if (theaterError || !theaterData) {
      console.error('🚨 상영관 조회 실패:', theaterError);
      return NextResponse.json({ success: false, message: 'Invalid theaterId' }, { status: 400 });
    }

    const actualTheaterId = theaterData.id;
    const pricePerSeat = theaterData.price; // ✅ 가격 가져오기
    const totalPrice = pricePerSeat * seatIds.length; // ✅ 가격 계산

    // ✅ 2. 예약 정보 저장 (좌석번호를 문자열로 저장)
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          user_id: userId,
          theater_id: actualTheaterId,
          seat_number: seatIds.join(', '), // ✅ 문자열로 저장
          total_price: totalPrice, // ✅ 가격 저장
          status: 'pending',
        },
      ])
      .select('id, total_price') // ✅ 저장된 가격도 확인
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      reservationId: data.id,
      totalPrice: data.total_price,
    });
  } catch (error) {
    console.error('🚨 예약 생성 실패:', error);
    return NextResponse.json(
      { success: false, message: 'Reservation failed', error },
      { status: 500 },
    );
  }
}
