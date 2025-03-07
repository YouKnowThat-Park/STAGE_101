'use client';

import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import React from 'react';

const Logout = () => {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const testHandleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'GET' });

    if (res.ok) {
      clearUser();

      alert('로그아웃 성공!');
      router.push('/');
    } else {
      alert('로그아웃 실패');
    }
  };

  const testHandleLogin = () => {
    router.push('/sign-in');
  };

  const testHandleShop = () => {
    router.push('/shop');
  };

  const testHandleCart = () => {
    router.push('/cart');
  };

  const testHandleMypage = () => {
    router.push('/mypage');
  };

  const testHandleMovie = () => {
    router.push('theater');
  };

  return (
    <div className="flex justify-between">
      <button onClick={testHandleLogout}>로그아웃</button>
      <button onClick={testHandleLogin}>로그인</button>
      <button onClick={testHandleShop}>상점</button>
      <button onClick={testHandleCart}>장바구니</button>
      <button onClick={testHandleMypage}>마이페이지</button>
      <button onClick={testHandleMovie}>영화관</button>
    </div>
  );
};

export default Logout;
