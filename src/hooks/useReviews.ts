import fetchReviews from '@/utils/api/fetchReview';
import { useQuery } from '@tanstack/react-query';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 5,
  });
};
