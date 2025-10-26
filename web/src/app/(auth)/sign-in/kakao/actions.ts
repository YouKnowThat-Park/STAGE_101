'use server';

import { serverSupabase } from '../../../../supabase/supabase-server';
import { redirect } from 'next/navigation';

export const socialLogin = async (provider: 'kakao' | 'google') => {
  const supabase = await serverSupabase();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUrl = `${baseUrl}/api/auth/callback`;

  // ✅ 디버깅 로그
  console.log('🔁 redirectTo (보내는 값):', redirectUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUrl },
  });

  if (error) {
    console.error('❌ 소셜 로그인 실패:', error.message);
    throw new Error(`소셜 로그인 실패: ${error.message}`);
  }

  console.log('🌍 Supabase가 반환한 redirect URL:', data?.url);

  if (data?.url) {
    redirect(data.url);
  }
};
