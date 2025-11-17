import { useState } from 'react';

export const useSeatSelection = (reservedSeats: string[], maxSeats = 4) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seat: string) => {
    if (reservedSeats.includes(seat)) {
      console.warn(`⚠️ 이미 예약된 좌석: ${seat}`);
      return;
    }

    setSelectedSeats((prev) => {
      const updated = prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat].slice(0, maxSeats);
      return updated;
    });
  };

  const resetSeats = () => setSelectedSeats([]);

  return { selectedSeats, handleSeatClick, resetSeats };
};
