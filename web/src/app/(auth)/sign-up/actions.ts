'use server';
import { cookies } from 'next/headers';
import { SignUpParams, SignUpResult } from 'src/types/auth/auth-type';
import { SafeUserType } from 'src/types/user/user-type';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export async function signUpAction({
  email,
  password,
  name,
  phone,
  nickname,
}: SignUpParams): Promise<SignUpResult> {
  try {
    // 1) 프론트 단 검증
    if (!email || !password || !name || !phone || !nickname) {
      return { success: false, message: '모든 정보를 입력해주세요.' };
    }
    if (!PASSWORD_REGEX.test(password)) {
      return {
        success: false,
        message: '비밀번호는 대/소문자, 숫자, 특수문자가 모두 포함된 8자 이상이어야 합니다.',
      };
    }
    if (!EMAIL_REGEX.test(email)) {
      return {
        success: false,
        message: '이메일 형식이 올바르지 않습니다. 예시)stage@stage.com',
      };
    }
    if (name.length < 2) {
      return { success: false, message: '이름은 최소 2자리 이상이어야 합니다.' };
    }
    if (nickname.length < 2) {
      return { success: false, message: '닉네임은 최소 2자리 이상이어야 합니다.' };
    }

    // 2) FastAPI 회원가입 호출
    const res = await fetch(`${API_BASE}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 서버 액션이라 credentials 옵션은 필요 없음
      body: JSON.stringify({ name, nickname, email, phone, password }),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      return {
        success: false,
        message: data.detail || '회원가입 실패',
      };
    }

    // 서버 응답: { message, user: { id, nickname, profile_img, point } }
    const { user } = data;
    if (!user) {
      return {
        success: false,
        message: '회원가입 응답에 유저 정보가 없습니다.',
      };
    }

    const cleanedUser: SafeUserType = {
      id: user.id,
      nickname: user.nickname,
      profile_img: user.profile_img ?? null,
      point: user.point ?? null,
      phone: user.phone ?? null,
      name,
    };

    // 3) FastAPI가 내려준 __stage__ 쿠키를 브라우저 쿠키로 다시 세팅
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
          maxAge: 60 * 60, // 1시간
        });
      }
    }

    return {
      success: true,
      message: data.message ?? `${name} 회원가입에 성공했습니다.`,
      user: cleanedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || '회원가입 중 오류가 발생했습니다.',
    };
  }
}
