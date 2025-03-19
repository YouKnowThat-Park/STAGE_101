import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await serverSupabase();

  try {
    const { user_id, shop_id, quantity, image_url, name, point } = await req.json();

    if (!user_id || !shop_id || !quantity) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 기존 장바구니 데이터 확인
    const { data: existingCart, error: fetchError } = await supabase
      .from('cart')
      .select('id, quantity')
      .eq('user_id', user_id)
      .eq('shop_id', shop_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const newQuantity = existingCart ? existingCart.quantity + quantity : quantity;

    // 장바구니에 추가 (중복 방지)
    const { data, error } = await supabase.from('cart').upsert(
      [
        {
          id: existingCart?.id || crypto.randomUUID(), // ✅ 기존 ID 유지
          user_id,
          shop_id,
          quantity: newQuantity,
          image_url,
          name,
          point,
        },
      ],
      { onConflict: 'user_id, shop_id' },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '장바구니에 추가되었습니다.', data }, { status: 201 });
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

  const { data, error } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

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

    // 1️⃣ cart 테이블에서 삭제할 데이터의 cart_id 찾기
    const { data: cartData, error: cartFindError } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', user_id)
      .eq('shop_id', shop_id)
      .single();

    if (cartFindError || !cartData) {
      return NextResponse.json(
        { error: '해당 장바구니 아이템을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    const cart_id = cartData.id;

    // 2️⃣ cart_history에서 해당 cart_id 삭제 (Foreign Key Constraint 해결)
    const { error: historyDeleteError } = await supabase
      .from('cart_history')
      .delete()
      .eq('cart_id', cart_id);

    if (historyDeleteError) {
      throw historyDeleteError;
    }

    // 3️⃣ cart 테이블에서 해당 cart_id 삭제
    const { error: deleteError } = await supabase.from('cart').delete().eq('id', cart_id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: '장바구니에서 삭제되었습니다.' }, { status: 200 });
  } catch (error: any) {
    console.error('❌ 장바구니 삭제 오류:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user_id, shop_id, quantity } = await req.json();

    if (!user_id || !shop_id || quantity === undefined) {
      return NextResponse.json({ error: '🚨 잘못된 요청입니다.' }, { status: 400 });
    }

    const supabase = await serverSupabase();
    const { error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('user_id', user_id)
      .eq('shop_id', shop_id);

    if (error) {
      console.error('🚨 장바구니 수량 업데이트 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new Response(null, { status: 204 }); // ✅ 성공하면 204 No Content 반환
  } catch (error) {
    console.error('🚨 서버 오류:', error);
    return NextResponse.json({ error: '🚨 서버 오류 발생' }, { status: 500 });
  }
}
