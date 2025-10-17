import React, { ReactNode } from 'react';

interface MypageButtonProps {
  onClick: () => void;
  label: string | ReactNode;
  isActive?: boolean;
  variant?: 'primary' | 'secondary';
}
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
