import { useQuery } from '@tanstack/react-query';
import { fetchTheaterList } from 'src/lib/api/theater/fetchTheaterList';
import { TheaterListParams } from 'src/types/theater/theater-type';

export const useTheaterList = (params: TheaterListParams) => {
  const normalized = {
    status: false,
    limit: 20,
    offset: 0,
    ...params,
  };

  return useQuery({
    queryKey: ['useTheaterList', params],
    queryFn: () => fetchTheaterList(params),
  });
};
