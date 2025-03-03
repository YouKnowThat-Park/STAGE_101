import React from 'react';

interface MypageButtonProps {
  onClick: () => void;
  label: string;
  isActive?: boolean;
  variant?: 'primary' | 'secondary';
}

const MypageButton = ({ onClick, isActive, variant = 'primary', label }: MypageButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition ${
        isActive
          ? 'bg-blue-500 text-white'
          : variant === 'primary'
            ? 'bg-white '
            : 'bg-red-500 text-white hover:bg-red-600'
      }`}
    >
      {label}
    </button>
  );
};

export default MypageButton;
