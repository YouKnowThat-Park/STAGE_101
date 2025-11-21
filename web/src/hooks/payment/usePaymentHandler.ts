import { useRouter } from 'next/navigation';
import { PaymentsParams } from 'src/types/payment/payment-type';

export const usePaymentHandler = () => {
  const router = useRouter();

  const handlePayment = async ({
    selectedSeats,
    userId,
    theaterId,
    viewedAt,
    showTime,
    price,
    reserveSeats,
    reserveError,
  }: PaymentsParams) => {
    if (
      !selectedSeats.length ||
      !userId ||
      !theaterId ||
      !viewedAt ||
      !showTime ||
      typeof price !== 'number' ||
      price <= 0
    ) {
      console.error('🚨 [프론트엔드] 필수 정보 누락:', {
        selectedSeats,
        userId,
        theaterId,
        viewedAt,
        showTime,
        price,
      });

      alert('🚨 날짜, 유저 정보, 좌석 정보, 상영 시간, 가격이 모두 필요합니다.');
      return;
    }

    const totalPrice = selectedSeats.length * price;

    const success = await reserveSeats({
      seat_number: selectedSeats,
      user_id: userId,
      theater_id: theaterId,
      viewed_at: viewedAt,
      show_time: showTime,
      price,
      total_price: totalPrice,
    });

    if (!success) {
      console.error('🚨 [프론트엔드] 예약 실패:', reserveError);
      alert(reserveError || '좌석 예약 실패');
      return;
    }

    router.push(`/payments/${theaterId}/${selectedSeats.join('-')}`);
  };

  return { handlePayment };
};
