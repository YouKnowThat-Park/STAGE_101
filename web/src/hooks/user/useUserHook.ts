import { useQuery } from '@tanstack/react-query';
import { fetchMyUser } from 'src/lib/api/user/fetchUser';
import { MypageUserResponse } from 'src/types/user/user-type';

export const useUserHook = () => {
  return useQuery<MypageUserResponse, Error>({
    queryKey: ['userData', 'me'],
    queryFn: fetchMyUser,
    staleTime: 1000 * 60 * 5,
  });
};
