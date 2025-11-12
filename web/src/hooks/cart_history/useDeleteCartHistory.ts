import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteCartHistory } from 'src/lib/api/cart/cartHistory';

export const useDeleteCartHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteCartHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartHistory'] });
    },
  });
};
