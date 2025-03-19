// lib/fetchReviewsCount.ts
export const fetchReviewsCount = async (userId: string) => {
  const response = await fetch(`/api/reviews/count-review?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch reviews count');
  }
  const data = await response.json();
  return data.totalCount; // 또는 필요한 구조에 맞게 반환
};
