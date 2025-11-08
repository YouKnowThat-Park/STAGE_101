import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // ✅ 현재 로그인된 사용자 정보 가져오기
  const token = req.cookies.get('__stage__')?.value;

  const pathname = req.nextUrl.pathname;

  // ✅ 유저가 로그인된 상태라면 `/sign-in`, `/sign-up` 접근 차단 후 `/`로 리다이렉트
  if (token && (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', req.url)); // ✅ `/`로 강제 이동
  }

  if (!token && pathname.startsWith('/payments')) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (!token && pathname.startsWith('/mypage')) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next(); // ✅ 요청을 계속 진행
}

// ✅ 미들웨어 적용할 경로 (로그인 & 회원가입 페이지에서만 실행)
export const config = {
  matcher: ['/sign-in', '/sign-up', '/payments/:path*', '/mypage'],
};
