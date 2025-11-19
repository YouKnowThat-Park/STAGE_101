import { SafeUserType } from '../user/user-type';

export interface HeaderProps {
  user: SafeUserType | null;
}

export interface LayoutSwitcherProps {
  children: React.ReactNode;
  user: SafeUserType | null;
}
