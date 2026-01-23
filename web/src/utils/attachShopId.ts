import { GoodsChartItem } from 'src/types/cart/cart-history-type';

export const attachShopId = (
  ranking: GoodsChartItem[],
  shops: { id: string; name: string }[],
): GoodsChartItem[] => {
  const shopMap = new Map(shops.map((s) => [s.name.trim().toLowerCase(), s.id]));

  return ranking.map((item) => {
    const key = item.name.trim().toLowerCase();
    return {
      ...item,
      id: shopMap.get(key) ?? item.id,
    };
  });
};
