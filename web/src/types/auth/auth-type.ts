import { ReactNode } from 'react';
import { SafeUserType } from '../user/user-type';

export interface AuthInputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LogoutProps {
  user: SafeUserType | null;
}

export interface ProvidersProps {
  children: ReactNode;
  initialUser: SafeUserType | null;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
