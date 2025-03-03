'use client';
import { useUserStore } from '@/store/userStore';
import React, { useState } from 'react';
import MypageCart from './_components/MypageCart';
import MypageHistory from './_components/MypageHistory';
import MypageQna from './_components/MypageQna';
import MypageTicket from './_components/MypageTicket';
import MypageButton from './_components/MypageButton';
import MypageProfile from './_components/MypageProfile';
import { useUserHook } from '@/hooks/useUserHook';

const defaultProfileImg = '/next.svg'; // ✅ public 폴더 이미지 경로

const buttonTabs = [
  { key: 'ticket', label: '티켓' },
  { key: 'cart', label: '리뷰' },
  { key: 'history', label: '거래내역' },
  { key: 'qna', label: '문의내역' },
];

const MyPage = () => {
  const { id, nickname, profile_img } = useUserStore();
  const [selectedTab, setSelectedTab] = useState('ticket');
  const { name, point } = useUserHook(id);

  console.log('data', name, point);

  return (
    <div className="w-[600px] h-full flex flex-col justify-end items-center  p-6">
      {/* 프로필 & 유저 정보 */}
      <MypageProfile
        profile_img={profile_img || defaultProfileImg}
        nickname={nickname}
        name={name}
        point={point}
      />

      {/* 네비게이션 탭 */}
      <div className="bg-slate-300 max-w-4xl p-6 ">
        <nav className="flex justify-center items-center gap-20">
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
        <div className="mt-6">
          {selectedTab === 'ticket' && <MypageTicket />}

          {selectedTab === 'cart' && <MypageCart />}

          {selectedTab === 'history' && <MypageHistory />}

          {selectedTab === 'qna' && <MypageQna />}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
