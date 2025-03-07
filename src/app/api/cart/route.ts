import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await serverSupabase();

  try {
    const { user_id, shop_id, quantity, image_url, name, point } = await req.json();

    if (!user_id || !shop_id || !quantity) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }
    const { data: existingCart, error: fetchError } = await supabase
      .from('cart')
      .select('quantity')
      .eq('user_id', user_id)
      .eq('shop_id', shop_id)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') {
      // 'PGRST116' = 데이터 없음
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const newQuantity = existingCart ? existingCart.quantity + quantity : quantity; // ✅ 기존 수량 + 새로 추가된 수량
    const { data, error } = await supabase.from('cart').upsert(
      [
        {
          user_id,
          shop_id,
          quantity: newQuantity, // ✅ 기존 수량 + 추가 수량
          image_url,
          name,
          point,
        },
      ],
      {
        onConflict: 'user_id, shop_id', // ✅ user_id & shop_id 기준으로 중복 방지
      },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '장바구니에 추가 되었습니다.', data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'user_id가 필요합니다.' }, { status: 400 });
  }

  const { data, error } = await supabase.from('cart').select('*').eq('user_id', user_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const supabase = await serverSupabase();
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const shop_id = searchParams.get('shop_id');
    if (!user_id || !shop_id) {
      return NextResponse.json({ error: 'user_id와 shop_id가 필요합니다.' }, { status: 400 });
    }
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user_id)
      .eq('shop_id', shop_id);
    if (error) throw error;
    return NextResponse.json({ message: '장바구니에서 삭제되되었습니다.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
