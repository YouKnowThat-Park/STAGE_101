import { ReactNode } from 'react';

export interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MypageButtonProps {
  onClick: () => void;
  label: string | ReactNode;
  isActive?: boolean;
  variant?: 'primary' | 'secondary';
}

export interface MypageProfileProps {
  profile_img: string;
  nickname: string | null;
  name: string;
  point: number;
}
