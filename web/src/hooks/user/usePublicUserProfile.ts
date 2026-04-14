import { useQuery } from '@tanstack/react-query';
import { fetchPublicUserProfile } from 'src/lib/api/user/fetchPublicUserProfile';

export const usePublicUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['public-user-profile', userId],
    queryFn: () => fetchPublicUserProfile(userId),
    enabled: Boolean(userId),
  });
};
