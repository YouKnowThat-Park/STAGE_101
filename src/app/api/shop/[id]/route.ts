import { serverSupabase } from '@/supabase/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = await serverSupabase();
  const { id } = params;

  const { data, error } = await supabase.from('shop').select('*').eq('id', id).single();

  if (error || !data) {
    return NextResponse.json({ error: '상품을 찾을 수 없습니다.' }, { status: 404 }); // ✅ 올바른 형식
  }

  return NextResponse.json(data, { status: 200 }); // ✅ 명확하게 상태 코드 추가
}
