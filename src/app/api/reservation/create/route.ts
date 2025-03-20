import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // ✅ UUID 생성

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      console.error('🚨 요청 바디가 JSON 형식이 아닙니다.');
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    console.log('✅ 서버에서 받은 원본 데이터:', body);

    const userId = body.user_id;
    const theaterId = body.theater_id;
    const seatIds = body.seats;
    const totalPrice = body.total_price;
    let viewedAt = body.viewed_at;
    let showTime = body.show_time;

    if (!userId || !theaterId || !seatIds?.length || !viewedAt || !showTime) {
      console.error('🚨 필수 데이터 누락:', body);
      return NextResponse.json({ success: false, message: '필수 데이터 누락' }, { status: 400 });
    }

    // ✅ `viewed_at`, `show_time` 변환
    viewedAt = new Date(viewedAt).toISOString();
    showTime = showTime.length === 5 ? `${showTime}:00` : showTime;

    console.log('✅ 변환된 viewed_at:', viewedAt);
    console.log('✅ 변환된 show_time:', showTime);

    // ✅ `theaters` 테이블에서 `UUID` 조회
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

    // ✅ 예약 정보 저장
    const { data: reservationData, error: reservationError } = await supabase
      .from('reservations')
      .insert([
        {
          user_id: userId,
          theater_id: actualTheaterId,
          seat_number: JSON.stringify(seatIds),
          total_price: finalTotalPrice,
          status: 'pending',
          viewed_at: viewedAt,
          show_time: showTime,
        },
      ])
      .select('id')
      .single();

    if (reservationError || !reservationData) {
      console.error('🚨 예약 생성 실패:', reservationError);
      return NextResponse.json(
        { success: false, message: 'Reservation creation failed', error: reservationError },
        { status: 500 },
      );
    }

    const reservationId = reservationData.id;
    console.log('✅ 생성된 예약 ID:', reservationId);

    // ✅ QR 코드 생성 (기존 QR 코드 확인 후 생성)
    let qrToken = uuidv4();
    const { data: existingQr, error: qrCheckError } = await supabase
      .from('qr_sessions')
      .select('qr_token')
      .eq('user_id', userId)
      .eq('reservation_id', reservationId)
      .single();

    if (existingQr) {
      console.log('🛠️ 기존 QR 코드 재사용:', existingQr.qr_token);
      qrToken = existingQr.qr_token;
    } else {
      console.log('🛠️ 새로운 QR 코드 생성 중...');
      const { data: newQr, error: qrInsertError } = await supabase
        .from('qr_sessions')
        .insert([
          {
            id: uuidv4(),
            user_id: userId,
            reservation_id: reservationId,
            theater_id: actualTheaterId,
            qr_token: qrToken,
            created_at: new Date().toISOString(), // ✅ 생성 시간 추가
          },
        ])
        .select('qr_token')
        .single(); // ✅ QR 코드 삽입 후 데이터 반환

      if (qrInsertError || !newQr) {
        console.error('🚨 QR 코드 생성 실패:', qrInsertError);
        return NextResponse.json(
          { success: false, message: 'QR code generation failed', error: qrInsertError },
          { status: 500 },
        );
      }

      qrToken = newQr.qr_token;
      console.log('✅ 새로운 QR 코드 생성 완료:', qrToken);
    }

    // ✅ 결제 정보 저장 (payment_key를 null이 아닌 값으로 설정)
    const paymentKey = uuidv4();
    const { error: paymentError } = await supabase.from('payments').insert([
      {
        id: uuidv4(),
        user_id: userId,
        reservation_id: reservationId,
        amount: totalPrice,
        status: 'pending',
        payment_key: paymentKey,
        payment_method: '카드',
      },
    ]);

    if (paymentError) {
      console.error('🚨 결제 정보 저장 실패:', paymentError);
      return NextResponse.json(
        { success: false, message: 'Payment creation failed', error: paymentError },
        { status: 500 },
      );
    }

    console.log('📢 [백엔드] 최종 응답 데이터:', {
      success: true,
      reservationId,
      qr_token: qrToken, // ✅ QR 코드 응답 확인
      paymentKey,
    });

    return NextResponse.json({
      success: true,
      reservationId,
      qr_token: qrToken, // ✅ 프론트에서 QR 코드 표시 가능하도록 보장
      paymentKey, // ✅ 결제 확인용
    });
  } catch (error) {
    console.error('🚨 예약 생성 실패:', error);
    return NextResponse.json(
      { success: false, message: 'Reservation failed', error },
      { status: 500 },
    );
  }
}
