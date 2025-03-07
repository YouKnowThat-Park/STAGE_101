import { serverSupabase } from '@/supabase/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const theaterId = searchParams.get('theaterId');

  if (!theaterId) {
    return NextResponse.json({ error: 'theaterId가 필요합니다.' }, { status: 400 });
  }

  const supabase = serverSupabase();

  const { data: seats, error } = await supabase
    .from('theaters')
    .select('seats')
    .eq('id', theaterId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(seats);
}
