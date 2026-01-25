'use client';

import { getValidImageUrl } from '../../shop/_components/getValidImageUrl';
import CoinIcon from '../../../ui/icon/CoinIcon';
import ProfileEditModal from './ProfileEditModal';
import Image from 'next/image';
import { useState } from 'react';
import { useUserStore } from '../../../store/userStore';
import { IoSettingsOutline } from 'react-icons/io5';

const defaultProfileImg = '/default.png';

const MypageProfile = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const { profile_img, nickname, name, point } = useUserStore();

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const profileSrc = getValidImageUrl(profile_img || defaultProfileImg);

  return (
    <div className="max-w-4xl h-[180px] p-4 md:p-6 flex items-center gap-4 md:gap-6 relative rounded-t-lg overflow-x-hidden">
      {/* 프로필 영역 */}
      <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 relative">
        <div className="flex md:flex-col items-center md:items-start justify-center gap-1 text-white/50 md:ml-10">
          <span className="text-xs tracking-[0.3em]">STAGE101</span>
          <span className="text-xs">•</span>
          <span className="text-xs tracking-[0.3em]">MY PAGE</span>
        </div>

        <div className="flex items-center gap-4  md:items-center md:j ml-14">
          {/* 프로필 이미지 */}
          <div className="w-[80px] h-[90px] md:w-[100px] md:h-[110px] border border-white/10 rounded-md overflow-hidden shrink-0">
            <Image
              src={profileSrc || defaultProfileImg}
              alt="profile_image"
              width={100}
              height={110}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>

          {/* 유저 정보 */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="w-[100px] bg-white/10 px-3 py-1.5 rounded-md text-white/60 text-sm flex flex-col justify-center items-center ">
              <div>{nickname || '미지정'}</div>
              <div className="text-xs ">{name || '미지정'}</div>
            </div>

            <div className="bg-white/10 flex items-center justify-end px-3 py-1.5 rounded-md gap-2 text-white/60 text-sm w-fit">
              {point ?? 0}
              <CoinIcon />
            </div>
          </div>
        </div>
      </div>

      {/* 설정 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpenModal(true)}
        className="absolute top-4 right-4 text-[#C9A66B] hover:text-[#E6C98A] transition"
        aria-label="프로필 설정"
      >
        <IoSettingsOutline size={20} />
      </button>

      {/* 설정 모달 */}
      {isOpenModal && <ProfileEditModal isOpen={isOpenModal} onClose={handleCloseModal} />}
    </div>
  );
};

export default MypageProfile;
