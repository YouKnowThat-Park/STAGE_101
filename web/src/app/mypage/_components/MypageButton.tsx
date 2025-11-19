import React from 'react';
import { MypageButtonProps } from 'src/types/mypage/mypage-type';

const MypageButton = ({ onClick, isActive, variant = 'primary', label }: MypageButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded transition-all duration-200 transform active:scale-105 ${
        variant === 'primary' ? ' text-black' : 'bg-red-500 text-white hover:bg-red-600'
      }`}
    >
      {label}
    </button>
  );
};
export default MypageButton;
