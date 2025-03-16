import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get('userId'); // userId를 가져옵니다.
  const theaterId = searchParams.get('theaterId'); // theaterId를 가져옵니다.

  // 리뷰 데이터 가져오기
  let reviewQuery = supabase.from('reviews').select('*');

  // theaterId 필터링
  if (theaterId) {
    reviewQuery = reviewQuery.eq('theater_id', theaterId);
  }

  const { data: reviews, error: reviewError } = await reviewQuery;

  if (reviewError) {
    console.error('❌ 리뷰 조회 실패:', reviewError);
    return NextResponse.json({ error: reviewError.message }, { status: 500 });
  }

  // JavaScript에서 `user_id`별 리뷰 수 계산하기
  const userReviewCountMap = new Map();

  // 모든 리뷰에서 user_id별로 카운트
  reviews.forEach((review) => {
    const currentCount = userReviewCountMap.get(review.user_id) ?? 0;
    userReviewCountMap.set(review.user_id, currentCount + 1);
  });

  // 각 리뷰에 `userReviewCount` 추가하기
  const reviewsWithCount = reviews.map((review) => {
    const userReviewCount = userReviewCountMap.get(review.user_id) ?? 0; // 없으면 0으로 처리
    return { ...review, userReviewCount };
  });

  const reviewCount = reviewsWithCount.length;

  // 확인용 로그 (추가된 값)
  console.log('reviewsWithCount:', reviewsWithCount);

  return NextResponse.json({ reviewCount, reviews: reviewsWithCount });
}
