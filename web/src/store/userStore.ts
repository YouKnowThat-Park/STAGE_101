'use client';

import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { decryptString, encryptString } from 'src/utils/secureStorage';
import { SafeUserType, UserState } from 'src/types/user/user-type';

const encryptedStateStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;

    const raw = window.localStorage.getItem(name);
    if (!raw) return null;

    try {
      const decrypted = decryptString(raw); // JSON string 복원
      return decrypted;
    } catch {
      // 복호화 실패하면 무시
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;

    try {
      const encrypted = encryptString(value); // JSON string 암호화
      window.localStorage.setItem(name, encrypted);
    } catch {
      // 실패하면 저장 안 함
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(name);
  },
};

/** ✅ Zustand + persist + 암호화된 localStorage 사용 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: '',
      nickname: '',
      profile_img: null,
      point: null,
      token: null,
      name: '',

      setUser: (user, token = null) => {
        if (user) {
          set({
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            profile_img: user.profile_img,
            point: user.point,
            token,
          });
        } else {
          set({
            id: '',
            nickname: '',
            profile_img: null,
            point: null,
            token: null,
            name: '',
          });
        }
      },

      clearUser: () => {
        set({
          id: '',
          nickname: '',
          profile_img: null,
          point: null,
          token: null,
          name: '',
        });
      },
    }),
    {
      name: 'stage101',
      // 🔥 StateStorage → PersistStorage 변환 + JSON.stringify/parse
      storage: createJSONStorage(() => encryptedStateStorage),
      // partialize 생략: 어차피 함수(setUser, clearUser)는 JSON에 안 들어감
    },
  ),
);

/** ✅ SSR에서 내려준 user로 초기화 (이미 쓰고 있던 함수) */
export const initializeUserStore = (user: SafeUserType | null) => {
  useUserStore.setState((state) => {
    if (!user) {
      return {
        ...state,
        id: '',
        nickname: '',
        profile_img: null,
        point: null,
        token: null,
      };
    }

    return {
      ...state,
      id: user.id,
      nickname: user.nickname,
      profile_img: user.profile_img,
      point: user.point,
      // token은 서버 세션/쿠키로 관리 → 여기선 null 유지
      token: null,
    };
  });
};
