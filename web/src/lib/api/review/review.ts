import { useUserStore } from 'src/store/userStore';
import {
  CreatedReview,
  CreateReviewParams,
  FetchAllReviewsParams,
  FetchAllReviewsResponse,
  UserReviewRanking,
} from 'src/types/review/review-type';

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
  const res = await fetch(`${API_BASE}/reviews/ranking`);

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

export const createReviews = async ({ comment, type, theaterId }: CreateReviewParams) => {
  const res = await fetch('http://localhost:8000/reviews/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ comment, type, theater_id: theaterId }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.error || '리뷰 저장에 실패했습니다.');
  }

  return data as CreatedReview;
};
