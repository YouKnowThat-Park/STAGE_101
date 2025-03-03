// hooks/useUserHook.ts
import fetchUserData from '@/utils/api/fetchUserData';
import { useQuery } from '@tanstack/react-query';

export const useUserHook = (id: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userData', id],
    queryFn: () => (id ? fetchUserData(id) : Promise.reject('No ID provided')),
    enabled: !!id, // id가 있어야 실행됨
    staleTime: 1000 * 60 * 5, // 5분간 캐싱 유지
  });

  return {
    id: data?.id || '',
    name: data?.name || '이름 없음',
    phone: data?.phone || '없음',
    point: data?.point ?? 0,
    isLoading,
    error,
  };
};
