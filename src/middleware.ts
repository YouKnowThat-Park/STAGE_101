import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // ✅ 환경 변수 체크 (올바르게 설정되지 않으면 오류 방지)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 Supabase 환경 변수가 설정되지 않았습니다.');
    return NextResponse.next();
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { get: (name) => req.cookies.get(name)?.value || '' },
  });

  // ✅ 현재 로그인된 사용자 정보 가져오기
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // ✅ 로그 확인
  console.log('🔍 미들웨어 실행: ', req.nextUrl.pathname, ' | 로그인 상태:', !!user);

  // ✅ 유저가 로그인된 상태라면 `/sign-in`, `/sign-up` 접근 차단 후 `/`로 리다이렉트
  if (user && (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up')) {
    console.log('🚀 로그인된 유저가 접근 → 홈으로 강제 이동!');
    return NextResponse.redirect(new URL('/', req.url)); // ✅ `/`로 강제 이동
  }

  return NextResponse.next(); // ✅ 요청을 계속 진행
}

// ✅ 미들웨어 적용할 경로 (로그인 & 회원가입 페이지에서만 실행)
export const config = {
  matcher: ['/sign-in', '/sign-up'],
};
