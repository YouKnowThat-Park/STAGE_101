'use client';

import React, { useEffect, useState } from 'react';
import MypageHistory from './_components/MypageHistory';
import MypageTicket from './_components/MypageTicket';
import MypageProfile from './_components/MypageProfile';
import MypageReview from './_components/MypageReview';
import MypageFooter from './_components/MypageFooter';

import { useRouter } from 'next/navigation';
import { Noto_Serif_KR } from 'next/font/google';

import { useUserHook } from '../../hooks/user/useUserHook';
import { useUserStore } from '../../store/userStore';

const notoSerif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-noto-serif',
});

const buttonTabs = [
  {
    key: 'ticket',
    label: (
      <div className="flex flex-col items-center">
        <span>TICKET</span>
      </div>
    ),
  },
  {
    key: 'review',
    label: (
      <div className="flex flex-col items-center">
        <span>REVIEW</span>
      </div>
    ),
  },
  {
    key: 'history',
    label: (
      <div className="flex flex-col items-center">
        <span>HISTORY</span>
      </div>
    ),
  },
];
const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState('ticket');
  const router = useRouter();

  const { data } = useUserHook();

  useEffect(() => {
    if (!data) return;

    useUserStore.setState((prev) => ({
      ...prev,
      profile_img: data.profile_img ?? prev.profile_img,
      nickname: data.nickname ?? prev.nickname,
      name: data.name ?? prev.name,
      point: data.point ?? prev.point,
    }));
  }, [data]);

  return (
    <div
      className={`${(notoSerif.className, INNER)} flex flex-col lg:flex-row min-[850px]:gap-40 px-4 py-10 lg:px-20 relative`}
    >
      {/* 📱 상단 로고 (모바일 전용) */}
      <div
        onClick={() => router.push('/')}
        className="lg:hidden text-white text-center text-2xl font-bold mb-4"
      >
        STAGE_101
      </div>

      {/* ⬅️ 왼쪽 푸터 (데스크탑만 표시) */}
      <div className="hidden lg:block">
        <MypageFooter />
      </div>

      <div className="flex flex-col items-center lg:items-start gap-5 mt-10 lg:mt-20 px-4 w-full">
        <div className="w-full max-w-full lg:max-w-[600px] bg-[#151515] flex flex-col rounded-md shadow-lg">
          {/* 🔥 프로필은 zustand에서 바로 읽음 */}
          <MypageProfile />

          {/* 탭 네비게이션 */}
          <nav className="bg-[#151515] flex justify-around lg:justify-center items-center gap-4 lg:gap-20 border-b border-gray-300 px-2">
            {buttonTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-3 text-sm font-semibold border-b-2 ${
                  selectedTab === tab.key
                    ? 'border-black text-white'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* 탭 콘텐츠 */}
          <div className="bg-[#151515] w-full p-4 max-[431px]:p-0 overflow-x-hidden">
            {selectedTab === 'ticket' && <MypageTicket />}
            {selectedTab === 'review' && <MypageReview />}
            {selectedTab === 'history' && <MypageHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
