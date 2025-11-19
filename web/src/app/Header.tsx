'use client';
import React from 'react';
import Logout from './(auth)/_components/Logout';
import { usePathname } from 'next/navigation';
import { HeaderProps } from 'src/types/common/common-type';

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  const isTheaterPage = pathname?.startsWith('/theater');
  const isMypage = pathname?.startsWith('/mypage');
  if (isTheaterPage || isMypage) return null;

  return (
    <header>
      <div className="w-full h-16 bg-white mb-[50px] mt-10 ">
        <Logout user={user} />
      </div>
    </header>
  );
};

export default Header;
