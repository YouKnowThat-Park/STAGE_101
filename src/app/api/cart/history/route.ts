import { checkoutCart } from '@/lib/checkoutCart';
import { serverSupabase } from '@/supabase/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, totalPrice, quantity } = await req.json();

    if (!userId?.trim()) {
      return NextResponse.json({ success: false, message: '유저 ID가 없습니다.' }, { status: 400 });
    }

    const result = await checkoutCart({ userId, totalPrice, quantity });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || '결제 실패' },
        { status: 400 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ 결제 API 오류:', error);
    return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const supabase = await serverSupabase(); // ✅ `await` 제거 안 함 ㅋㅋ

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId')?.trim();

    if (!userId) {
      return NextResponse.json({ success: false, message: '유저 ID가 없습니다.' }, { status: 400 });
    }

    // 🔹 `cart_history`와 `cart` 테이블을 `JOIN`하여 `image_url`과 `name` 가져오기
    const { data, error } = await supabase
      .from('cart_history')
      .select(
        '*', // ✅ `cart` 테이블의 `name`과 `image_url`을 포함
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // 최신순 정렬

    if (error) {
      console.error('❌ Supabase 오류:', error);
      return NextResponse.json(
        { success: false, message: '데이터베이스 오류 발생' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, history: data });
  } catch (error) {
    console.error('❌ 거래 내역 조회 오류:', error);
    return NextResponse.json({ success: false, message: '서버 오류 발생' }, { status: 500 });
  }
}
