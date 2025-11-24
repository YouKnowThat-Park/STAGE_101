'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Stage101Logo from 'src/ui/logo/Stage101Logo';
import { LogoutProps } from 'src/types/auth/auth-type';

const Logout = ({ user }: LogoutProps) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const handleLogout = async () => {
    const res = await fetch('/api/logout', { method: 'GET' });
    localStorage.clear();

    if (res.ok) {
      alert('로그아웃 성공!');
      router.push('/');
      router.refresh();
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

  // 처음에 진짜로 가로 스크롤 필요할 때만 화살표 표시
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollWidth <= el.clientWidth) return; // 오버플로우 없으면 힌트 X

    if (window.innerWidth <= 500) {
      setShowScrollHint(true);
    }
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
  };

  return (
    <div className="relative">
      {/* 스크롤 가능한 네비 영역 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          flex items-center h-16 px-8 bg-black text-white justify-between
          max-[500px]:justify-start max-[500px]:gap-6 
          max-[550px]:overflow-x-auto max-[500px]:whitespace-nowrap 
          max-[550px]:scroll-smooth max-[500px]:[&::-webkit-scrollbar]:hidden
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

      {/* 작은 화면 + 오버플로우 있을 때만 오른쪽에 화살표 힌트 */}
      {showScrollHint && (
        <div
          className="
            pointer-events-none
            absolute inset-y-0 right-0 top-12
            hidden max-[500px]:flex
            items-center pr-2
            bg-gradient-to-l from-black/80 to-transparent
          "
        >
          {/* 왼쪽으로 스크롤하라는 느낌의 화살표 */}
          <span className="text-[#C9A66B] text-sm animate-pulse">ㅡ→</span>
        </div>
      )}
    </div>
  );
};

export default Logout;
