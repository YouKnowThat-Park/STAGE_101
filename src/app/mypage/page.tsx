'use client';
import { useUserStore } from '@/store/userStore';
import React, { useState } from 'react';
import MypageHistory from './_components/MypageHistory';
import MypageQna from './_components/MypageQna';
import MypageTicket from './_components/MypageTicket';
import MypageButton from './_components/MypageButton';
import MypageProfile from './_components/MypageProfile';
import { useUserHook } from '@/hooks/useUserHook';
import TicketIcon from '@/ui/icon/TicketIcon';
import InquiryIcon from '@/ui/icon/InquiryIcon';
import MypageReview from './_components/MypageReview';
import ReviewIcon from '@/ui/icon/ReviewIcon';
import HistoryIcon from '@/ui/icon/HistoryIcon';
import MypageFooter from './_components/MypageFooter';

const defaultProfileImg = '/next.svg'; // ✅ public 폴더 이미지 경로

const buttonTabs = [
  {
    key: 'ticket',
    label: (
      <div className="flex flex-col items-center">
        <TicketIcon />
        <span>TICKET</span>
      </div>
    ),
  },
  {
    key: 'review',
    label: (
      <div className="flex flex-col items-center">
        <ReviewIcon />
        <span>REVIEW</span>
      </div>
    ),
  },
  {
    key: 'history',
    label: (
      <div className="flex flex-col items-center">
        <HistoryIcon />
        <span>HISTORY</span>
      </div>
    ),
  },
  {
    key: 'qna',
    label: (
      <div className="flex flex-col items-center">
        <InquiryIcon />
        <span>Q&A</span>
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

      <div className="w-[600px] h-[740px] bg-white flex flex-col justify-end ml-auto mt-20">
        {/* 프로필 & 유저 정보 */}
        <MypageProfile
          profile_img={profile_img || defaultProfileImg}
          nickname={nickname}
          name={name}
          point={point}
        />

        {/* 네비게이션 탭 */}
        <div className="bg-white max-w-4xl p-2 ">
          <nav className="flex justify-center items-center gap-20 border-b-2">
            {buttonTabs.map((tab) => (
              <MypageButton
                key={tab.key}
                label={tab.label}
                onClick={() => setSelectedTab(tab.key)}
                isActive={selectedTab === tab.key}
              />
            ))}
          </nav>
          {/* 선택된 탭에 따라 내용 변경 */}
          <div className="mt-6 ">
            {selectedTab === 'ticket' && <MypageTicket />}

            {selectedTab === 'review' && <MypageReview />}

            {selectedTab === 'history' && <MypageHistory />}

            {selectedTab === 'qna' && <MypageQna />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
