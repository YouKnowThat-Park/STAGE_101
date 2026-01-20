import { headers } from 'next/headers';
import { SafeUserType } from 'src/types/user/user-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getCurrentUser(): Promise<SafeUserType | null> {
  const cookieHeader = headers().get('cookie') ?? '';

  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'GET',
      headers: {
        cookie: cookieHeader, // ✅ 브라우저 쿠키를 그대로 백엔드로 전달
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    const user: SafeUserType = {
      id: data.id,
      nickname: data.name ?? '',
      profile_img: data.profile_img ?? '',
      point: data.point ?? null,
      name: data.name ?? '',
      phone: data.phone ?? '',
    };

    return user;
  } catch {
    return null;
  }
}
