import { UserType } from '@/types/user-type';
import CoinIcon from '@/ui/icon/CoinIcon';
import GearIcon from '@/ui/icon/GearIcon';
import Image from 'next/image';
import React from 'react';

interface MypageProfileProps {
  profile_img: string;
  nickname: string | null;
  name: string;
  point: number;
}

const MypageProfile = ({ profile_img, nickname, name, point }: MypageProfileProps) => {
  return (
    <div className="bg-[#272625] w-full max-w-4xl h-[150px] p-6  flex items-center gap-6">
      <div className="bg-white w-[100px] h-[100px] rounded-sm flex items-center justify-center">
        <Image src={profile_img} alt="profile_image" width={100} height={100} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="bg-white px-4 py-2 rounded-md text-black">
          {nickname} / <span className="text-sm">{name}</span>
        </div>
        <div className="bg-white flex px-4 py-2 rounded-md gap-2 text-black">
          {point}
          <CoinIcon />
        </div>
      </div>

      <div className="mb-32 ml-48">
        <GearIcon />
      </div>
    </div>
  );
};

export default MypageProfile;
