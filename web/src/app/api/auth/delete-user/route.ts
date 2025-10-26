import { serverSupabase } from '../../../../supabase/supabase-server';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function DELETE() {
  const supabase = await serverSupabase(); // ✅ 기존 Supabase 클라이언트 유지

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  // ✅ 서비스 역할 키를 사용한 admin 클라이언트 따로 생성
  const adminSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ 여기서만 서비스 키 사용
    { cookies: cookies() },
  );

  // ✅ 관리자 권한으로 회원 삭제
  const { error: deleteUserError } = await adminSupabase.auth.admin.deleteUser(user.id);

  if (deleteUserError) {
    return NextResponse.json(
      { error: '회원 탈퇴 실패', details: deleteUserError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: '회원 탈퇴 완료' }, { status: 200 });
}
