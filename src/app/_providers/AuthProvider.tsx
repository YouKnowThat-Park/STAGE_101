'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserSession } from '../api/auth/actions';
import { useUserStore } from '@/store/userStore';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const { setUser, clearUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserSession();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user)); // ✅ 유저 정보 저장
        setUser(user); // ✅ Zustand 상태 업데이트
      } else {
        localStorage.removeItem('user');
        clearUser(); // ✅ Zustand 초기화
      }
      setLoading(false);
    };

    fetchUser();
  }, [setUser, clearUser]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
};

export default AuthProvider;
