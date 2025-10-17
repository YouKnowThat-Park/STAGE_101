import { serverSupabase } from '../../../../supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

interface Review {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  image_url: string;
  display_name: string; // ✅ 닉네임 또는 실명 저장된 값 사용
  theaters: {
    id: string;
    name: string;
    start_date: string; // ✅ 변경
    end_date: string; // ✅ 추가
  };
  past_views: number; // 관람 횟수 추가
}

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);

  const sort = searchParams.get('sort') || 'created_at'; // 기본값 'created_at'
  const orderParam = searchParams.get('order') || 'desc'; // 기본값 'desc'
  const theaterId = searchParams.get('theaterId');
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
  }

  const limit = 6;
  const offset = (page - 1) * limit;

  // 전체 리뷰 개수 조회
  let countQuery = supabase.from('reviews').select('*', { count: 'exact', head: true });
  if (theaterId) countQuery = countQuery.eq('theater_id', theaterId);
  const { count: totalCount, error: countError } = await countQuery;
  if (countError) {
    console.error('❌ 리뷰 개수 조회 실패:', countError);
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const safeTotalCount = totalCount ?? 0;

  // ✅ 리뷰 데이터 조회 (`screening_date` → `start_date`, `end_date` 변경)
  let baseQuery = supabase
    .from('reviews')
    .select(
      `id, user_id, comment, created_at, image_url, display_name, 
      theaters(id, name, start_date, end_date)`, // ✅ 변경된 필드 반영
    )
    .order(sort, { ascending: orderParam === 'asc' })
    .range(offset, offset + limit - 1);

  if (theaterId) baseQuery = baseQuery.eq('theater_id', theaterId);

  const { data: reviewsData, error: reviewsError } = await baseQuery;
  if (reviewsError) {
    console.error('❌ Supabase query error:', reviewsError);
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }

  if (!Array.isArray(reviewsData)) {
    console.error('❌ Invalid reviewsData format:', reviewsData);
    return NextResponse.json({ error: 'Invalid reviewsData format' }, { status: 500 });
  }

  // `theaters`를 객체로 변환 (배열 제거)
  const safeReviewsData: Review[] = reviewsData.map((review) => ({
    ...review,
    theaters: Array.isArray(review.theaters) ? review.theaters[0] : review.theaters,
    past_views: 0, // 기본값 설정
  }));

  // ✅ 유저별 감상 횟수 조회 (변경 없음)
  const userIds = Array.from(new Set(safeReviewsData.map((r) => r.user_id)));
  const pastViewsCounts: Record<string, number> = {};

  if (userIds.length > 0) {
    // 각 사용자에 대한 극장 방문 횟수 계산
    const { data: reservationsData, error: reservationsError } = await supabase
      .from('reservations')
      .select('user_id, theater_id')
      .in('user_id', userIds);

    if (!reservationsError && reservationsData) {
      const userTheaterMap: Record<string, string[]> = {};

      // 사용자별로 극장 방문 정보 정리
      reservationsData.forEach((reservation) => {
        if (!userTheaterMap[reservation.user_id]) userTheaterMap[reservation.user_id] = [];
        userTheaterMap[reservation.user_id].push(reservation.theater_id);
      });

      // 각 사용자의 과거 감상 횟수 계산
      await Promise.all(
        Object.entries(userTheaterMap).map(async ([userId, theaterIds]) => {
          const { count: pastViews, error: pastViewError } = await supabase
            .from('theaters')
            .select(undefined, { count: 'exact', head: true })
            .lt('start_date', new Date().toISOString().split('T')[0]) // ✅ 변경됨
            .in('id', theaterIds);

          if (!pastViewError) {
            pastViewsCounts[userId] = pastViews ?? 0;
          }
        }),
      );
    }
  }

  // ✅ 리뷰 데이터에 감상 횟수 추가
  const reviewsWithCounts: Review[] = safeReviewsData.map((review) => ({
    ...review,
    past_views: pastViewsCounts[review.user_id] || 0, // 각 사용자의 감상 횟수 추가
  }));

  return NextResponse.json({
    reviews: reviewsWithCounts,
    totalCount: safeTotalCount,
    nextPage: offset + limit < safeTotalCount ? page + 1 : null,
  });
}
