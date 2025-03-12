import { serverSupabase } from '@/supabase/supabase-server';

const API_BASE = '/api/cart';

// ✅ 장바구니 데이터 조회
export const fetchCartData = async (userId: string) => {
  const res = await fetch(`${API_BASE}?user_id=${userId}`);
  if (!res.ok) throw new Error('장바구니 데이터를 불러오지 못했습니다.');
  return (await res.json()).data;
};

// ✅ 장바구니 아이템 삭제
export const deleteCartData = async (userId: string, shopId: string) => {
  const res = await fetch(`/api/cart?user_id=${userId}&shop_id=${shopId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('장바구니 삭제 실패');
  return (await res.json()).message;
};

// ✅ 장바구니 수량 업데이트
export async function updateCartQuantity(
  userId: string,
  shopId: string,
  quantity: number,
): Promise<void> {
  const supabase = await serverSupabase();

  const { error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('shop_id', shopId);

  if (error) throw new Error(`🚨 장바구니 수량 업데이트 실패: ${error.message}`);
}
