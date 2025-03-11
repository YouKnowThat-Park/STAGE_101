import { serverSupabase } from '@/supabase/supabase-server';

export const checkoutCart = async (userId: string, totalPrice: number, quantity: number | null) => {
  console.log('🔥 checkoutCart 실행됨');
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

  // 3️⃣ 결제 내역 저장
  const { data: paymentData, error: paymentError } = await supabase
    .from('cart_history')
    .insert([
      {
        id: crypto.randomUUID(),
        user_id: userId,
        payment_key: crypto.randomUUID(),
        total_price: totalPrice,
        status: false,
        quantity: validQuantity,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (paymentError) {
    console.error('❌ 결제 내역 저장 실패:', paymentError);
    return { success: false, message: '결제 내역 저장 실패' };
  }

  // 4️⃣ 포인트 차감
  const { error: updateError } = await supabase
    .from('users')
    .update({ point: userData.point - totalPrice })
    .eq('id', userId);

  if (updateError) {
    return { success: false, message: '포인트 차감 실패' };
  }

  // 5️⃣ ✅ 장바구니 데이터 삭제 (결제 완료된 상품 제거)
  const { error: deleteError } = await supabase
    .from('cart') // 👉 사용자의 장바구니 데이터가 들어있는 테이블
    .delete()
    .eq('user_id', userId); // 👉 해당 유저의 장바구니 삭제

  if (deleteError) {
    return { success: false, message: '결제는 완료되었지만, 장바구니 삭제에 실패했습니다.' };
  }

  return {
    success: true,
    message: '결제 완료! 장바구니를 비웠습니다.',
    order: JSON.parse(JSON.stringify(paymentData)),
  };
};
