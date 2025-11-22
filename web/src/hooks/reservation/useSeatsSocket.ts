import { useEffect, useState } from 'react';
import { fetchOccupiedSeats } from 'src/lib/api/reservation/fetchOccupiedSeats';
import {
  ReservedSeatsMessage,
  UseReservedSeatsSocketOptions,
} from 'src/types/reservation/reservation-type';

export const useReservedSeatsSocket = (options: UseReservedSeatsSocketOptions): string[] => {
  const { enabled, theaterId, viewedAt, showTime, initialSeats } = options;
  const [reservedSeats, setReservedSeats] = useState<string[]>(initialSeats);

  useEffect(() => {
    if (!enabled) return;
    if (!theaterId || !viewedAt || !showTime) return;

    async function fetchInitial() {
      const seats = await fetchOccupiedSeats(theaterId, viewedAt, showTime);
      setReservedSeats(seats);
    }
    fetchInitial();
  }, [enabled, theaterId, viewedAt, showTime]);

  useEffect(() => {
    if (!enabled) return;
    if (!theaterId || !viewedAt || !showTime) return;

    const params = new URLSearchParams({
      theater_id: theaterId,
      viewed_at: viewedAt,
      show_time: showTime,
    });

    const ws = new WebSocket(`ws://13.221.60.6:4000/reservations/ws?${params.toString()}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as ReservedSeatsMessage;

      if (msg.type === 'reserved_seats') {
        setReservedSeats(msg.seats);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close;
      }
    };
  }, [enabled, theaterId, showTime, viewedAt]);

  return reservedSeats;
};
