import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'src/lib/api/reservation/reservationHistory';

export const useCancelReservation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      alert('예약이 취소되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['history', userId] });
    },
    onError: (error) => {
      console.error(error);
      alert('예약 취소 중 오류가 발생했습니다.');
    },
  });
};
