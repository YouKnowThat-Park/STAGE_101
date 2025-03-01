import { UserType } from '@/types/user-tpye';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
}

// ✅ Zustand persist 적용 (LocalStorage에 유저 데이터 저장)
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        console.log('✅ Zustand 상태 변경:', user);
        set({ user });
      },
      clearUser: () => {
        set({ user: null });
        localStorage.removeItem('user-storage'); // ✅ LocalStorage에서 제거
      },
    }),
    {
      name: 'user-storage', // ✅ LocalStorage 키
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
