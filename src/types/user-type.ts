import { Tables } from './supabase-type';

export type UserType = Tables<'users'>;

export interface OpenUserType {
  nickname: UserType;
  point: UserType;
  profile_img: UserType;
}
