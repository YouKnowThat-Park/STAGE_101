import { useQuery } from '@tanstack/react-query';
import { fetchCart } from 'src/lib/api/cart/fetchcart';

const useFetchCartData = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: () => (userId ? fetchCart(userId) : Promise.resolve([])), // ✅ userId가 없으면 빈 배열 반환
    enabled: !!userId, // user Id가 있을 경우에만 호출 없으면 queryFn 실행 안함
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60, // 1시간 동안 메모리에서 데이터를 저장함 1시간동안 api요청을 하지 않음
    retry: 2,
    refetchOnWindowFocus: false, // 기본값이 true면 api를 브라우저 탭을 다시 클릭시 요청하지 않음
    refetchOnReconnect: false,
  });
};

export default useFetchCartData;
