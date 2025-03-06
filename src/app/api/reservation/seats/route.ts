import { serverSupabase } from '@/supabase/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supanase = serverSupabase();

  try {
    const { data, error } = await supanase.from('reservations').select('seat_number, status');
    if (error) throw new Error(error.message);
    return NextResponse.json({ seats: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
