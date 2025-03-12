import { fetchTicketHistory } from '@/utils/api/fetchTicketHistory';
import { useQuery } from '@tanstack/react-query';

export const useTicketHistory = (userId: string) => {
  return useQuery({
    queryKey: ['history', userId],
    queryFn: () => fetchTicketHistory(userId),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });
};
