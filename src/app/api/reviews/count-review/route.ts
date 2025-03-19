import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get('userId'); // userId 가져오기
  const theaterId = searchParams.get('theaterId'); // theaterId 가져오기

  // 리뷰 데이터 가져오기
  let reviewQuery = supabase.from('reviews').select('*');

  // theaterId 필터링 (theaterId가 있을 때만 필터링)
  if (theaterId) {
    reviewQuery = reviewQuery.eq('theater_id', theaterId);
  }

  const { data: reviews, error: reviewError } = await reviewQuery;

  if (reviewError) {
    console.error('❌ 리뷰 조회 실패:', reviewError);
    return NextResponse.json({ error: reviewError.message }, { status: 500 });
  }

  return NextResponse.json({ reviewCount: reviews.length, reviews });
}
