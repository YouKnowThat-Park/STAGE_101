import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: '사용자 ID 누락' }, { status: 400 });
    }

    // ✅ `reservations`, `payments`, `theaters`, `users` 조인하여 결제 내역 조회
    const { data, error } = await supabase
      .from('payments')
      .select(
        `
        id, 
        amount, 
        payment_method, 
        status, 
        created_at, 
        reservations (
          seat_number, 
          total_price, 
          status, 
          theaters (
            name, 
            show_time
          )
        )
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🚨 결제 내역 조회 오류:', error);
      return NextResponse.json(
        { success: false, message: '결제 내역 조회 실패', error },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, payments: data });
  } catch (error: any) {
    console.error('🚨 서버 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류', error: error.message },
      { status: 500 },
    );
  }
}
