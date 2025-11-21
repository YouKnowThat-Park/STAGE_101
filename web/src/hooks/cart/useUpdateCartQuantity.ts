import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCartQuantity } from 'src/lib/api/cart/updateCartQuantity';

const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onMutate: async ({ user_id: userId, shop_id: shopId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ['cart', userId] });

      const previousCart = queryClient.getQueryData(['cart', userId]);

      queryClient.setQueryData(['cart', userId], (oldCart: any) =>
        oldCart
          ? oldCart.map((item: any) => (item.shop_id === shopId ? { ...item, quantity } : item))
          : [],
      );

      return { previousCart, userId };
    },
    onError: (error, _, context) => {
      console.error('🚨 장바구니 수량 변경 오류:', error);
      if (context?.previousCart) {
        queryClient.setQueryData(['cart', context.userId], context.previousCart);
      }
    },
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ['cart', user_id], refetchType: 'none' });
    },
  });
};

export default useUpdateCartQuantity;
