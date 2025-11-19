import React from 'react';
import { SeatsChoiceProps } from 'src/types/payment/payment-type';

const SeatsChoice = ({
  theaterData,
  reservedSeats,
  selectedSeats,
  handleSeatClick,
  setStep,
  handlePayment,
  loading,
}: SeatsChoiceProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{theaterData?.name || '극장'} - 좌석 선택</h1>

      <div className="flex flex-col items-center gap-[6px] mt-6 px-2 w-full">
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-[4px]">
            {[...Array(10)].map((_, seatIndex) => {
              const seat = String.fromCharCode(65 + rowIndex) + (seatIndex + 1);
              const isReserved = reservedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  onClick={() => handleSeatClick(seat)}
                  disabled={isReserved}
                  className={`rounded-md text-[2.8vw] sm:text-[2vw] md:text-sm
              w-[7vw] h-[7vw] min-w-[24px] min-h-[24px] max-w-[36px] max-h-[36px]
              flex items-center justify-center transition font-semibold
              ${
                isReserved
                  ? 'bg-gray-500 cursor-not-allowed text-white'
                  : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-green-500 hover:bg-gray-400 text-white'
              }`}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg text-white">선택된 좌석: {selectedSeats.join(', ') || '없음'}</p>
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-3 rounded-md font-bold bg-gray-300 hover:bg-gray-400"
          >
            이전
          </button>

          <button
            onClick={handlePayment}
            className={`px-6 py-3 rounded-md text-white font-bold transition ${
              selectedSeats.length > 0 && !loading
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-500 cursor-not-allowed'
            }`}
            disabled={selectedSeats.length === 0 || loading}
          >
            {loading ? '예약 중...' : '결제하기'}
          </button>
        </div>
      </div>
    </>
  );
};

export default SeatsChoice;
