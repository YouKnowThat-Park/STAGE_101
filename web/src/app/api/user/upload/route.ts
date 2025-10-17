import { serverSupabase } from '../../../../supabase/supabase-server';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    let filePath = formData.get('filePath') as string;

    if (!file || !filePath) {
      console.error('❌ 파일 또는 경로 없음');
      return new Response(JSON.stringify({ error: '파일과 경로가 필요합니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ `filePath`에서 `profiles/`가 중복되지 않도록 수정
    if (filePath.startsWith('profiles/')) {
      filePath = filePath.replace(/^profiles\//, ''); // 맨 앞의 'profiles/' 제거
    }

    const supabase = await serverSupabase();
    const { data, error } = await supabase.storage.from('profiles').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error || !data) {
      console.error('❌ Supabase 업로드 오류:', error);
      return new Response(JSON.stringify({ error: error?.message || '업로드 실패' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ `getPublicUrl()`을 사용할 때 `filePath`에 버킷명을 포함하지 않도록 수정
    const { data: publicUrlData } = supabase.storage.from('profiles').getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error('❌ publicUrl 생성 실패:', publicUrlData);
      return new Response(JSON.stringify({ error: '공개 URL 생성 실패' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: publicUrlData.publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('❌ 업로드 실패:', err);
    return new Response(JSON.stringify({ error: '업로드 실패', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
