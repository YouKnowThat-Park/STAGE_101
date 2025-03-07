import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const theaterId = searchParams.get('theaterId');

  if (!theaterId) {
    return NextResponse.json({ error: 'theaterId가 필요합니다.' }, { status: 400 });
  }

  const supabase = await serverSupabase();

  const { data: theater, error } = await supabase
    .from('theaters')
    .select('*') // ✅ 모든 필드 가져오기 (필요하면 'seats, price' 등으로 변경 가능)
    .eq('type', theaterId) // ✅ `type`으로 검색해야 함!
    .single();

  if (error || !theater) {
    return NextResponse.json(
      { error: `극장 정보를 찾을 수 없습니다: ${theaterId}` },
      { status: 404 },
    );
  }

  return NextResponse.json(theater);
}
