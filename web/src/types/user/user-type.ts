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
  phone: string;
}

export interface UserState extends SafeUserType {
  token: string | null;
  setUser: (user: SafeUserType | null, token?: string | null) => void;
  clearUser: () => void;
  reset: () => void;
}

export interface UpdateUserProfilePayload {
  nickname: string;
  profile_img: string | null;
}

export type DeleteUserPayload =
  | { password: string; agreement_text?: undefined } // 일반 회원
  | { agreement_text: string; password?: undefined }; // 소셜 회원
