import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
  }

  const supabase = await serverSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('id, name, phone, point')
    .eq('id', id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
