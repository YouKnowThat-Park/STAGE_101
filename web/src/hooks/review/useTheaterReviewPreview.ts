import { useQuery } from '@tanstack/react-query';
import { fetchAllReviews } from 'src/lib/api/review/fetchReview';

export const useTheaterReviewPreview = (theaterId: string, limit = 2) => {
  return useQuery({
    queryKey: ['theater-review-preview', theaterId, limit],
    queryFn: async () => {
      const response = await fetchAllReviews({
        pageParam: 1,
        sort: 'newest',
        order: 'desc',
        theaterId,
        limit,
      });

      return response.reviews;
    },
    enabled: Boolean(theaterId),
  });
};
