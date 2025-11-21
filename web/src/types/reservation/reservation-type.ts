import { PaymentResponseInner, QrSessionResponse } from 'src/lib/api/reservation/fetchCheckSummary';
import { TheaterResponse } from '../theater/theater-type';

export interface ReservationType {
  id: string;
  theater_id: string;
  seat_number: string;
  total_price: number;
  status: string;
  created_at: string;
  theater_name: string;
  start_date: string;
  end_date: string | null;
  main_img: string;
  type: string;
  payment_method: string;
  qr_token: string | null;
}

export interface ReservationApiResponse {
  id: string;
  theater_id: string;
  seat_number: string[];
  total_price: number;
  status: string;
  created_at: string;
  viewed_at?: string | null;
  show_time?: string | null;
  theater?: TheaterResponse | null;
  payment?: PaymentResponseInner | null;
  qr_session?: QrSessionResponse | null;
}

export interface ReserveSeatsPayload {
  seat_number: string[];
  user_id: string;
  theater_id: string;
  viewed_at: string;
  show_time: string;
  price: number;
  total_price: number;
}

export interface UseReserveSeatsResult {
  reserveSeats: (payload: ReserveSeatsPayload) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export interface ReservedSeatsMessage {
  type: 'reserved_seats';
  seats: string[];
}

export interface UseReservedSeatsSocketOptions {
  enabled: boolean;
  theaterId: string;
  viewedAt: string;
  showTime: string;
  initialSeats: string[];
}

export interface ReserveSeatsPayload {
  seat_number: string[];
  user_id: string;
  theater_id: string;
  viewed_at: string;
  show_time: string;
  price: number;
  total_price: number;
}

export type ReserveSeatsFn = (payload: ReserveSeatsPayload) => Promise<boolean>;
