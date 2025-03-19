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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('📥 PATCH 요청 데이터:', body); // 🚨 디버깅 로그 추가

    const { id, nickname, profile_img } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    const supabase = await serverSupabase();
    const { error } = await supabase
      .from('users')
      .update({
        nickname,
        profile_img,
      })
      .eq('id', id);

    if (error) {
      console.error('❌ users 테이블 업데이트 오류:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log('✅ users 테이블 업데이트 성공!'); // 🚨 업데이트 성공 확인

    return new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });
  } catch (err) {
    console.error('❌ PATCH 요청 처리 중 오류:', err);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }
}
