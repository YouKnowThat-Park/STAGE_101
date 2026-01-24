import { useQuery } from '@tanstack/react-query';
import { fetchPopularityTheater } from 'src/lib/api/reservation/fetchPopularityTheater';

export const usePopularityTheater = () => {
  return useQuery({
    queryKey: ['PopularityTheater'],
    queryFn: fetchPopularityTheater,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};
