'use client';
import { getValidImageUrl } from '@/app/shop/_components/getValidImageUrl';
import CoinIcon from '@/ui/icon/CoinIcon';
import GearIcon from '@/ui/icon/GearIcon';
import ProfileEditModal from './ProfileEditModal';
import Image from 'next/image';
import { useState } from 'react';

interface MypageProfileProps {
  profile_img: string;
  nickname: string | null;
  name: string;
  point: number;
}

const MypageProfile = ({ profile_img, nickname, name, point }: MypageProfileProps) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <div className="bg-[#151515] w-full max-w-4xl h-[150px] p-4 md:p-6 flex items-center gap-4 md:gap-6 relative rounded-t-lg border border-gray-500">
      {/* 프로필 이미지 */}
      <div className="flex items-center gap-4 w-full relative">
        <div className="bg-white w-[80px] h-[90px] md:w-[100px] md:h-[110px] border border-black rounded-md flex items-center justify-center overflow-hidden shrink-0">
          <Image
            src={getValidImageUrl(profile_img) || '/default.png'}
            alt="profile_image"
            width={100}
            height={110}
            className="rounded-lg object-cover w-full h-full"
          />
        </div>

        {/* 유저 정보 */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="bg-white w-28 px-3 py-1.5 md:px-4 md:py-2 text-[14px] md:text-[15px] rounded-md text-black">
            {nickname}
            <br />
            <span className="text-sm">{name}</span>
          </div>
          <div className="bg-white w-28 flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-md gap-2 text-black text-sm">
            {point}
            <CoinIcon />
          </div>
        </div>

        {/* 기어 아이콘 */}
      </div>
      <button
        className="absolute top-0 right-0 md:ml-[220px] md:mb-[70px] text-white"
        onClick={() => setIsOpenModal(true)}
      >
        <GearIcon />
      </button>

      {/* 설정 모달 */}
      {isOpenModal && <ProfileEditModal isOpen={isOpenModal} onClose={handleCloseModal} />}
    </div>
  );
};

export default MypageProfile;
