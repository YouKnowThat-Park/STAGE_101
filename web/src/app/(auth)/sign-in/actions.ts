'use server';

import { serverSupabase } from '../../../supabase/supabase-server';
import { cookies } from 'next/headers';

export default async function signIn(email: string, password: string) {
  const supabase = await serverSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error('유효하지 않은 Email 또는 password 입니다.');
  }

  const user = data.user;
  if (!user) throw new Error('로그인 실패');

  // ✅ Supabase에서 유저 데이터 가져오기
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, nickname, profile_img, created_at, name, phone, point') // 🔥 추가 필드 포함!
    .eq('id', user.id)
    .single();

  if (userError) {
    throw new Error('유저 정보를 찾을 수 없습니다.');
  }

  // ✅ profile_img 값 정리 (불필요한 따옴표 제거)
  let cleanProfileImg = userData.profile_img;
  if (typeof cleanProfileImg === 'string') {
    cleanProfileImg = cleanProfileImg.replace(/^"|"$/g, '').trim(); // 앞뒤 큰따옴표 및 공백 제거
  } else {
    cleanProfileImg = null;
  }

  const cleanedUserData = { ...userData, profile_img: cleanProfileImg };

  // ✅ 로그인한 유저 ID를 쿠키에 저장
  const cookieOptions = {
    httpOnly: true, // JavaScript에서 접근 불가 (XSS 방지)
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 동작 (배포 환경)
    sameSite: 'strict' as const, // CSRF 방지
    path: '/',
  };
  cookies().set('user_id', userData.id || '', cookieOptions);

  return cleanedUserData;
}
