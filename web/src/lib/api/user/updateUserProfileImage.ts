export const updateUserProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('http://localhost:8000/users/me/profile-image', {
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
