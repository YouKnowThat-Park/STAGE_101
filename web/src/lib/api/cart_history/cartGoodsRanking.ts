export interface GoodsRankingProps {
  id: string;
  name: string;
  value: number;
  [key: string]: string | number;
}
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const cartGoodsRanking = async (): Promise<GoodsRankingProps[]> => {
  const res = await fetch(`${API_BASE}/cart-histories/ranking`);

  if (!res.ok) {
    throw new Error('굿즈 랭킹 조회 실패');
  }

  return res.json();
};
