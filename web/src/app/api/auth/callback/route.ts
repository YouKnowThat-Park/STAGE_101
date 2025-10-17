import { serverSupabase } from '../../../../supabase/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookieStore = cookies();
  const supabase = await serverSupabase();

  const url = new URL(req.url);
  const baseUrl = url.origin; // ✅ 현재 환경의 origin 자동 감지 (배포 or 로컬)

  // ✅ URL에서 auth 코드 가져오기
  const code = url.searchParams.get('code');

  if (!code) {
    console.error('❌ OAuth 코드 없음!');
    return NextResponse.redirect(new URL('/sign-in?error=OAuth 코드 없음', baseUrl));
  }

  // ✅ Supabase에 코드 전달하여 세션 교환
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error('❌ 세션 교환 실패:', error);
    return NextResponse.redirect(new URL('/sign-in?error=세션 없음', baseUrl));
  }

  const user = data.session.user;

  // ✅ 쿠키 저장
  cookieStore.set('sb-access-token', data.session.access_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  cookieStore.set('sb-refresh-token', data.session.refresh_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  // ✅ `users` 테이블에 사용자 정보 저장 (존재하지 않을 경우)
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!existingUser) {
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user.id,
        email: user.email,
        name:
          user.user_metadata.full_name || user.user_metadata.preferred_username || 'Social Login',
        nickname: user.user_metadata.full_name || user.user_metadata.preferred_username || 'User',
        profile_img: user.user_metadata.avatar_url || null,
        phone: user.phone || 'Social Login',
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('❌ users 테이블 삽입 실패:', insertError);
    }
  }

  // ✅ 로그인 완료 후 홈으로 리디렉션
  return NextResponse.redirect(new URL('/', baseUrl));
}
