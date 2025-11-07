import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCartData } from 'src/lib/api/cart/cart';

const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCartData,
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
