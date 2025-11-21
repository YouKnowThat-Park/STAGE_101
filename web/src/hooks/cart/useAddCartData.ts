import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCart } from 'src/lib/api/cart/createCart';

const useCreateCartData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      alert('✅ 장바구니가 업데이트되었습니다.');
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });
};

export default useCreateCartData;
