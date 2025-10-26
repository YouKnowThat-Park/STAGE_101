import { serverSupabase } from '../../../../supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// ✅ TypeScript 타입 수정
interface Theater {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  main_img: string | null;
  type: string | null;
}

interface Payment {
  payment_method: string | null;
}

interface Reservation {
  id: string;
  created_at: string;
  seat_number: string;
  total_price: number;
  status: string;
  theaters?: Theater;
  payments?: Payment;
  qr_token?: string | null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
  }

  const supabase = await serverSupabase();

  try {
    // ✅ reservations 가져오기 (`screening_date` 제거 및 `start_date`, `end_date` 추가)
    const { data: reservations, error: resError } = await supabase
      .from('reservations')
      .select(
        `
        id, created_at, seat_number, total_price, status,
        theaters ( id, name, start_date, end_date, main_img, type ),
        payments ( payment_method )
      `,
      )
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });

    if (resError) {
      console.error('🚨 Supabase Query Error:', resError);
      return NextResponse.json({ error: '예약 데이터 조회 실패' }, { status: 500 });
    }

    // ✅ TypeScript에서 정확한 타입 추론을 위해 변환
    const formattedReservations: Reservation[] = reservations.map((ticket) => ({
      ...ticket,
      theaters: Array.isArray(ticket.theaters) ? ticket.theaters[0] : ticket.theaters || undefined, // ✅ 배열이면 첫 번째 요소 사용
      payments: Array.isArray(ticket.payments) ? ticket.payments[0] : ticket.payments || null, // ✅ 배열이면 첫 번째 요소 사용
      qr_token: null, // 기본값 설정 후 업데이트
    }));

    // ✅ 각 예약 ID에 대해 `qr_sessions`에서 `qr_token` 개별 조회
    for (const ticket of formattedReservations) {
      if (ticket.theaters?.id) {
        const { data: qrData } = await supabase
          .from('qr_sessions')
          .select('qr_token')
          .eq('user_id', userId)
          .eq('theater_id', ticket.theaters.id)
          .maybeSingle();

        ticket.qr_token = qrData?.qr_token || null;
      }
    }

    return NextResponse.json(formattedReservations);
  } catch (err) {
    console.error('🚨 Server Error:', err);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}
