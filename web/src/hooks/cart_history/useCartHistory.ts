import { useQuery } from '@tanstack/react-query';
import { fetchCartHistory } from 'src/lib/api/cart/cartHistory';
import { CartHistory } from 'src/types/cart-history-type';

export const useCartHistory = () => {
  const { data, isLoading, error } = useQuery<CartHistory[]>({
    queryKey: ['cartHistory'],
    queryFn: fetchCartHistory,
    staleTime: 1000 * 60 * 5,
  });

  return {
    history: data,
    isLoading,
    error,
  };
};
