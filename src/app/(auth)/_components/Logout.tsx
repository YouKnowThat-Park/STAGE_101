'use client';

import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect } from 'react';

const Logout = () => {
  const router = useRouter();
  const { id, setUser, clearUser } = useUserStore(); // ✅ 유저 상태 가져오기

  // ✅ 로그인 상태 확인 (예: 로컬스토리지에서 가져오기)
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // 예제: 로컬스토리지 활용
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ 유저 상태 업데이트
    }
  }, [setUser]);

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'GET' });

    if (res.ok) {
      clearUser();
      localStorage.removeItem('user'); // ✅ 로그아웃 시 유저 정보 제거
      alert('로그아웃 성공!');
      router.push('/');
    } else {
      alert('로그아웃 실패');
    }
  };

  return (
    <div className="flex justify-between items-center h-16 px-8 bg-black text-white">
      {/* ✅ 헤더 전체 높이 설정 (h-16) + 가운데 정렬 (items-center) */}
      <Link href="/" className="text-xl font-bold text-[#C9A66B]">
        STAGE_101
      </Link>

      {/* ✅ 로그인 상태에 따라 버튼 표시 */}
      {id ? (
        <button onClick={handleLogout} className="text-red-500">
          LOGOUT
        </button>
      ) : (
        <Link href="/sign-in" className="hover:underline">
          LOGIN
        </Link>
      )}

      <Link href="/theater" className="hover:underline">
        THEATER
      </Link>
      <Link href="/shop" className="hover:underline">
        SHOP
      </Link>
      <Link href="/cart" className="hover:underline">
        CART
      </Link>
      <Link href="/mypage" className="hover:underline">
        MYPAGE
      </Link>
    </div>
  );
};

export default Logout;
