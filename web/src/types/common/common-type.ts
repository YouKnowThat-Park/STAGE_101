import { SafeUserType } from '../user/user-type';

export interface HeaderProps {
  user: SafeUserType | null;
}

export interface LayoutSwitcherProps {
  children: React.ReactNode;
  user: SafeUserType | null;
}

export interface ServerOptions {
  cookie?: string;
}

export interface HeaderScrollProps {
  topClass?: string;
  rightClass?: string;
  bottomClass?: string;
}

export interface BannerImage {
  id: string;
  src: string;
  alt: string;
  pos?: string;
  theaterKey: string;
}
