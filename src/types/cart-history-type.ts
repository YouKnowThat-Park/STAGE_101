import { Tables } from './supabase-type';

export type CartHistory = Tables<'cart_history'> & {
  cart?: {
    name: string | null;
    image_url: string | null;
  };
};
