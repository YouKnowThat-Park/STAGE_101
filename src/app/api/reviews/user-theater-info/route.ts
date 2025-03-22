import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const theaterId = searchParams.get('theaterId');

  if (!userId || !theaterId) {
    return NextResponse.json({ error: '유저 ID와 극장 ID가 필요합니다.' }, { status: 400 });
  }

  // ✅ 유저 정보 조회
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('profile_img, name, nickname')
    .eq('id', userId)
    .single();

  // ✅ 극장 정보 조회
  const { data: theater, error: theaterError } = await supabase
    .from('theaters')
    .select('main_img, name')
    .eq('id', theaterId)
    .single();

  console.log('📌 [DEBUG] API 응답 데이터:', {
    profile_img: user?.profile_img,
    name: user?.name,
    nickname: user?.nickname,
    theater_main_img: theater?.main_img,
    theater_name: theater?.name,
  });

  if (userError || theaterError) {
    return NextResponse.json({ error: '데이터 조회 실패' }, { status: 500 });
  }

  return NextResponse.json({
    profile_img: user.profile_img,
    name: user.name,
    nickname: user.nickname,
    theater_main_img: theater.main_img,
    theater_name: theater.name,
  });
}
