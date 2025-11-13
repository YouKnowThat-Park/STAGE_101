import { useQuery } from '@tanstack/react-query';
import { fetchMyReviews } from 'src/lib/api/review/review';

export const useMyReviews = () => {
  return useQuery({
    queryKey: ['user-my-reviews'],
    queryFn: fetchMyReviews,
    select: (data) => data.data ?? [],
  });
};
