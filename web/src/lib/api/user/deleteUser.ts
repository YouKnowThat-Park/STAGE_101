import { DeleteUserPayload } from 'src/types/user/user-type';

export const deleteUser = async (body: DeleteUserPayload) => {
  const res = await fetch('/api/users/profile', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '회원 탈퇴 실패');
  }

  return true;
};
