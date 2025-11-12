import { ReviewsType } from 'src/types/review.type';

export interface FetchAllReviewsResponse {
  reviews: ReviewsType[];
  totalCount: number;
  nextPage: number | null;
}

interface FetchAllReviewsParams {
  pageParam: number;
  sort?: 'newest' | 'oldest';
  order?: 'asc' | 'desc';
  userId?: string;
}

const fetchAllReviews = async ({
  pageParam,
  sort = 'newest',
  order = 'desc',
  userId,
}: FetchAllReviewsParams): Promise<FetchAllReviewsResponse> => {
  const query = new URLSearchParams({
    page: pageParam.toString(),
    sort,
    order,
    ...(userId ? { user_id: userId } : {}),
  });

  console.log(query.toString());

  const res = await fetch(`http://localhost:8000/reviews?${query.toString()}`, {});

  if (!res.ok) throw new Error('리뷰 데이터를 불러오지 못했습니다.');

  const data = await res.json();

  return {
    reviews: data.data ?? [],
    totalCount: data.length,
    nextPage: null,
  };
};

export default fetchAllReviews;
