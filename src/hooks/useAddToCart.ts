import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartType } from '@/types/cart.type';

interface AddToCartProps {
  userId: string;
  shopId: string;
  item: Omit<CartType, 'id' | 'user_id' | 'shop_id' | 'created_at'>;
  quantity?: number; // ✅ 수량을 추가하여 업데이트에도 활용 가능
}

// ✅ 장바구니에 추가 또는 업데이트 요청
const addToCart = async ({ userId, shopId, item, quantity }: AddToCartProps) => {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      shop_id: shopId,
      ...item,
      quantity: quantity ?? item.quantity, // ✅ 수량 변경을 위한 로직 추가
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || '장바구니 추가 실패');
  }
};

const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      alert('✅ 장바구니가 업데이트되었습니다.');
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });
};

export default useAddToCart;
