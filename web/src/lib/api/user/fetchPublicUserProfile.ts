import { PublicUserProfile } from 'src/types/user/user-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchPublicUserProfile = async (userId: string): Promise<PublicUserProfile> => {
  const res = await fetch(`${API_BASE}/users/${userId}/profile`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('공개 사용자 정보를 불러오지 못했습니다.');
  }

  return res.json();
};
