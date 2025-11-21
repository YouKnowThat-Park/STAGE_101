import { useMutation } from '@tanstack/react-query';
import { reserveSeatApi } from 'src/lib/api/reservation/fetchReservedSeats';
import {
  ReservationApiResponse,
  ReserveSeatsPayload,
  UseReserveSeatsResult,
} from 'src/types/reservation/reservation-type';

export const useReserveSeats = (): UseReserveSeatsResult => {
  const mutation = useMutation<ReservationApiResponse[], Error, ReserveSeatsPayload>({
    mutationFn: (payload) => reserveSeatApi(payload),
  });

  async function reserveSeats(payload: ReserveSeatsPayload): Promise<boolean> {
    try {
      await mutation.mutateAsync(payload);
      return true;
    } catch {
      return false;
    }
  }

  const loading = mutation.isPending;
  const error = mutation.error ? mutation.error.message : null;

  return { reserveSeats, loading, error };
};
