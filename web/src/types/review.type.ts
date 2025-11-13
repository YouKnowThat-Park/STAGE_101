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
