import { MypageUserResponse, UpdateUserProfilePayload } from 'src/types/user/user-type';

export const updateUserProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/users/profile', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '프로필 이미지 업로드 실패');
  }

  const data = await res.json();
  return data.profile_img as string;
};

export const updateUserProfileData = async (
  payload: UpdateUserProfilePayload,
): Promise<MypageUserResponse> => {
  const res = await fetch('/api/users/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '프로필 업데이트에 실패했습니다.');
  }

  return res.json();
};
