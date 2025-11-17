import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPayment,
  PaymentCreatePayload,
  PaymentResponse,
  ReservationApiResponse,
  reserveSeatApi,
  ReserveSeatsPayload,
  UseReserveSeatsResult,
} from 'src/lib/api/reservation/reservationHistory';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentResponse, Error, PaymentCreatePayload>({
    mutationFn: (payload) => createPayment(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ticketHistory'] });
      queryClient.invalidateQueries({ queryKey: ['reservations', 'me'] });
      queryClient.invalidateQueries({
        queryKey: ['payments', data.user_id],
      });
    },
  });
};

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
