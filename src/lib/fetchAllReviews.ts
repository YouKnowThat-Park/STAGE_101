import { ReviewsType } from '@/types/review.type';

export interface FetchAllReviewsProps {
  pageParam: number; // 페이지 번호
  sort: string; // 정렬 옵션 ('newest', 'oldest' 등)
  order: string; // 정렬 순서 ('asc', 'desc' 등)
  theaterId?: string; // 선택적 필터 (극장 ID)
  userId?: string; // 사용자 ID
}

export interface FetchAllReviewsResponse {
  reviews: ReviewsType[]; // 현재 페이지의 리뷰 목록
  totalCount: number; // 전체 리뷰 수 (페이지네이션 용)
  nextPage?: number; // 다음 페이지 번호 (없으면 undefined)
}

const fetchAllReviews = async ({
  pageParam,
  sort,
  order,
  theaterId,
  userId,
}: FetchAllReviewsProps): Promise<FetchAllReviewsResponse> => {
  // URL 파라미터 생성
  const queryParams = new URLSearchParams({
    sort: sort === 'newest' ? 'created_at' : 'created_at',
    order,
    page: String(pageParam),
    ...(userId ? { userId } : {}), // ✅ userId 있을 때만 추가
    ...(theaterId ? { theaterId } : {}),
  });

  // 서버에서 리뷰 데이터를 가져옴
  const res = await fetch(`/api/reviews/all-reviews?${queryParams.toString()}`);
  if (!res.ok) throw new Error('데이터를 가져오지 못했습니다.');

  // 응답 데이터를 파싱
  const { reviews, totalCount }: { reviews: ReviewsType[]; totalCount?: number } = await res.json();

  // totalCount가 undefined일 경우 기본값 0으로 설정
  const total = totalCount ?? 0;

  // 다음 페이지가 있을지 계산 (reviews.length가 0이 아니고 전체 리뷰 수가 pageParam * 6보다 크면 다음 페이지 있음)
  return {
    reviews,
    totalCount: total,
    nextPage: reviews.length > 0 && total > pageParam * 6 ? pageParam + 1 : undefined,
  };
};

export default fetchAllReviews;
