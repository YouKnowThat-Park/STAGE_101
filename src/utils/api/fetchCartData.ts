// import { serverSupabase } from '@/supabase/supabase-server';
// import { CartType } from '@/types/cart.type';

// const fetchCartData = async (userId: string): Promise<CartType[]> => {
//   const supabase = serverSupabase();

//   const { data, error } = await supabase.from('cart').select('*').eq('user_id', userId);
//   if (error) throw new Error(error.message);

//   return data;
// };

// export default fetchCartData;
