import { serverSupabase } from '@/supabase/supabase-server';

export const getCartHistory = async (userId: string) => {
  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('cart_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('결제 내역 조회 실패:', error);
    return [];
  }

  return data; // ✅ 결제 내역 반환
};
