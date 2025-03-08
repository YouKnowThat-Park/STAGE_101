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

    // ✅ 결제 및 예약 정보를 조인하여 조회
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
      .single();

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
    const { orderId, reservationId, amount, userId, paymentKey } = await req.json();
    const supabase = await serverSupabase();

    // ✅ 1. 기존 예약 상태 확인 (중복 방지)
    const { data: existingReservation } = await supabase
      .from('reservations')
      .select('id, status')
      .eq('id', reservationId)
      .eq('user_id', userId)
      .single();

    if (!existingReservation) {
      throw new Error('🚨 해당 예약을 찾을 수 없습니다.');
    }

    if (existingReservation.status === 'confirmed') {
      console.warn('⚠️ 이미 결제 완료된 예약입니다.');
      return NextResponse.json(
        { success: false, message: '이미 결제된 예약입니다.' },
        { status: 400 },
      );
    }

    // ✅ 2. 기존 결제 내역 확인 (중복 결제 방지)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('reservation_id', reservationId)
      .eq('user_id', userId)
      .single();

    if (existingPayment) {
      console.warn('⚠️ 이미 결제된 예약입니다.');
      return NextResponse.json({ success: true, message: '이미 결제됨' });
    }

    // ✅ 3. 결제 정보 저장 (이미 존재하는 orderId라면 새로운 UUID 생성)
    let finalOrderId = orderId;
    const { data: orderExists } = await supabase
      .from('payments')
      .select('id')
      .eq('id', orderId)
      .single();

    if (orderExists) {
      console.warn('⚠️ 중복된 orderId 발견, 새로운 UUID 생성');
      finalOrderId = uuidv4();
    }

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

    // ✅ 4. 예약 상태 업데이트 (pending → confirmed) - pending인 경우만 변경
    const { error: reservationUpdateError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId)
      .eq('user_id', userId)
      .eq('status', 'pending'); // ✅ pending 상태인 것만 변경

    if (reservationUpdateError) throw new Error(reservationUpdateError.message);

    // ✅ 5. QR 코드 발급 (기존 데이터 확인)
    const { data: reservationData } = await supabase
      .from('reservations')
      .select('theater_id')
      .eq('id', reservationId)
      .single();

    const theaterId = reservationData?.theater_id;
    if (!theaterId) throw new Error('🚨 theater_id 조회 실패');

    // ✅ 기존 QR 존재 여부 확인
    const { data: existingQr } = await supabase
      .from('qr_sessions')
      .select('qr_token')
      .eq('user_id', userId)
      .eq('theater_id', theaterId)
      .single();

    let qrToken = existingQr?.qr_token || uuidv4();

    if (!existingQr) {
      const { error: qrError } = await supabase.from('qr_sessions').insert([
        {
          id: uuidv4(),
          user_id: userId,
          theater_id: theaterId,
          qr_token: qrToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);

      if (qrError) throw new Error(qrError.message);
    }

    return NextResponse.json({ success: true, qr_token: qrToken });
  } catch (error: any) {
    console.error('🚨 결제 확인 오류:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
