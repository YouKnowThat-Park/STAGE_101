import { MypageUserResponse } from 'src/types/user/user-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchMyUser = async (): Promise<MypageUserResponse> => {
  const res = await fetch(`${API_BASE}/users/me`, {
    credentials: 'include',
  });

  if (!res.ok) {
    let serverMessage = '';
    try {
      const errJson = await res.json();
      serverMessage = errJson?.detail || '';
    } catch {}
    throw new Error(serverMessage || '유저 정보를 불러올 수 없습니다.');
  }

  const data = (await res.json()) as MypageUserResponse;
  return data;
};
