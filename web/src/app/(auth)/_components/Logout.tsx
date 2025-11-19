'use client';

import { SafeUserType, useUserStore } from '../../../store/userStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Stage101Logo from 'src/ui/logo/Stage101Logo';

export interface LogoutProps {
  user: SafeUserType | null;
}

const Logout = ({ user }: LogoutProps) => {
  const router = useRouter();
  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'GET' });

    if (res.ok) {
      alert('로그아웃 성공!');
      router.push('/');
    } else {
      alert('로그아웃 실패');
    }
  };

  const handleMyPageClick = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    router.push('/mypage');
  };

  const isLoggedIn = !!user;

  return (
    <div
      className="
        flex items-center h-16 px-8 bg-black text-white justify-between
        max-[500px]:justify-start max-[500px]:gap-6 
        max-[500px]:overflow-x-auto max-[500px]:whitespace-nowrap 
        max-[500px]:scroll-smooth max-[500px]:[&::-webkit-scrollbar]:hidden
      "
    >
      <Stage101Logo />

      {isLoggedIn ? (
        <button onClick={handleLogout} className="text-red-500 flex-shrink-0">
          LOGOUT
        </button>
      ) : (
        <Link href="/sign-in" className="hover:underline flex-shrink-0">
          LOGIN
        </Link>
      )}

      <Link href="/theater" className="hover:underline flex-shrink-0">
        THEATER
      </Link>
      <Link href="/shop" className="hover:underline flex-shrink-0">
        SHOP
      </Link>
      <Link href="/cart" className="hover:underline flex-shrink-0">
        CART
      </Link>
      <button onClick={handleMyPageClick} className="hover:underline flex-shrink-0">
        MYPAGE
      </button>
    </div>
  );
};

export default Logout;
