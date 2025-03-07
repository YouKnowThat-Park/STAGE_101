'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function serverSupabase() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => cookieStore.get(name)?.value ?? null,
        set: async (name, value, options) => {
          cookieStore.set(name, value, { path: '/', ...options });
        },
        remove: async (name: string) => {
          cookieStore.set(name, '', { path: '/', maxAge: -1 });
        },
      },
    },
  );

  return supabase;
}
