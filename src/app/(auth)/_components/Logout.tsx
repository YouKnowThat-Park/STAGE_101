'use client';

import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import React from 'react';

const Logout = () => {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const TestHandleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'GET' });

    if (res.ok) {
      clearUser();

      alert('로그아웃 성공!');
      router.push('/');
    } else {
      alert('로그아웃 실패');
    }
  };

  const TestHandleLogin = () => {
    router.push('/sign-in');
  };

  const TestHandleShop = () => {
    router.push('/shop');
  };

  const TestHandleCart = () => {
    router.push('/cart');
  };

  return (
    <div className="flex justify-between">
      <button onClick={TestHandleLogout}>로그아웃</button>
      <button onClick={TestHandleLogin}>로그인</button>
      <button onClick={TestHandleShop}>상점</button>
      <button onClick={TestHandleCart}>장바구니</button>
    </div>
  );
};

export default Logout;
