import { useQuery } from '@tanstack/react-query';
import { fetchTheaterData } from 'src/lib/api/theater/theater';

export const useTheaterData = (theaterId: string) => {
  return useQuery({
    queryKey: ['theater', theaterId], //
    queryFn: () => fetchTheaterData(theaterId), //
    enabled: !!theaterId, //
  });
};
