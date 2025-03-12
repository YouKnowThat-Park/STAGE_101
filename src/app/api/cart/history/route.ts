import { checkoutCart } from '@/lib/checkoutCart';
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
