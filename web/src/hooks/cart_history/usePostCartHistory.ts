import { useMutation } from '@tanstack/react-query';
import { postCartHistory } from 'src/lib/api/cart/cartHistory';

export const usePostCartHistory = () => {
  return useMutation({
    mutationFn: postCartHistory,
  });
};
