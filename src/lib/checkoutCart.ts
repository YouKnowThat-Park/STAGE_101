import { serverSupabase } from '@/supabase/supabase-server';

export async function checkoutCart({
  userId,
  totalPrice,
  quantity,
}: {
  userId: string;
  totalPrice: number;
  quantity: number;
}) {
  const supabase = await serverSupabase();

  const validQuantity =
    quantity !== null && quantity !== undefined ? parseInt(quantity.toString(), 10) : 1;

  if (validQuantity <= 0 || isNaN(validQuantity)) {
    console.error('❌ quantity 값이 올바르지 않습니다:', quantity);
    return { success: false, message: '잘못된 상품 수량입니다.' };
  }

  // 1️⃣ 유저 포인트 조회
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('point')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    console.error('❌ 유저 정보를 불러오지 못했습니다.', userError);
    return { success: false, message: '유저 정보를 불러오지 못했습니다.' };
  }

  // 2️⃣ 포인트 부족 체크
  if (userData.point < totalPrice) {
    return { success: false, message: '포인트가 부족합니다.' };
  }

  // 3️⃣ 🔥 장바구니(cart) 조회 (이제 `name`, `image_url`도 가져옴)
  const { data: cartData, error: cartError } = await supabase
    .from('cart')
    .select('id, name, image_url') // ✅ `name`, `image_url` 가져오기 추가
    .eq('user_id', userId)
    .order('created_at', { ascending: false }) // 최신 장바구니 우선 선택
    .limit(1)
    .single();

  if (cartError || !cartData) {
    console.error('❌ 장바구니 조회 실패:', cartError);
    return { success: false, message: '장바구니가 없습니다.' };
  }

  const cartId = cartData.id; // ✅ cart_id 가져오기
  const orderId = crypto.randomUUID(); // 🔹 새로운 주문 ID 생성 (중복 방지)

  // 4️⃣ 결제 내역 저장 (이제 `name`, `image_url` 포함)
  const { data: paymentData, error: paymentError } = await supabase
    .from('cart_history')
    .insert([
      {
        id: orderId,
        cart_id: cartId,
        user_id: userId,
        payment_key: crypto.randomUUID(),
        total_price: totalPrice,
        status: 'pending',
        quantity: validQuantity,
        name: cartData.name, // ✅ 상품명 저장
        image_url: cartData.image_url, // ✅ 이미지 저장
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (paymentError) {
    console.error('❌ 결제 내역 저장 실패:', paymentError);
    return { success: false, message: '결제 내역 저장 실패' };
  }

  // 5️⃣ 포인트 차감
  const { error: updateError } = await supabase
    .from('users')
    .update({ point: userData.point - totalPrice })
    .eq('id', userId);

  if (updateError) {
    return { success: false, message: '포인트 차감 실패' };
  }

  // 6️⃣ ✅ 장바구니 데이터 삭제 (결제 완료된 상품 제거)
  const { error: deleteError } = await supabase.from('cart').delete().eq('id', cartId);

  if (deleteError) {
    console.error('❌ 장바구니 삭제 실패:', deleteError);
    return {
      success: true,
      message: '결제는 완료되었지만, 장바구니 삭제에 실패했습니다.',
      order: JSON.parse(JSON.stringify(paymentData)),
    };
  }

  return {
    success: true,
    message: '결제 완료! 장바구니를 비웠습니다.',
    order: JSON.parse(JSON.stringify(paymentData)),
  };
}
