import { MypageUserResponse, UpdateUserProfilePayload } from 'src/types/user/user-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const updateUserProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/users/me/profile-image`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error('프로필 업로드 실패:', res.status, errorText);
    throw new Error('프로필 이미지 업로드 실패');
  }

  const data = await res.json();
  return data.profile_img as string;
};

export const updateUserProfileData = async (
  payload: UpdateUserProfilePayload,
): Promise<MypageUserResponse> => {
  const res = await fetch(`${API_BASE}/users/me/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let serverMessage = '';
    try {
      const errJson = await res.json();
      serverMessage = errJson?.detail || '';
    } catch {
      // JSON 아니면 무시
    }

    throw new Error(serverMessage || '프로필 업데이트에 실패했습니다.');
  }

  const data = (await res.json()) as MypageUserResponse;
  return data;
};
