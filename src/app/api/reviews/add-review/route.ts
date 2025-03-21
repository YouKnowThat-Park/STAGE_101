import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await serverSupabase();
    const { comment, display_name, type, theater_id, useRealName } = await req.json();

    console.log('✅ 백엔드에서 받은 데이터:', { comment, display_name, useRealName });

    if (!comment) return NextResponse.json({ error: '리뷰 내용을 입력하세요.' }, { status: 400 });
    if (!type || (type !== 'poster' && type !== 'profile')) {
      return NextResponse.json({ error: '올바른 이미지 타입을 선택하세요.' }, { status: 400 });
    }

    // ✅ 현재 로그인한 유저 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('❌ [ERROR] 유저 인증 실패:', userError);
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // ✅ 유저 정보 가져오기
    const { data: userData, error: userError2 } = await supabase
      .from('users')
      .select('name, nickname, profile_img')
      .eq('id', user.id)
      .single();

    if (userError2) {
      console.error('❌ [ERROR] 유저 정보 조회 실패:', userError2);
      return NextResponse.json({ error: '유저 정보를 가져오지 못했습니다.' }, { status: 500 });
    }

    // ✅ theater_id를 기반으로 극장 정보 가져오기 (🔥 추가된 부분)
    const { data: theaterData, error: theaterError } = await supabase
      .from('theaters')
      .select('id, name, main_img')
      .eq('id', theater_id)
      .single();

    if (theaterError) {
      console.error('❌ [ERROR] 극장 정보 조회 실패:', theaterError);
      return NextResponse.json({ error: '극장 정보를 가져오지 못했습니다.' }, { status: 500 });
    }

    // ✅ 닉네임 or 실명 결정
    console.log('🔥 useRealName 값:', useRealName);
    const finalDisplayName = useRealName ? userData.name : userData.nickname;

    console.log('✅ 최종 저장될 display_name:', finalDisplayName);

    // ✅ 리뷰 저장
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          id: crypto.randomUUID(),
          user_id: user.id,
          theater_id: theater_id,
          comment,
          display_name: finalDisplayName, // ✅ 닉네임 or 실명 저장
          created_at: new Date().toISOString(),
          type,
          dislike_count: 0,
          image_url: type === 'poster' ? theaterData.main_img : userData.profile_img, // ✅ 극장 이미지 또는 프로필 이미지 사용
        },
      ])
      .select();

    if (error) {
      console.error('❌ [ERROR] 리뷰 저장 실패:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: '리뷰가 저장되었습니다.', review: data }, { status: 201 });
  } catch (error) {
    console.error('❌ [ERROR] 서버 내부 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류 발생' }, { status: 500 });
  }
}
