import { useQuery } from '@tanstack/react-query';
import { MypageUserResponse } from 'src/types/user/user-type';

export const useUserHook = () => {
  return useQuery<MypageUserResponse, Error>({
    queryKey: ['userData', 'me'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/users/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('유저 정보를 불러올 수 없습니다.');
      }
      const data = (await res.json()) as MypageUserResponse;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
