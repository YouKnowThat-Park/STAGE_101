import BlogIcon from '@/ui/icon/BlogIcon';
import CvIcon from '@/ui/icon/CvIcon';
import GitHubIcon from '@/ui/icon/GitHubIcon';
import Link from 'next/link';
import React, { useState } from 'react';
import SettingModal from './SettingModal';
import { useUserStore } from '@/store/userStore';

const MypageFooter = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { id } = useUserStore();

  return (
    <div className="text-gray-500 flex flex-col items-center">
      <div className="border-t-2 border-t-black w-full">
        <div className="max-w-screen-md mx-auto flex flex-col items-center text-center ">
          {/* 회사 정보 */}
          <div className="flex flex-col">
            <Link href="/">
              <h2 className="text-4xl mt-[50px] font-semibold transition-transform duration-300 hover:scale-105">
                STAGE_101
              </h2>
            </Link>
          </div>

          <div className="flex flex-col mt-10 gap-5">
            <p className="text-sm text-gray-400 transition-transform duration-300 hover:scale-105">
              하나의 공간에서
            </p>
            <p className="text-sm text-gray-400 transition-transform duration-300 hover:scale-105">
              무한한 가능성을
            </p>
            <p className="text-sm text-gray-400 transition-transform duration-300 hover:scale-105">
              한 번의 경험으로
            </p>
            <p className="text-sm text-gray-400 transition-transform duration-300 hover:scale-105">
              STAGE_101
            </p>
          </div>

          {/*운영 정보*/}
          <div className="flex flex-col gap-2 mt-[90px]">
            <p>운영시간 13:00 ~ 03:00</p>
            <p>고객센터 12:00 ~ 19:00</p>
            <p className="text-sm ">📩 : youkn0wthat@naver.com</p>
          </div>

          {/* 네비게이션 링크 */}
          <nav className="mt-[90px] flex flex-col gap-[15px]">
            <Link href="/ui/notice" className="text-gray-400 hover:text-white text-sm">
              이용약관
            </Link>
            <Link href="/ui/notice" className="text-gray-400 hover:text-white text-sm">
              개인정보 처리방침
            </Link>
            <Link href="/ui/notice" className="text-gray-400 hover:text-white text-sm">
              고객센터
            </Link>
            {id && (
              <button className=" text-red-500" onClick={() => setIsOpenModal(true)}>
                화원 탈퇴
              </button>
            )}
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
      {isOpenModal && <SettingModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />}
    </div>
  );
};

export default MypageFooter;
