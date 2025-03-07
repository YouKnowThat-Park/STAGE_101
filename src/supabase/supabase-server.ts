import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function serverSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value ?? null, // ✅ 쿠키 읽기
        set: async (name, value, options) => {
          'use server';
          cookieStore.set(name, value, { path: '/', ...options }); // ✅ 쿠키 저장
        },
        remove: async (name: string) => {
          'use server';
          cookieStore.set(name, '', { path: '/', maxAge: -1 }); // ✅ 쿠키 삭제
        },
      },
    },
  );
}
