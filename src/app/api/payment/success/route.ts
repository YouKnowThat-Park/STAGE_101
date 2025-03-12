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
          seat_number, total_price, status,
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

    // ✅ 1. 예약 정보 확인
    const { data: existingReservation, error: reservationError } = await supabase
      .from('reservations')
      .select('id, status, theater_id, seat_number')
      .eq('id', reservationId)
      .eq('user_id', userId)
      .maybeSingle();

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

    // ✅ 2. 기존 결제 내역 확인
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', userId)
      .eq('reservation_id', reservationId)
      .maybeSingle();

    if (existingPayment) {
      console.warn('⚠️ 이미 결제된 예약입니다.');
      return NextResponse.json({ success: true, message: '이미 결제됨' });
    }

    // ✅ 3. 중복된 orderId 방지 → UUID 생성
    let finalOrderId = uuidv4();
    const { data: orderExists } = await supabase
      .from('payments')
      .select('id')
      .eq('id', orderId)
      .maybeSingle();

    if (!orderExists) {
      finalOrderId = orderId;
    }

    // ✅ 4. 결제 정보 저장
    const { error: paymentError } = await supabase.from('payments').insert([
      {
        id: finalOrderId,
        user_id: userId,
        reservation_id: reservationId,
        amount: parseInt(amount, 10),
        status: 'paid',
        payment_key: paymentKey,
        payment_method: '카드',
      },
    ]);

    if (paymentError) throw new Error(paymentError.message);

    // ✅ 5. 예약 상태 업데이트 (pending → confirmed)
    const { error: reservationUpdateError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId)
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (reservationUpdateError) throw new Error(reservationUpdateError.message);

    // ✅ 6. QR 코드 발급 (기존 데이터 확인)
    const { data: existingQr } = await supabase
      .from('qr_sessions')
      .select('qr_token')
      .eq('user_id', userId)
      .eq('reservation_id', reservationId) // ✅ reservation_id 사용
      .maybeSingle();

    let qrToken = uuidv4(); // 새로운 QR 토큰 생성

    // ✅ QR 코드가 없으면 새로 저장
    if (!existingQr) {
      const { error: qrError } = await supabase.from('qr_sessions').insert([
        {
          id: uuidv4(),
          user_id: userId,
          reservation_id: reservationId, // ✅ reservation_id로 연결
          theater_id: theaterId, // ✅ 올바른 theater_id 저장
          qr_token: qrToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);

      if (qrError) throw new Error(qrError.message);
    } else {
      qrToken = existingQr.qr_token; // 기존 QR 사용
    }

    return NextResponse.json({ success: true, qr_token: qrToken, seat_number: seatNumber });
  } catch (error: any) {
    console.error('🚨 결제 확인 오류:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
