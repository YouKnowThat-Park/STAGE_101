import { waitForImage } from '@/utils/waitForImage';

export const uploadImageToSupabase = async (file: File, userId: string): Promise<string> => {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!SUPABASE_URL) {
    throw new Error('❌ Supabase URL이 설정되지 않았습니다.');
  }

  const formData = new FormData();
  const filePath = `profiles/${userId}/${Date.now()}-${file.name}`;

  formData.append('file', file);
  formData.append('filePath', filePath);

  console.log('📤 업로드 시작:', file.name, '경로:', filePath, 'userId:', userId);

  const response = await fetch('/api/user/upload', {
    method: 'POST',
    body: formData,
  });

  console.log('📥 서버 응답 상태 코드:', response.status);

  const result = await response.json().catch(() => {
    console.error('❌ JSON 파싱 오류! 서버 응답이 JSON이 아님.');
    return { error: 'Invalid JSON response' };
  });

  console.log('📥 서버 응답 데이터:', result);

  if (!response.ok || !result.url) {
    console.error('❌ 업로드 오류:', result);
    throw new Error(result.error || '이미지 업로드 실패');
  }

  // ✅ Supabase가 이미지 제공 준비 완료될 때까지 기다림
  const finalImageUrl = await waitForImage(`${result.url}?t=${Date.now()}`);

  console.log('✅ 최종 이미지 URL:', finalImageUrl);
  return finalImageUrl;
};
