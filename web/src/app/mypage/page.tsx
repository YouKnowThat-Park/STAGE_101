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
      className={`${notoSerif.className} ${INNER} flex flex-col lg:flex-row min-[850px]:gap-40  px-4 py-10 lg:px-20 relative`}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,166,107,0.18),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* ⬅️ 왼쪽 푸터 (데스크탑만 표시) */}
      <div className="hidden lg:block z-10">
        <MypageFooter />
      </div>

      <div className="flex flex-col items-center lg:items-start gap-5 lg:ml-20 mt-10 lg:mt-20 px-4 w-full z-0">
        <div className="w-full max-w-full lg:max-w-[600px] bg-black flex flex-col rounded-md border border-white/10 shadow-2xl shadow-yellow-500/10">
          {/* 🔥 프로필은 zustand에서 바로 읽음 */}
          <MypageProfile />

          {/* 탭 네비게이션 */}
          <nav className=" flex justify-around lg:justify-center items-center gap-4 lg:gap-20 border-y border-white/10  px-2">
            {buttonTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-3 text-sm font-semibold border-b-2 ${
                  selectedTab === tab.key
                    ? 'border-[#C9A66B] text-[#C9A66B]'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* 탭 콘텐츠 */}
          <div className=" w-full p-4 max-[431px]:p-0 overflow-x-hidden">
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
