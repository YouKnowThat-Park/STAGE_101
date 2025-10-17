// hooks/useFetchReviews.ts

import { useQuery } from '@tanstack/react-query';

interface Review {
  user_id: string;
  theater_id: string;
  content: string;
}

interface ReviewResponse {
  reviewCount: number;
  reviews: Review[];
}

async function fetchReviews(
  userId: string | null,
  theaterId: string | null,
): Promise<ReviewResponse> {
  const url = new URL('/api/reviews/count-review', window.location.origin);
  if (userId) url.searchParams.append('userId', userId);
  if (theaterId) url.searchParams.append('theaterId', theaterId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
}

const useFetchReviews = (userId: string | null, theaterId: string | null) => {
  return useQuery<ReviewResponse, Error>({
    queryKey: ['reviews', userId, theaterId],
    queryFn: () => fetchReviews(userId, theaterId),
    enabled: !!userId || !!theaterId, // userId나 theaterId가 있을 때만 요청
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터가 fresh 상태로 유지
    retry: 2, // 최대 2번까지 재시도
    refetchOnWindowFocus: false, // 브라우저 포커스 시 refetch 하지 않음
    refetchOnReconnect: false, // 네트워크 재연결 시 refetch 하지 않음
  });
};

export default useFetchReviews;
