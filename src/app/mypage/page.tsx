'use client';
import { useUserStore } from '@/store/userStore';
import React, { useState } from 'react';
import MypageHistory from './_components/MypageHistory';
import MypageTicket from './_components/MypageTicket';
import MypageProfile from './_components/MypageProfile';
import { useUserHook } from '@/hooks/useUserHook';

import MypageReview from './_components/MypageReview';

import MypageFooter from './_components/MypageFooter';

const defaultProfileImg = '/default.png'; // ✅ public 폴더 이미지 경로

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
  const { id, nickname, profile_img } = useUserStore();
  const [selectedTab, setSelectedTab] = useState('ticket');
  const { name, point } = useUserHook(id);

  return (
    <div className="flex gap-24">
      <div>
        <MypageFooter />
      </div>

      <div className="flex flex-col gap-5 mt-20 ml-28">
        <div className="w-[600px] h-[540px] bg-[#151515] flex flex-col  ml-auto  ">
          <MypageProfile
            profile_img={profile_img || defaultProfileImg}
            nickname={nickname}
            name={name}
            point={point}
          />
          <nav className="bg-white flex justify-center items-center gap-20 border-b-2 border-gray-300">
            {buttonTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={` py-2  border-b-2 ${
                  selectedTab === tab.key ? 'border-black' : 'border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          {/* 네비게이션 탭 */}
          <div className="bg-white max-w-4xl border-gray-500 p-2 ">
            {/* 선택된 탭에 따라 내용 변경 */}
            <div className="mt-6 ">
              {selectedTab === 'ticket' && <MypageTicket />}

              {selectedTab === 'review' && <MypageReview />}

              {selectedTab === 'history' && <MypageHistory />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
