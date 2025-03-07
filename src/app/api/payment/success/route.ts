import { serverSupabase } from '@/supabase/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  try {
    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get('reservationId');
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    if (!reservationId || !userId || !orderId || !paymentKey || !amount) {
      return NextResponse.json({ success: false, message: '필수 데이터 누락' }, { status: 400 });
    }

    console.log('✅ 결제 성공 데이터:', { reservationId, userId, orderId, paymentKey, amount });

    // ✅ 1. `payments` 테이블에 결제 정보 저장
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          id: orderId,
          user_id: userId,
          reservation_id: reservationId,
          amount: parseInt(amount, 10),
          status: 'paid',
          payment_key: paymentKey,
          payment_method: '카드',
        },
      ])
      .select('id')
      .single();

    if (paymentError) {
      console.error('🚨 결제 저장 오류:', paymentError);
      throw new Error(`결제 저장 오류: ${JSON.stringify(paymentError)}`); // ✅ 오류 메시지를 JSON으로 변환
    }

    // ✅ 2. `reservations` 테이블의 상태를 'confirmed'로 변경
    const { error: reservationError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId);

    if (reservationError) {
      console.error('🚨 예약 상태 업데이트 오류:', reservationError);
      throw new Error(`예약 상태 업데이트 오류: ${JSON.stringify(reservationError)}`); // ✅ 오류 메시지를 JSON으로 변환
    }

    console.log('✅ 결제 성공 및 예약 확정 완료:', paymentData);
    return NextResponse.json({ success: true, message: '결제 성공 및 예약 확정' });
  } catch (error) {
    console.error('🚨 결제 성공 처리 중 오류:', error);

    return NextResponse.json(
      {
        success: false,
        message: '결제 성공 처리 실패',
        error: error instanceof Error ? error.message : JSON.stringify(error), // ✅ JSON으로 변환해서 출력
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    // userId, paymentKey도 구조분해 할당
    const { orderId, reservationId, amount, userId, paymentKey } = await req.json();

    const supabase = await serverSupabase();

    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          id: orderId,
          reservation_id: reservationId,
          amount: parseInt(amount, 10),
          status: 'paid',
          user_id: userId,
          payment_method: '카드',
          payment_key: paymentKey,
        },
      ])
      .select('id')
      .single();
    if (paymentError) throw new Error(paymentError.message);

    // 예약 상태 업데이트
    const { data: updateData, error: reservationError } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId)
      .eq('user_id', userId); // ✅ 사용자 ID 추가

    if (reservationError) throw new Error(reservationError.message);

    return NextResponse.json({ success: true, payment: paymentData, reservation: updateData });
  } catch (error) {
    console.error('🚨 결제 확인 오류:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
