import { CreatedReview, CreateReviewParams } from 'src/types/review/review-type';

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
