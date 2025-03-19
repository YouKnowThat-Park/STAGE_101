import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // ✅ QR 토큰 생성용

/** ✅ [GET] 결제 성공 정보 조회 */
export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  try {
    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get('reservationId');
    const userId = searchParams.get('userId');

    if (!reservationId || !userId) {
      return NextResponse.json({ success: false, message: '필수 데이터 누락' }, { status: 400 });
    }

    // ✅ 결제 및 예약 정보 조회 (seat_number 포함)
    const { data, error } = await supabase
      .from('payments')
      .select(
        `
        id, amount, payment_method, status, 
        reservations (
          seat_number, total_price, status, viewed_at,
          theaters (name, show_time)
        )
      `,
      )
      .eq('user_id', userId)
      .eq('reservation_id', reservationId)
      .maybeSingle();

    if (error) {
      console.error('🚨 결제 정보 조회 오류:', error);
      return NextResponse.json(
        { success: false, message: '결제 정보 조회 실패', error },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, payment: data });
  } catch (error: any) {
    console.error('🚨 결제 정보 조회 중 오류:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/** ✅ [POST] 결제 성공 처리 */
export async function POST(req: NextRequest) {
  try {
    const { orderId, userId, amount, paymentKey, reservationId } = await req.json();
    const supabase = await serverSupabase();

    console.log('✅ 요청된 데이터:', { orderId, userId, amount, paymentKey, reservationId });

    // ✅ 1. 기존 예약 정보 조회
    const { data: existingReservation, error: reservationError } = await supabase
      .from('reservations')
      .select('id, status, theater_id, seat_number, show_time, viewed_at')
      .eq('id', reservationId)
      .eq('user_id', userId)
      .maybeSingle();

    console.log('🛠️ [디버깅] 기존 예약 데이터:', existingReservation);

    if (reservationError || !existingReservation) {
      throw new Error('🚨 해당 예약을 찾을 수 없습니다.');
    }

    if (existingReservation.status === 'confirmed') {
      console.warn('⚠️ 이미 결제 완료된 예약입니다.');
      return NextResponse.json(
        { success: false, message: '이미 결제된 예약입니다.' },
        { status: 400 },
      );
    }

    const theaterId = existingReservation.theater_id;
    const seatNumber = existingReservation.seat_number;
    if (!theaterId) {
      throw new Error('🚨 해당 예약의 theater_id를 찾을 수 없습니다.');
    }

    // ✅ 2. 기존 `viewed_at`, `show_time` 값 유지 (NULL 방지)
    const formattedViewedAt =
      existingReservation.viewed_at && existingReservation.viewed_at !== null
        ? new Date(existingReservation.viewed_at).toISOString()
        : null; // NULL이면 업데이트 제외

    const formattedShowTime = existingReservation.show_time ?? '미정'; // ✅ NULL 방지

    console.log('✅ [디버깅] 변환된 viewed_at:', formattedViewedAt);
    console.log('✅ [디버깅] 변환된 show_time:', formattedShowTime);

    // ✅ 3. 예약 상태 업데이트 (`pending` → `confirmed`)
    const updateData: any = { status: 'confirmed', show_time: formattedShowTime };
    if (formattedViewedAt) {
      updateData.viewed_at = formattedViewedAt;
    }

    const { error: reservationUpdateError } = await supabase
      .from('reservations')
      .update(updateData)
      .eq('id', reservationId)
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (reservationUpdateError) throw new Error(reservationUpdateError.message);

    // ✅ 4. 결제 정보 저장
    const { error: paymentError } = await supabase.from('payments').insert([
      {
        id: orderId,
        user_id: userId,
        reservation_id: reservationId,
        amount: parseInt(amount, 10),
        status: 'paid',
        payment_key: paymentKey,
        payment_method: '카드',
      },
    ]);

    if (paymentError) throw new Error(paymentError.message);

    console.log('✅ [서버] 결제 정보 저장 완료');

    return NextResponse.json({ success: true, seat_number: seatNumber });
  } catch (error: any) {
    console.error('🚨 결제 확인 오류:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
