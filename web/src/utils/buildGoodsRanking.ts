import { CartHistoryItem, GoodsChartItem } from 'src/types/cart/cart-history-type';

export const buildGoodsRanking = (
  histories: CartHistoryItem[],
  shops: { id: string; name: string }[],
): GoodsChartItem[] => {
  const shopMap = new Map(shops.map((s) => [s.name, s.id]));
  const map = new Map<string, number>();

  histories.forEach((history) => {
    if (history.status !== 'pending') return;
    if (!history.name) return;

    const prev = map.get(history.name) ?? 0;
    map.set(history.name, prev + history.quantity);
  });

  return Array.from(map.entries())
    .map(([name, value]) => ({
      id: shopMap.get(name) ?? name, // 🔥 여기서 id 매핑
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};
