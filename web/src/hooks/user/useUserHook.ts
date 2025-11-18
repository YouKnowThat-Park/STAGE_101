import { useQuery } from '@tanstack/react-query';

export interface UserResponse {
  id: string;
  name: string | null;
  phone: string | null;
  point: number;
  email?: string;
}

export const useUserHook = () => {
  return useQuery<UserResponse, Error>({
    queryKey: ['userData', 'me'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/users/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('유저 정보를 불러올 수 없습니다.');
      }
      const data = (await res.json()) as UserResponse;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
