'use server';

import { cookies } from 'next/headers';

export default async function signIn(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, message: '이메일과 비밀번호를 모두 입력해주세요.' };
    }

    const res = await fetch('http://localhost:8000/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.detail || '로그인에 실패했습니다.',
      };
    }

    const { user } = data;

    let cleanProfileImg = user.profile_img;
    if (typeof cleanProfileImg === 'string') {
      cleanProfileImg = cleanProfileImg.replace(/^"|"$/g, '').trim();
    } else {
      cleanProfileImg = null;
    }

    const cleanedUser = {
      ...user,
      profile_img: cleanProfileImg,
    };

    cookies().set('user_id', user.id || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      success: true,
      message: `${user.nickname}님 환영합니다.`,
      user: cleanedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '로그인 중 오류가 발생했습니다.',
    };
  }
}
