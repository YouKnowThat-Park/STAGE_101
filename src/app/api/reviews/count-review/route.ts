import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);

  try {
    // ✅ 1. 모든 리뷰 가져오기 (유저 정보 포함)
    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select(
        `
        id, 
        theater_id, 
        user_id, 
        users(nickname, profile_img)
      `,
      )
      .order('created_at', { ascending: false });

    if (reviewError) {
      console.error('❌ 리뷰 조회 실패:', reviewError);
      return NextResponse.json({ error: reviewError.message }, { status: 500 });
    }

    console.log('✅ [DEBUG] 가져온 리뷰 데이터:', reviews);

    // ✅ 2. theater_id별 리뷰 개수 계산 및 유저 정보 추가
    const theaterCounts: Record<
      string,
      { count: number; nickname: string; profile_img: string | null }
    > = {};

    reviews.forEach((review) => {
      const theaterId = review.theater_id;
      const user = review.users ?? {}; // ✅ 유저 정보가 없을 경우 기본값 설정

      if (!theaterCounts[theaterId]) {
        theaterCounts[theaterId] = {
          count: 0,
          nickname: user.nickname ?? '익명', // ✅ `nickname` 추가
          profile_img: user.profile_img ?? '/default-profile.png', // ✅ `profile_img` 추가
        };
      }
      theaterCounts[theaterId].count++;
    });

    // ✅ 3. 개수 기준 정렬 후 상위 5개 선택
    const ranking = Object.entries(theaterCounts)
      .map(([theater_id, data]) => ({ theater_id, ...data }))
      .sort((a, b) => b.count - a.count) // 내림차순 정렬
      .slice(0, 5); // 상위 5개만 가져오기

    return NextResponse.json({
      ranking, // ✅ 유저 정보 포함된 `ranking`
      reviews, // ✅ 원본 리뷰 데이터도 그대로 반환
    });
  } catch (err) {
    console.error('🚨 서버 오류 발생:', err);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
