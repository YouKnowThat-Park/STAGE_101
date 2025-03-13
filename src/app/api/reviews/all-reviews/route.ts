import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);

  // 기본 파라미터 설정
  const sort = searchParams.get('sort') || 'created_at';
  const orderParam = searchParams.get('order') || 'desc';
  const theaterId = searchParams.get('theaterId');
  const pageParam = searchParams.get('page') || '1';

  // page 파라미터 유효성 검사
  const page = parseInt(pageParam, 10);
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
  }

  // 페이지네이션: 한 페이지당 limit 개수와 offset 계산
  const limit = 6;
  const offset = (page - 1) * limit;

  // 기본 쿼리: reviews 테이블 조회, theaters 테이블과의 관계를 통해 name 포함, 정렬 및 범위 적용
  const baseQuery = supabase
    .from('reviews')
    .select('*, theaters(name)')
    .order(sort, { ascending: orderParam === 'asc' })
    .range(offset, offset + limit - 1);

  // theaterId가 있으면 필터링 적용
  const query = theaterId ? baseQuery.eq('theater_id', theaterId) : baseQuery;

  // 쿼리 실행
  const { data, error } = await query;

  if (error) {
    // 콘솔에 에러 로그 출력 (디버깅용)
    console.error('Supabase query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
