import BlogIcon from '@/ui/icon/BlogIcon';
import CvIcon from '@/ui/icon/CvIcon';
import GitHubIcon from '@/ui/icon/GitHubIcon';
import Link from 'next/link';
import React from 'react';

const MypageFooter = () => {
  return (
    <div className="text-gray-500 flex flex-col items-center">
      <div className="border-t-2 border-t-black py-10 w-full">
        <div className="max-w-screen-md mx-auto flex flex-col items-center text-center ">
          {/* 회사 정보 */}
          <div className="flex flex-col">
            <h2 className="text-4xl mt-[50px] font-semibold">STAGE_101</h2>
          </div>

          <div className="flex flex-col mt-10 gap-5">
            <p className="text-sm text-gray-400">아오특별시 아오구 아오로 123</p>
            <p className="text-sm text-gray-400">📩 문의 : youkn0wthat@naver.com</p>
          </div>

          {/*운영 정보*/}
          <div className="">
            <p>운영시간 13:00 ~ 03:00</p>
            <p>고객센터 12:00 ~ 19:00</p>
          </div>

          {/* 네비게이션 링크 */}
          <nav className="mt-[300px] flex flex-col gap-[15px]">
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
          <div className="flex gap-6 mt-[75px]">
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
    </div>
  );
};

export default MypageFooter;
