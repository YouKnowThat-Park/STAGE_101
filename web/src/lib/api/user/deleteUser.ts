import { DeleteUserPayload } from 'src/types/user/user-type';
import { fetchWithRefresh } from '../_utils/fetchWithRefresh';

export const deleteUser = async (body: DeleteUserPayload) => {
  const res = await fetchWithRefresh('/bff/users/profile', {
    method: 'DELETE',
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
