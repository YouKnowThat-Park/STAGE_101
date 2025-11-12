import { fetchTicketHistory } from '../lib/api/reservation/reservationHistory';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useTicketHistory = (userId: string) => {
  const queryClient = useQueryClient(); // react-query의 queryClient를 가져옵니다.

  const { data, error, isLoading } = useQuery({
    queryKey: ['history', userId] as const, // 'history'와 userId로 배열을 만듭니다. QueryKey로 강제 타입 지정
    queryFn: () => fetchTicketHistory(userId),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });

  // 예약 취소 후 데이터를 갱신하려면, queryClient.invalidateQueries를 사용
  const refetchHistory = async () => {
    const queryKey = ['history', userId] as const; // 'as const'로 queryKey를 고정시켜 정확한 타입을 지정
    await queryClient.invalidateQueries({ queryKey }); // invalidateQueries에 정확한 queryKey를 전달
  };

  return {
    data,
    error,
    isLoading,
    refetchHistory, // 이 함수를 컴포넌트에서 사용할 수 있게 전달합니다.
  };
};
