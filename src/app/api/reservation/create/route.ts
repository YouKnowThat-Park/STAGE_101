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

    console.log('🎭 요청된 theaterId:', theaterId);
    console.log('🔍 요청된 좌석 목록:', seatIds);
    console.log('🛠️ seatIds 타입:', typeof seatIds, Array.isArray(seatIds) ? '배열' : '문자열');

    // ✅ 1. `theaters` 테이블에서 `UUID` 조회
    const { data: theaterData, error: theaterError } = await supabase
      .from('theaters')
      .select('id, price')
      .eq('type', theaterId)
      .single();

    if (theaterError || !theaterData) {
      console.error('🚨 상영관 조회 실패:', theaterError);
      return NextResponse.json({ success: false, message: 'Invalid theaterId' }, { status: 400 });
    }

    const actualTheaterId = theaterData.id;
    const totalPrice = theaterData.price * seatIds.length; // ✅ 가격 계산

    console.log(`🎭 변환된 theater_id: ${actualTheaterId}`);
    console.log(`💰 총 결제 금액: ${totalPrice}원`);

    // ✅ 2. 예약 정보 저장 (좌석번호를 문자열로 저장)
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          user_id: userId,
          theater_id: actualTheaterId,
          seat_number: seatIds.join(', '), // ✅ 문자열로 저장
          total_price: totalPrice,
          status: 'pending',
        },
      ])
      .select('id')
      .single();

    if (error) throw error;

    console.log('✅ 예약 성공:', data);
    return NextResponse.json({ success: true, reservationId: data.id });
  } catch (error) {
    console.error('🚨 예약 생성 실패:', error);
    return NextResponse.json(
      { success: false, message: 'Reservation failed', error },
      { status: 500 },
    );
  }
}
