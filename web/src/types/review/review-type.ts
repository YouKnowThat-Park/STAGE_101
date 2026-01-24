export interface TheaterSummary {
  id: string;
  name: string;
}
export interface ReviewsType {
  id: string;
  user_id: string;
  theater_id: string;
  comment: string;
  created_at: string;
  display_name: string;
  type: string;
  dislike_count: number;
  image_url: string | null;

  theater?: TheaterSummary | null;

  // 유저 총 리뷰 수 / 여러 번 감상한 횟수 같은 통계성 필드
  total_reviews?: number;
  past_views?: number;
}

export interface FetchAllReviewsResponse {
  reviews: ReviewsType[];
  totalCount: number;
  nextPage: number | null;
}

export interface FetchAllReviewsParams {
  pageParam: number;
  sort?: 'newest' | 'oldest';
  order?: 'asc' | 'desc';
  userId?: string;
}

export interface UserReviewRanking {
  user_id: string;
  theater_id: string;
  nickname: string;
  profile_img: string;
  count: number;
}

export type ReviewImageType = 'poster' | 'profile';

export interface CreateReviewParams {
  comment: string;
  type: ReviewImageType;
  theaterId: string;
}

export interface CreatedReview {
  id: string;
  user_id: string;
  theater_id: string;
  comment: string;
  created_at: string;
  display_name: string;
  type: string;
  dislike_count: number;
  image_url: string | null;
}

export interface TheaterReviewRanking {
  theater_id: number;
  count: number;
  name: string;
}
