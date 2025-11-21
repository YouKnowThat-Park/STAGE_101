import { useQuery } from '@tanstack/react-query';
import { fetchShopById, fetchShops } from 'src/lib/api/shop/fetchShop';

const useShop = (shopId?: string) => {
  // 전체 페이지용 모든 데이터 조회
  const shopsQuery = useQuery({
    queryKey: ['shops'],
    queryFn: fetchShops,
    enabled: !shopId,
  });
  // 상세 페이지용 단일 데이터 조회
  const shopByIdQuery = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => fetchShopById(shopId!),
    enabled: !!shopId,
  });

  const loading = shopByIdQuery.isLoading || shopsQuery.isLoading;
  const error = shopByIdQuery.error || shopsQuery.error;

  return { items: shopsQuery.data ?? [], item: shopByIdQuery.data ?? null, loading, error };
};

export default useShop;
