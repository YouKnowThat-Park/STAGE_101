import { getValidImageUrl } from '@/app/shop/_components/getValidImageUrl';
import { UserType } from '@/types/user-type';
import CoinIcon from '@/ui/icon/CoinIcon';
import GearIcon from '@/ui/icon/GearIcon';
import Image from 'next/image';
import React, { useState } from 'react';
import SettingModal from './SettingModal';

interface MypageProfileProps {
  profile_img: string;
  nickname: string | null;
  name: string;
  point: number;
}

const MypageProfile = ({ profile_img, nickname, name, point }: MypageProfileProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <div className="bg-[#151515] w-full max-w-4xl h-[150px] p-6 flex items-center gap-6 relative">
      {/* ✅ 기어 아이콘 - 부모 div 내부 오른쪽 상단에 배치 */}
      <button className="absolute top-4 right-4 z-10" onClick={() => setIsOpenModal(true)}>
        <GearIcon />
      </button>

      {/* 프로필 이미지 */}
      <div className="bg-white w-[100px] h-[100px] rounded-sm flex items-center justify-center">
        <Image src={getValidImageUrl(profile_img)} alt="profile_image" width={100} height={100} />
      </div>

      {/* 유저 정보 */}
      <div className="flex flex-col gap-2">
        <div className="bg-white px-4 py-2 rounded-md text-black">
          {nickname} / <span className="text-sm">{name}</span>
        </div>
        <div className="bg-white flex px-4 py-2 rounded-md gap-2 text-black">
          {point}
          <CoinIcon />
        </div>
      </div>

      {/* 설정 모달 */}
      {isOpenModal && <SettingModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} />}
    </div>
  );
};

export default MypageProfile;
