import { useQuery } from '@tanstack/react-query';
import { fetchMyReviews } from 'src/lib/api/review/fetchReview';

export const useMyReviews = () => {
  return useQuery({
    queryKey: ['user-my-reviews'],
    queryFn: fetchMyReviews,
    select: (data) => data.reviews ?? [],
  });
};
