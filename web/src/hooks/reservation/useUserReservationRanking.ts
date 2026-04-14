import { useQuery } from '@tanstack/react-query';
import { fetchUserReservationRanking } from 'src/lib/api/reservation/fetchUserReservationRanking';

export const useUserReservationRanking = (userId: string) => {
  return useQuery({
    queryKey: ['user-reservation-ranking', userId],
    queryFn: () => fetchUserReservationRanking(userId),
    enabled: Boolean(userId),
  });
};
