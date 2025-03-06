import { UserType } from '@/types/user-type';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  id: string | null;
  email: string | null;
  nickname: string | null;
  profile_img: string | null;
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
}

// ✅ Zustand persist 적용 (LocalStorage에 유저 데이터 저장)
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      email: null,
      nickname: null,
      profile_img: null,
      setUser: (user) => {
        if (user) {
          set({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            profile_img: user.profile_img,
          });
        } else {
          set({ id: null, email: null, nickname: null, profile_img: null });
        }
      },
      clearUser: () => {
        set({ id: null, email: null, nickname: null, profile_img: null });
      },
    }),
    {
      name: 'user-storage', // ✅ LocalStorage 키
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        id: state.id,
        email: state.email,
        nickname: state.nickname,
        profile_img: state.profile_img,
      }), // ✅ 불필요한 데이터 저장 방지
    },
  ),
);
