'use server';

import { serverSupabase } from '@/supabase/supabase-server';
import { cookies } from 'next/headers';

export default async function signIn(email: string, password: string) {
  const supabase = serverSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error('유효하지 않은 Email 또는 password 입니다.');
  }

  const user = data.user;
  if (!user) throw new Error('로그인 실패');
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError) {
    throw new Error('유저 정보를 찾을 수 없습니다.');
  }

  const cookieOptions = {
    httpOnly: true, // JavaScript에서 접근 불가 (XSS 방지)
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 동작 (배포 환경)
    sameSite: 'strict' as const, // CSRF 방지
    path: '/',
  };
  cookies().set('user_id', userData.id || '', cookieOptions);

  return userData;
}
