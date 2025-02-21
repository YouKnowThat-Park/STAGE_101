import { Database } from '@/types/supabase-type';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type SupabaseCookie = {
  name: string;
  value: string;
  options?: { expires?: number; path?: string };
};

export async function serverSupabase() {
  const cookieStore = await cookies(); // 쿠키 저장소 가져오기

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); // 현재 저장된 모든 쿠키 가져오기
        },
        setAll(cookiesToSet: SupabaseCookie[]) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => cookieStore.set(name, value, options), // 쿠키 설정
            );
          } catch {
            // 서버 컴포넌트에서 `setAll()` 호출 시 오류 발생 무시
          }
        },
      },
    },
  );
}
