import { serverSupabase } from '../../../../supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await serverSupabase();

    // 요청에서 필요한 데이터 추출 (예: reservation_id)
    const { reservation_id } = await req.json();

    if (!reservation_id) {
      return NextResponse.json({ error: '예약 ID가 필요합니다.' }, { status: 400 });
    }

    // 1. 결제 정보 삭제
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .select('id')
      .eq('reservation_id', reservation_id);

    if (paymentError) {
      console.error('❌ [ERROR] 결제 정보 조회 실패:', paymentError);
      return NextResponse.json({ error: '결제 정보를 가져오지 못했습니다.' }, { status: 500 });
    }

    if (paymentData && paymentData.length > 0) {
      // 결제 삭제
      const { error: deletePaymentError } = await supabase
        .from('payments')
        .delete()
        .in(
          'id',
          paymentData.map((payment) => payment.id),
        );

      if (deletePaymentError) {
        console.error('❌ [ERROR] 결제 삭제 실패:', deletePaymentError);
        return NextResponse.json({ error: '결제를 삭제하지 못했습니다.' }, { status: 500 });
      }
    }

    // 2. 예약 정보 삭제
    const { error: deleteReservationError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservation_id);

    if (deleteReservationError) {
      console.error('❌ [ERROR] 예약 삭제 실패:', deleteReservationError);
      return NextResponse.json({ error: '예약 삭제 실패' }, { status: 500 });
    }

    // 성공적으로 삭제된 경우
    return NextResponse.json({ message: '결제 및 예약이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('❌ [ERROR] 서버 내부 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}
