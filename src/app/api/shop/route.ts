import { serverSupabase } from '@/supabase/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await serverSupabase();
  const { data, error } = await supabase.from('shop').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
