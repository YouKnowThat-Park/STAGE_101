import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CartType } from '@/types/cart.type';

interface AddToCartProps {
  userId: string;
  shopId: string;
  item: Omit<CartType, 'id' | 'user_id' | 'shop_id' | 'created_at'>; // ✅ id 제외 (DB에서 자동 생성되므로)
}

const addToCart = async ({ userId, shopId, item }: AddToCartProps) => {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      shop_id: shopId,
      ...item,
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
      queryClient.invalidateQueries({ queryKey: ['cart'] }); // ✅ 장바구니 캐시 무효화 → 자동 업데이트
      alert('✅ 장바구니에 추가되었습니다.');
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });
};

export default useAddToCart;
