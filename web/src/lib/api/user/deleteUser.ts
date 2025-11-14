export const deleteUser = async (password: string) => {
  const res = await fetch('http://localhost:8000/users/delete', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '회원 탈퇴 실패');
  }

  return true;
};
