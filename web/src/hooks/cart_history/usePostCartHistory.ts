import { useMutation } from '@tanstack/react-query';
import { createCartHistory } from 'src/lib/api/cart_history/createCartHistory';

export const usePostCartHistory = () => {
  return useMutation({
    mutationFn: createCartHistory,
  });
};
