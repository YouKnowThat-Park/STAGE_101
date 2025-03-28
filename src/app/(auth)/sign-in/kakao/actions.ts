'use server';

import { serverSupabase } from '@/supabase/supabase-server';
import { redirect } from 'next/navigation';

export const socialLogin = async (provider: 'kakao' | 'google') => {
  const supabase = await serverSupabase();

  const redirectUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/auth/callback'
      : 'https://stage-101.vercel.app/api/auth/callback';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUrl },
  });

  if (error) {
    throw new Error(`소셜 로그인 실패: ${error.message}`);
  }

  if (data?.url) {
    redirect(data.url); // ✅ OAuth 로그인 페이지로 리디렉트
  }
};
