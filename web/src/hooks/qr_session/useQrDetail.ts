import { useQuery } from '@tanstack/react-query';
import { fetchQrDetail, QrDetailResponse } from 'src/lib/api/qr_session/qrSession';

export const useQrDetail = (reservationId: string | null | undefined) => {
  const enabled = !!reservationId;

  return useQuery<QrDetailResponse, Error>({
    queryKey: ['qrDetail', reservationId],
    queryFn: () => {
      if (!reservationId) {
        throw new Error('reservationId가 필요합니다.');
      }
      return fetchQrDetail(reservationId);
    },
    enabled,
    staleTime: 1000 * 60, // 1분
  });
};
