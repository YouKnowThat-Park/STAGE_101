import { UserType } from '@/types/user-type';
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
    <div className="bg-white w-full max-w-4xl h-[200px] p-6  flex items-center gap-6">
      <div className="bg-white w-[150px] h-[150px] rounded-sm flex items-center justify-center">
        <Image src={profile_img} alt="profile_image" width={200} height={200} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-slate-500 px-4 py-2 rounded-md text-white">
          {nickname} / <span className="text-sm">{name}</span>
        </div>
        <div className="bg-slate-500 px-4 py-2 rounded-md text-white">포인트:{point} </div>
      </div>
      <GearIcon />
    </div>
  );
};

export default MypageProfile;
