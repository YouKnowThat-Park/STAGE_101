<<<<<<< HEAD
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase-type';

export function serverSupabase() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value ?? null, // ✅ 단일 쿠키 가져오기
        set: (name: string, value: string, options) => {
          cookies().set(name, value, { path: '/', ...options }); // ✅ 쿠키 저장 (옵션 포함)
        },
        remove: (name: string) => {
          cookies().set(name, '', { path: '/', maxAge: -1 }); // ✅ 쿠키 삭제 (만료 설정)
        },
      },
    },
  );
}
=======
import { Database } from '@/types/supabase-type';
import { createBrowserClient } from '@supabase/ssr';

export const browserSupabase = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ARON_KEY!,
  );
};
>>>>>>> main
