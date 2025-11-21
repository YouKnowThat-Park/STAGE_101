import { useQuery } from '@tanstack/react-query';
import { fetchQrCode, fetchQrCodeByToken } from 'src/lib/api/qr_session/fetchQrCode';
import { QrDetailResponse } from 'src/types/qr-session/qr-session-type';

export const useQrDetail = (reservationId: string | null | undefined) => {
  return useQuery<QrDetailResponse, Error>({
    queryKey: ['qrDetail', reservationId],
    queryFn: () => {
      if (!reservationId) {
        throw new Error('reservationId가 없습니다.');
      }
      return fetchQrCode(reservationId);
    },
    enabled: !!reservationId,
  });
};

export const useQrDetailByToken = (qrToken: string | null | undefined) => {
  return useQuery<QrDetailResponse, Error>({
    queryKey: ['qrDetailByToken', qrToken],
    queryFn: () => {
      if (!qrToken) {
        throw new Error('qrToken이 없습니다.');
      }
      return fetchQrCodeByToken(qrToken);
    },
    enabled: !!qrToken,
  });
};
