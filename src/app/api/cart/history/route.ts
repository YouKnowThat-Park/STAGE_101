import { checkoutCart } from '@/lib/checkoutCart';
import { getCartHistory } from '@/lib/getCartHistory';
import { serverSupabase } from '@/supabase/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, totalPrice, quantity } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: '유저 ID가 없습니다.' }, { status: 400 });
    }

    const result = await checkoutCart(userId, totalPrice, quantity);

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ 결제 API 오류:', error);
    return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const supabase = await serverSupabase();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: '유저 ID가 없습니다.' }, { status: 400 });
    }

    // 🔹 Supabase에서 `cart_history` 테이블에서 `user_id` 기준으로 거래 내역 가져오기
    const { data, error } = await supabase
      .from('cart_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // 최신 순 정렬

    if (error) throw error;

    return NextResponse.json({ success: true, history: data });
  } catch (error) {
    console.error('❌ 거래 내역 조회 오류:', error);
    return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
  }
}
