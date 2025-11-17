import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchReservedSeats,
  ReservationApiResponse,
  reserveSeatApi,
  ReserveSeatsPayload,
} from 'src/lib/api/reservation/reservationHistory';

export interface UseReserveSeatsResult {
  reserveSeats: (payload: ReserveSeatsPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useReservedSeats = (
  _theaterId: string | null,
  _viewedAt: string,
  _showTime: string | null,
): UseReserveSeatsResult => {
  const mutation = useMutation<ReservationApiResponse[], Error, ReserveSeatsPayload>({
    mutationFn: (payload) => reserveSeatApi(payload),
  });

  async function reserveSeats(payload: ReserveSeatsPayload): Promise<boolean> {
    try {
      await mutation.mutateAsync(payload);
      return true;
    } catch (e) {
      console.log('시발', e);
      return false;
    }
  }

  return {
    reserveSeats,
    loading: mutation.isPending,
    error: mutation.error ? mutation.error.message || '예약 요청 중 오류가 발생했습니다.' : null,
  };
};
