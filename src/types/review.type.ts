import { Tables } from './supabase-type';

export type ReviewsType = Tables<'reviews'> & {
  theaters?: {
    name: string;
  };
};
