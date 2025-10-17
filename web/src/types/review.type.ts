import { Tables } from './supabase-type';

// 'reviews' 테이블의 데이터 타입을 기반으로 하여 리뷰 데이터 타입 정의
export type ReviewsType = Tables<'reviews'> & {
  theaters?: {
    name: string;
  };
  users?: {
    profile_img: string | null;
    name: string;
    nickname: string;
    total_reviews: number; // 해당 유저의 총 리뷰 수 추가
  };
  total_reviews?: number;
  past_views: number;
};

// 유저 리뷰 개수 타입 정의
export type UserReviewCountType = {
  user_id: string; // 유저의 ID (식별자)
  total_reviews: number; // 해당 유저가 작성한 총 리뷰 개수
};
