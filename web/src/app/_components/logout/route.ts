import { cookies } from 'next/headers';

export async function GET() {
  try {
    const allCookies = cookies();

    allCookies.getAll().forEach(({ name }) => {
      if (name.startsWith('')) {
        allCookies.delete(name);
      }

      if (name.startsWith('__')) {
        allCookies.delete(name);
      }
    });
    return Response.json({ success: true, message: 'supabase 쿠키 삭제 완료' });
  } catch (error) {
    return Response.json({ success: false, message: '쿠키 삭제 실패' });
  }
}
