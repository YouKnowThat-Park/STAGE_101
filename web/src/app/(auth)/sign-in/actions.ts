'use server';

import { cookies } from 'next/headers';
import { SignInResult } from 'src/types/auth/auth-type';
import { SafeUserType } from 'src/types/user/user-type';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function signInAction(email: string, password: string): Promise<SignInResult> {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: '이메일과 비밀번호를 모두 입력해주세요.',
      };
    }

    const res = await fetch(`${API_BASE}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.detail || '로그인에 실패했습니다.',
      };
    }

    const { user } = data;

    const cleanedUser: SafeUserType = {
      id: user.id,
      nickname: user.nickname,
      profile_img: user.profile_img ?? null,
      point: user.point ?? null,
      name: user.name ?? '',
    };

    // __stage__ 쿠키 전달
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      const match = setCookieHeader.match(/__stage__=([^;]+)/);
      if (match) {
        const token = match[1];
        const cookieStore = cookies();
        cookieStore.set('__stage__', token, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60,
        });
      }
    }

    return {
      success: true,
      message: `${user.nickname}님 환영합니다.`,
      user: cleanedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || '로그인 중 오류가 발생했습니다.',
    };
  }
}
