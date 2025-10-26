'use client';
import BlogIcon from '../ui/icon/BlogIcon';
import CvIcon from '../ui/icon/CvIcon';
import GitHubIcon from '../ui/icon/GitHubIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Footer = () => {
  const pathname = usePathname();
  const isMypage = pathname?.startsWith('/mypage'); // ✅ `/theater` 여부 체크
  if (isMypage) return null; // ✅ `/theater`에서는 헤더 숨김

  return (
    <div className=" hidden min-[481px]:block border-t-2 border-t-black py-16 mt-48 ">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* 회사 정보 */}
        <div className="text-center md:text-left">
          <h2 className="text-lg text-gray-400 font-semibold">STAGE_101</h2>
          <p className="text-sm text-gray-400">아오특별시 아오구 아오로 123</p>
          <p className="text-sm text-gray-400">📩 문의 : youkn0wthat@naver.com</p>
        </div>

        {/* 네비게이션 링크 */}
        <nav className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-6">
          <Link href="/ui/notice" className="text-gray-400 hover:text-white text-sm">
            이용약관
          </Link>
          <Link href="/ui/notice" className="text-gray-400 hover:text-white text-sm">
            개인정보 처리방침
          </Link>
          <Link href="/ui/notice" className="text-gray-400 hover:text-white text-sm">
            고객센터
          </Link>
        </nav>

        {/* 소셜 미디어 */}
        <div className="mt-4 md:mt-0 flex gap-4">
          <Link
            href="https://github.com/YouKnowThat-Park"
            className="text-gray-400 hover:text-white text-xl"
          >
            <GitHubIcon />
          </Link>
          <Link
            href="https://youkn0wthat.tistory.com/"
            className="text-gray-400 hover:text-white text-xl"
          >
            <BlogIcon />
          </Link>
          <Link href="https://instagram.com" className="text-gray-400 hover:text-white text-xl">
            <CvIcon />
          </Link>
        </div>
      </div>

      {/* 저작권 안내 */}
      <div className="text-center text-gray-500 text-sm mt-6">
        © 2024 STAGE_101. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
