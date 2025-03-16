import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get('userId'); // userId를 가져옵니다.
  const theaterId = searchParams.get('theaterId'); // theaterId를 가져옵니다.

  // userId가 없으면 에러 처리
  if (!userId) {
    return NextResponse.json({ error: 'userId가 필요합니다.' }, { status: 400 });
  }

  // 리뷰 데이터 가져오기
  let reviewQuery = supabase.from('reviews').select('*'); // 모든 데이터를 가져옵니다.

  // userId로 필터링 (userId가 전달되었을 때만)
  reviewQuery = reviewQuery.eq('user_id', userId);

  // theaterId가 있을 경우에만 필터링 추가
  if (theaterId) {
    reviewQuery = reviewQuery.eq('theater_id', theaterId);
  }

  const { data: reviews, error } = await reviewQuery;

  if (error) {
    console.error('❌ 리뷰 조회 실패:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 각 리뷰에 대해 user_id의 리뷰 수를 계산하여 추가
  const reviewsWithCount = await Promise.all(
    reviews.map(async (review) => {
      // user_id로 해당 유저의 리뷰 수를 계산
      const { count: userReviewCount } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', review.user_id); // 해당 user_id의 리뷰 수를 가져옵니다

      return { ...review, userReviewCount }; // 리뷰와 리뷰 수를 함께 반환
    }),
  );

  // 필터링된 리뷰의 개수를 반환
  const reviewCount = reviewsWithCount?.length ?? 0;

  return NextResponse.json({ reviewCount, reviews: reviewsWithCount });
}
