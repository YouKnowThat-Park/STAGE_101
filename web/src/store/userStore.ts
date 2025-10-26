// store/userStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/** ✅ 전역 상태용 유저 타입 정의 */
export interface SafeUserType {
  id: string;
  nickname: string;
  profile_img: string;
  point: number | null;
}

interface UserState extends SafeUserType {
  setUser: (user: SafeUserType | null) => void;
  clearUser: () => void;
}

/** ✅ Zustand + persist 적용 (LocalStorage에 안전한 필드만 저장) */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: '',
      nickname: '',
      profile_img: '',
      point: null,
      setUser: (user) => {
        if (user) {
          set({ ...user });
        } else {
          set({
            id: '',
            nickname: '',
            profile_img: '',
            point: null,
          });
        }
      },
      clearUser: () => {
        set({
          id: '',
          nickname: '',
          profile_img: '',
          point: null,
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        id: state.id,
        nickname: state.nickname,
        profile_img: state.profile_img,
        point: state.point,
      }),
    },
  ),
);
