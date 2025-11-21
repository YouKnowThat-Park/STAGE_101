const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const fetchCart = async (user_id: string) => {
  const res = await fetch(`${API_BASE}/cart/?user_id=${user_id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || '장바구니 조회 실패 했습니다.');
  }
  return res.json();
};
