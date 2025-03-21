import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('📌 [DEBUG] API 라우트 실행됨!'); // ✅ 실행 로그 확인

  try {
    const supabase = await serverSupabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      console.log('❌ [ERROR] userId 없음'); // ✅ userId 없으면 로그 출력
      return NextResponse.json({ error: '유저 ID가 필요합니다.' }, { status: 400 });
    }

    console.log('📌 [DEBUG] 요청된 userId:', userId);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISO = today.toISOString().split('T')[0];

    console.log('📌 [DEBUG] 오늘 날짜 (UTC):', todayISO);

    const { data, error } = await supabase
      .from('reservations')
      .select(`id, user_id, theater_id, viewed_at, theaters(id, name)`)
      .eq('user_id', userId)
      .not('viewed_at', 'is', null)
      .lte('viewed_at', todayISO)
      .order('viewed_at', { ascending: false });

    console.log('📌 [DEBUG] 조회된 데이터:', JSON.stringify(data, null, 2));

    return NextResponse.json({ theaters: data });
  } catch (error) {
    console.error('❌ [ERROR] 서버 내부 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}
