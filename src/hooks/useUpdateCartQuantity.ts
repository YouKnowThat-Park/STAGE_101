import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateCartQuantity = async ({
  userId,
  shopId,
  quantity,
}: {
  userId: string;
  shopId: string;
  quantity: number;
}) => {
  const res = await fetch('/api/cart', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, shop_id: shopId, quantity }),
  });

  if (!res.ok) throw new Error('장바구니 수량 업데이트 실패');
  return { shopId, quantity }; // ✅ 성공 시 변경된 수량 반환
};

const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartQuantity,
    onMutate: async ({ userId, shopId, quantity }) => {
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
    onSuccess: (_, { userId }) => {
      // ✅ 기존 데이터를 유지하면서, 새로고침을 하지 않음
      queryClient.invalidateQueries({ queryKey: ['cart', userId], refetchType: 'none' });
    },
  });
};

export default useUpdateCartQuantity;
