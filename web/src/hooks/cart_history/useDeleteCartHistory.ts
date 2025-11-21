import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCartHistory } from 'src/lib/api/cart_history/deleteCartHistory';

export const useDeleteCartHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCartHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartHistory'] });
    },
  });
};
