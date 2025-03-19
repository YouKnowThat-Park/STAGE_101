import { UserType } from '@/types/user-type';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState extends UserType {
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
}

// ✅ Zustand persist 적용 (LocalStorage에 유저 데이터 저장)
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: '',
      email: '',
      nickname: '',
      profile_img: '',
      created_at: '',
      name: '',
      phone: '',
      point: null,
      setUser: (user) => {
        if (user) {
          set({ ...user });
        } else {
          set({
            id: '',
            email: '',
            nickname: '',
            profile_img: '',
            created_at: '',
            name: '',
            phone: '',
            point: null,
          });
        }
      },
      clearUser: () => {
        set({
          id: '',
          email: '',
          nickname: '',
          profile_img: '',
          created_at: '',
          name: '',
          phone: '',
          point: null,
        });
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
        created_at: state.created_at,
        name: state.name,
        phone: state.phone,
        point: state.point,
      }), // ✅ 불필요한 데이터 저장 방지
    },
  ),
);
