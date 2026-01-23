import { useQuery } from '@tanstack/react-query';
import { cartGoodsRanking } from 'src/lib/api/cart_history/cartGoodsRanking';

export const useGoodsRanking = () => {
  return useQuery({
    queryKey: ['useGoodsRanking'],
    queryFn: cartGoodsRanking,
  });
};
