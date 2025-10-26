import { Tables } from './supabase-type';

export type ReservationsType = Tables<'reservations'>;

export type ReserveType = Omit<Tables<'reservations'>, 'created_at' | 'id'>;
