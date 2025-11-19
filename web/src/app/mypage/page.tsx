'use client';
import React, { useState } from 'react';
import MypageHistory from './_components/MypageHistory';
import MypageTicket from './_components/MypageTicket';
import MypageProfile from './_components/MypageProfile';
import { UserResponse, useUserHook } from '../../hooks/user/useUserHook';

import MypageReview from './_components/MypageReview';

import MypageFooter from './_components/MypageFooter';
import { useRouter } from 'next/navigation';
import { Noto_Serif_KR } from 'next/font/google';

export interface MypageUserResponse extends UserResponse {
  nickname: string;
  profile_img: string;
}

const defaultProfileImg = '/default.png'; // ✅ public 폴더 이미지 경로

const notoSerif = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['600', '700'], // 필요에 따라 추가
  variable: '--font-noto-serif',
});

const buttonTabs = [
  {
    key: 'ticket',
    label: (
      <div className="flex flex-col items-center">
        {/* <TicketIcon /> */}
        <span>TICKET</span>
      </div>
    ),
  },
  {
    key: 'review',
    label: (
      <div className="flex flex-col items-center">
        {/* <ReviewIcon /> */}
        <span>REVIEW</span>
      </div>
    ),
  },
  {
    key: 'history',
    label: (
      <div className="flex flex-col items-center">
        {/* <HistoryIcon /> */}
        <span>HISTORY</span>
      </div>
    ),
  },
];

const MyPage = () => {
  const [selectedTab, setSelectedTab] = useState('ticket');
  const { data } = useUserHook();
  const UserDataType = data as MypageUserResponse;

  const router = useRouter();
  return (
    <div
      className={`${notoSerif.className} flex flex-col lg:flex-row min-[850px]:gap-40 px-4 py-10 lg:px-20 relative `}
    >
      {/* 📱 상단 로고 (모바일 전용) */}
      <div
        onClick={() => router.push('/')}
        className="lg:hidden text-white text-center text-2xl font-bold mb-4"
      >
        STAGE_101
      </div>

      {/* ⬅️ 왼쪽 푸터 (데스크탑만 표시) */}
      <div className="hidden lg:block ">
        <MypageFooter />
      </div>

      <div className="flex flex-col items-center lg:items-start gap-5 mt-10 lg:mt-20 px-4 w-full">
        <div className="w-full max-w-full lg:max-w-[600px] bg-[#151515] flex flex-col rounded-md shadow-lg">
          {/* 프로필 */}
          <MypageProfile
            profile_img={UserDataType?.profile_img || defaultProfileImg}
            nickname={UserDataType?.nickname ?? '미지정'}
            name={UserDataType?.name ?? '미지정'}
            point={UserDataType?.point ?? '미지정'}
          />

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
          <div className="bg-[#151515] w-full p-4 max-[431px]:p-0 overflow-x-hidden ">
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
