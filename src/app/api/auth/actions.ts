'use server';

import { serverSupabase } from '@/supabase/supabase-server';

export const getUserSession = async () => {
  const supabase = await serverSupabase();

  // ✅ 현재 로그인한 유저 정보 가져오기
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  // ✅ users 테이블에서 추가 정보 가져오기
  let { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single();

  // ✅ users 테이블에 정보가 없으면 자동 삽입
  if (userError || !userData) {
    const newUser = {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name || user.user_metadata.preferred_username || 'Social Login',
      nickname: user.user_metadata.full_name || user.user_metadata.preferred_username || 'User',
      phone: user.phone || 'Social Login', // ✅ "Social Login" 대체 값
      profile_img: user.user_metadata.avatar_url || null,
      created_at: new Date().toISOString(),
      point: 0, // ✅ 기본값 설정
    };

    const { error: insertError } = await supabase.from('users').insert([newUser]);

    if (insertError) {
      console.error('❌ users 테이블 삽입 실패:', insertError);
      return null;
    }

    userData = newUser;
  }

  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    nickname: userData.nickname,
    phone: userData.phone,
    profile_img: userData.profile_img,
    created_at: userData.created_at,
    point: userData.point, // ✅ users 테이블의 모든 필드를 반환
  };
};
