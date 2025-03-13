import { ReviewsType } from '@/types/review.type';

interface FetchAllReviewsProps {
  pageParam: number; // 🔥 반드시 number로 설정
  sort: string;
  order: string;
  theaterId?: string;
}

interface FetchAllReviewsResponse {
  pages: ReviewsType[];
  nextPage?: number; // ✅ undefined 허용하여 타입 오류 방지
}

const fetchAllReviews = async ({
  pageParam,
  sort,
  order,
  theaterId,
}: FetchAllReviewsProps): Promise<FetchAllReviewsResponse> => {
  const queryParams = new URLSearchParams({
    sort,
    order,
    page: String(pageParam),
    ...(theaterId ? { theaterId } : {}),
  });

  const res = await fetch(`/api/reviews/all-reviews?${queryParams.toString()}`);
  if (!res.ok) throw new Error('데이터를 가져오지 못했습니다.');

  const data: ReviewsType[] = await res.json();

  return {
    pages: data,
    nextPage: data.length > 0 ? pageParam + 1 : undefined, // ✅ undefined 반환하여 타입 오류 방지
  };
};

export default fetchAllReviews;
