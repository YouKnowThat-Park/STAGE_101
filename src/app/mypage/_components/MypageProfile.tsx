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
    <div className="bg-white w-full max-w-4xl h-[150px] p-6 flex items-center gap-6 relative rounded-lg border border-gray-500">
      {/* 프로필 이미지 */}
      <div className="flex gap-5 p-3 w-full">
        <div className="bg-white w-[100px] h-[100px] border border-black rounded-sm flex items-center justify-center overflow-hidden">
          <Image
            src={getValidImageUrl(profile_img)}
            alt="profile_image"
            width={100}
            height={100}
            className="rounded-lg object-cover"
            style={{ objectFit: 'cover' }} // ✅ 이미지가 컨테이너를 넘지 않도록 설정
          />
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

        {/* 기어 아이콘 클릭 시 모달 열기 */}
        <button className="ml-[220px] mb-[70px]" onClick={() => setIsOpenModal(true)}>
          <GearIcon />
        </button>
      </div>

      {/* 설정 모달 */}
      {isOpenModal && <ProfileEditModal isOpen={isOpenModal} onClose={handleCloseModal} />}
    </div>
  );
};

export default MypageProfile;
