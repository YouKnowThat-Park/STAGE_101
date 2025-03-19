import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('✅ 서버에서 받은 원본 데이터:', body);

    // ✅ 올바른 필드명으로 변경 (클라이언트에서 보낸 데이터와 일치)
    const userId = body.user_id;
    const theaterId = body.theater_id;
    const seatIds = body.seats; // ✅ `seatIds` → `seats`
    const totalPrice = body.total_price;
    const viewedAt = body.viewed_at;
    const showTime = body.show_time;

    // 🚨 필수 데이터 검증
    if (!userId || !theaterId || !seatIds?.length || !viewedAt || !showTime) {
      console.error('🚨 필수 데이터 누락:', body);
      return NextResponse.json({ success: false, message: '필수 데이터 누락' }, { status: 400 });
    }

    // ✅ `seatIds`가 배열인지 확인
    if (!Array.isArray(seatIds)) {
      console.error('🚨 seatIds가 배열이 아닙니다!', seatIds);
      return NextResponse.json(
        { success: false, message: 'seats 필드는 배열이어야 합니다.' },
        { status: 400 },
      );
    }

    // ✅ `viewed_at`이 ISO 8601 형식인지 확인 후 변환
    let formattedViewedAt = viewedAt;
    if (!viewedAt.includes('T')) {
      formattedViewedAt = new Date(`${viewedAt}T00:00:00.000Z`).toISOString();
    }

    console.log('✅ 변환된 viewed_at:', formattedViewedAt);

    // ✅ `theaters` 테이블에서 `UUID` 및 `price` 조회
    const { data: theaterData, error: theaterError } = await supabase
      .from('theaters')
      .select('id, price')
      .eq('type', theaterId)
      .single();

    if (theaterError || !theaterData) {
      return NextResponse.json({ success: false, message: 'Invalid theaterId' }, { status: 400 });
    }

    const actualTheaterId = theaterData.id;
    const pricePerSeat = theaterData.price;
    const finalTotalPrice = pricePerSeat * seatIds.length;

    // ✅ 3. 예약 정보 저장
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          user_id: userId,
          theater_id: actualTheaterId,
          seat_number: JSON.stringify(seatIds), // ✅ `seats`를 JSON 문자열로 저장
          total_price: finalTotalPrice,
          status: 'pending',
          viewed_at: formattedViewedAt, // ✅ 변환된 `viewed_at`
          show_time: showTime || '미정', // ✅ `show_time` 기본값
        },
      ])
      .select('id, total_price, viewed_at, show_time')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      reservationId: data.id,
      totalPrice: data.total_price,
      viewed_at: data.viewed_at,
      show_time: data.show_time,
    });
  } catch (error) {
    console.error('🚨 예약 생성 실패:', error);
    return NextResponse.json(
      { success: false, message: 'Reservation failed', error },
      { status: 500 },
    );
  }
}
