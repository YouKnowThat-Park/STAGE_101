import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCartItem } from 'src/lib/api/cart/cart';

export const useDeleteCartItem = (user_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shop_id }: { shop_id: string }) => deleteCartItem(user_id, shop_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user_id] });
    },
  });
};
