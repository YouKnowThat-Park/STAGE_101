import { UserReviewRanking } from 'src/types/review/review-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchReviewsRanking = async (): Promise<UserReviewRanking[]> => {
  const res = await fetch(`${API_BASE}/reviews/ranking`);

  if (!res.ok) {
    throw new Error('리뷰 랭킹 데이터를 불러오는데 실패했습니다.');
  }

  return res.json();
};
