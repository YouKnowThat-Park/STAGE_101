import { useUserStore } from 'src/store/userStore';
import { ReviewsType } from 'src/types/review.type';

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

const API_BASE = 'http://localhost:8000';

export const fetchAllReviews = async ({
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

  const res = await fetch(`${API_BASE}/reviews?${query.toString()}`, {
    method: 'GET',
    credentials: 'include', // 있어도 되고 없어도 됨
  });

  if (!res.ok) throw new Error('리뷰 데이터를 불러오지 못했습니다.');

  const data = await res.json(); // { data, totalCount, nextPage }

  return {
    reviews: data.data ?? [],
    totalCount: data.totalCount ?? 0,
    nextPage: data.nextPage ?? null,
  };
};

export const fetchReviewsRanking = async (): Promise<UserReviewRanking[]> => {
  const res = await fetch('http://localhost:8000/reviews/ranking');

  if (!res.ok) {
    throw new Error('리뷰 랭킹 데이터를 불러오는데 실패했습니다.');
  }

  return res.json();
};

export const fetchMyReviews = async (): Promise<FetchAllReviewsResponse> => {
  const { id } = useUserStore.getState();

  if (!id) {
    throw new Error('로그인이 필요합니다.');
  }

  return fetchAllReviews({
    pageParam: 1,
    sort: 'newest',
    order: 'desc',
    userId: id, // ⭐ 여기서만 user_id 필터
  });
};
