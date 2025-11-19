import { useQuery } from '@tanstack/react-query';
import { fetchCartHistory } from 'src/lib/api/cart/cartHistory';

export const useCartHistory = () => {
  const { data, isLoading, error } = useQuery({
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
