import { useMutation } from '@tanstack/react-query';
import { createCartHistory } from 'src/lib/api/cart_history/createCartHistory';

export const useCreateCartHistory = () => {
  return useMutation({
    mutationFn: createCartHistory,
  });
};
