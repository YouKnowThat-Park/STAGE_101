'use client';

import { useState } from 'react';
import { useTheaterData } from '../../../hooks/theater/useTheaterData';
import TheaterCalendar from '../../theater/_components/TheaterCalendar';
import { useUserHook } from 'src/hooks/user/useUserHook';
import { useReservedSeatsSocket } from 'src/hooks/reservation/useSeatsSocket';
import { useReservedSeats } from 'src/hooks/reservation/useReservedSeats';
import SeatsChoice from './_components/SeatsChoice';
import { useTheaterId } from 'src/hooks/payment/useTheaterId';
import { useSeatSelection } from 'src/hooks/payment/useSeatSelection';
import { usePaymentHandler } from 'src/hooks/payment/usePaymentHandler';
import formatDateToYMD from 'src/utils/formatDateToYYYYMMDD';
import { ClientPaymentsPageProps } from 'src/types/payment/payment-type';
import { useUserStore } from 'src/store/userStore';

const ClientPaymentsPage = ({ initialSeats, theaterType }: ClientPaymentsPageProps) => {
  const [step, setStep] = useState(1);
  const [viewedAt, setViewedAt] = useState<string>('');

  // 유저 정보 가져오는 hook
  const { id } = useUserStore();

  // 극장 Id 가져오는 hook
  const { theaterId } = useTheaterId(theaterType);

  // 극장 정보 가져오는 hook
  const { data: theaterData, isLoading, error } = useTheaterData(theaterId);

  // 예약 요청 hook
  const {
    reserveSeats,
    loading,
    error: reserveError,
  } = useReservedSeats(theaterId || null, viewedAt, theaterData?.show_time ?? null);

  const userId = id || '';

  // 좌석 정보 불러오기
  const reservedSeats = useReservedSeatsSocket({
    enabled: step === 2 && !!viewedAt && !!theaterData?.show_time,
    theaterId,
    viewedAt,
    showTime: theaterData?.show_time ?? '',
    initialSeats,
  });

  // 날짜 선택 후 Step 변경
  const handleCalendarNext = (date: Date) => {
    setViewedAt(formatDateToYMD(date));
    setStep(2);
  };

  // 좌석 선택, 상태 관리 hook
  const { selectedSeats, handleSeatClick } = useSeatSelection(reservedSeats);

  // 결제하기 관련 핸들러
  const { handlePayment } = usePaymentHandler();

  const handleSeatPayment = async () => {
    await handlePayment({
      selectedSeats,
      userId,
      theaterId,
      viewedAt,
      showTime: theaterData.show_time,
      price: theaterData.price,
      reserveSeats,
      reserveError,
    });
  };

  if (!theaterId) {
    return <div className="text-white text-center p-6">🚨 극장 정보가 없습니다.</div>;
  }
  if (isLoading || !theaterData) {
    return <p className="text-center text-gray-500">🎭 데이터 로딩 중...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">❌ 극장 정보를 불러오는 중 오류 발생</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center  text-black p-6">
      {/* STEP 1: 달력 (날짜 선택) */}
      {step === 1 && (
        <TheaterCalendar theaterId={theaterId} onDateTimeSelect={handleCalendarNext} />
      )}

      {/* STEP 2: 좌석 선택 */}
      {step === 2 && (
        <SeatsChoice
          theaterData={theaterData}
          reservedSeats={reservedSeats}
          selectedSeats={selectedSeats}
          handlePayment={handleSeatPayment}
          handleSeatClick={handleSeatClick}
          setStep={setStep}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ClientPaymentsPage;
