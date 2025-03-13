import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = await serverSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*, theaters(name)')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
