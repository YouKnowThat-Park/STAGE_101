import { useQuery } from '@tanstack/react-query';

export const useUserHook = (id: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userData', id],
    queryFn: async () => {
      if (!id) throw new Error('No user ID provided');
      const res = await fetch(`http://localhost:8000/users/me`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch user data');
      return res.json();
    },
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
