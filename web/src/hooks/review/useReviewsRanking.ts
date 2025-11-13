import { useQuery } from '@tanstack/react-query';
import { fetchReviewsRanking } from 'src/lib/api/review/review';

export const useReviewRanking = () => {
  return useQuery({
    queryKey: ['user-review-ranking'],
    queryFn: fetchReviewsRanking,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};
