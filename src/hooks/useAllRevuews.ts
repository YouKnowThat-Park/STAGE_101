import { useInfiniteQuery } from '@tanstack/react-query';
import fetchAllReviews from '@/lib/fetchAllReviews';
import { ReviewsType } from '@/types/review.type';

interface UseReviewsProps {
  sort?: string;
  order?: string;
  theaterId?: string;
}

export interface FetchAllReviewsResponse {
  pages: ReviewsType[];
  nextPage?: number;
}

export function useAllReviews({
  sort = 'created_at',
  order = 'desc',
  theaterId = '',
}: UseReviewsProps) {
  return useInfiniteQuery<FetchAllReviewsResponse, Error>({
    queryKey: ['reviews', sort, order, theaterId],
    queryFn: async ({ pageParam = 1 }) =>
      fetchAllReviews({ pageParam: pageParam as number, sort, order, theaterId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
