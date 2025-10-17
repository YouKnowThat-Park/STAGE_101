import { serverSupabase } from '../../../../supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await serverSupabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: '유저 ID가 필요합니다.' }, { status: 400 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('reservations')
      .select(`id, user_id, theater_id, viewed_at, theaters(id, name)`)
      .eq('user_id', userId)
      .not('viewed_at', 'is', null)
      .lte('viewed_at', todayISO)
      .order('viewed_at', { ascending: false });

    return NextResponse.json({ theaters: data });
  } catch (error) {
    console.error('❌ [ERROR] 서버 내부 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}
