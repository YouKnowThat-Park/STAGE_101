import { NextRequest, NextResponse } from 'next/server';
import { serverSupabase } from '../../../../supabase/supabase-server';

export async function PATCH(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const supabase = await serverSupabase();

  const { data, error } = await supabase
    .from('cart_history')
    .select('id, status')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  // 이미 수령 완료(completed) 상태라면 변경 불가
  if (data.status === 'completed') {
    return NextResponse.json({ error: 'Cannot cancel a completed transaction' }, { status: 400 });
  }

  // 상태를 canceled로 변경
  const { error: updateError } = await supabase
    .from('cart_history')
    .update({ status: 'canceled' })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to cancel the transaction' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
