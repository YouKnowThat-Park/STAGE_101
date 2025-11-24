import { DeleteUserPayload } from 'src/types/user/user-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const deleteUser = async (body: DeleteUserPayload) => {
  const res = await fetch(`${API_BASE}/users/delete`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '회원 탈퇴 실패');
  }

  return true;
};
