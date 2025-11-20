export interface UserResponse {
  id: string;
  name: string | null;
  phone: string | null;
  point: number;
  email?: string;
}

export interface MypageUserResponse extends UserResponse {
  nickname: string;
  profile_img: string;
}

export interface SafeUserType {
  id: string;
  nickname: string;
  profile_img: string | null;
  point: number | null;
  name: string;
}

export interface UserState extends SafeUserType {
  token: string | null;
  setUser: (user: SafeUserType | null, token?: string | null) => void;
  clearUser: () => void;
}
