'use client';
import React from 'react';
import Logout from './(auth)/_components/Logout';
import { usePathname } from 'next/navigation';
import { HeaderProps } from 'src/types/common/common-type';
const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  const isTheaterPage = pathname?.startsWith('/theater');
  const isMypage = pathname?.startsWith('/mypage');
  if (isTheaterPage || isMypage) return null;

  return (
    <header>
      <div className={`${INNER}w-full h-16 mb-[20px] mt-10 `}>
        <Logout user={user} />
      </div>
    </header>
  );
};

export default Header;
