import { ReserveSeatsFn } from '../reservation/reservation-type';

export interface PaymentsParams {
  selectedSeats: string[];
  userId: string;
  theaterId: string;
  viewedAt: string;
  showTime: string;
  price: number;
  reserveSeats: ReserveSeatsFn;
  reserveError: string | null;
}

export interface PaymentResponseInner {
  payment_method: string;
}

export interface PaymentResponse {
  id: string;
  user_id: string;
  reservation_id: string;
  amount: number;
  point_earned: number;
  payment_key: string;
  payment_method: string;
  status: string; // 'paid'
  created_at: string;
}

export interface PaymentCreatePayload {
  user_id: string;
  reservation_id: string;
  amount: number;
  point_earned: number;
  payment_key: string;
  payment_method: string;
}

export interface SeatsChoiceProps {
  theaterData: {
    name?: string;
  };
  reservedSeats: string[];
  selectedSeats: string[];
  handleSeatClick: (seat: string) => void;
  setStep: (step: number) => void;
  handlePayment: () => Promise<void>;
  loading: boolean;
}

export interface ClientPaymentsPageProps {
  initialSeats: string[];
  theaterType: string;
}

export interface CheckoutPageProps {
  params: { id: string; theaterId: string };
}

export type SearchParams = { [key: string]: string | string[] | undefined };

export interface PaymentSuccessPageProps {
  searchParams: SearchParams;
}

export interface PaymentHistoryItem {
  id: string;
  reservation_id: string;
  amount: number;
  payment_key: string;
  status: string;
}

export type ReservationForPayment = {
  id: string;
  seat_number: string[];
  qr_session?: { qr_token?: string | null } | null;
};
