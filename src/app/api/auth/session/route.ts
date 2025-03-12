import { NextResponse } from 'next/server';
import { serverSupabase } from '@/supabase/supabase-server';

export async function GET() {
  const supabase = await serverSupabase();

  // ✅ Supabase의 세션을 가져와서 검증
  const { data: session } = await supabase.auth.getSession();
  if (!session || !session.session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  return NextResponse.json({ user: session.session.user }, { status: 200 });
}
