'use client';
import React from 'react';
import Logout from './(auth)/_components/Logout';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname(); // ✅ 현재 경로 가져오기
  const isTheaterPage = pathname?.startsWith('/theater'); // ✅ `/theater` 여부 체크
  if (isTheaterPage) return null; // ✅ `/theater`에서는 헤더 숨김

  return (
    <header>
      <div className="w-full h-16 bg-white mb-[50px]">
        <Logout />
      </div>
    </header>
  );
};

export default Header;
