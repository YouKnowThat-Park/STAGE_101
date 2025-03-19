import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { userId, theaterId, seatIds, totalPrice, viewed_at, show_time } = await req.json();

    // ✅ 필수 데이터 검증 (누락 데이터 확인)
    if (!userId || !theaterId || !seatIds?.length || !viewed_at || !show_time) {
      return NextResponse.json({ success: false, message: '필수 데이터 누락' }, { status: 400 });
    }

    // ✅ `viewed_at`이 ISO 8601 형식인지 확인 후 변환
    let formattedViewedAt = viewed_at;
    if (!viewed_at.includes('T')) {
      formattedViewedAt = new Date(`${viewed_at}T00:00:00.000Z`).toISOString();
    }

    console.log('✅ 변환된 viewed_at:', formattedViewedAt);

    // ✅ 2. `theaters` 테이블에서 `UUID` 및 `price` 조회
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
          seat_number: seatIds, // ✅ 배열로 저장
          total_price: finalTotalPrice,
          status: 'pending',
          viewed_at: formattedViewedAt, // ✅ 변환된 `viewed_at`
          show_time: show_time || '미정', // ✅ `show_time` 기본값
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
