'use client';

import GoogleLogin from '@/ui/icon/GoogleLogin';
import KakaoLogin from '@/ui/icon/KakaoLogin';
import QrLogin from '@/ui/icon/QrLogin';
import { useRouter } from 'next/navigation';
import SignInForm from './_components/SignInForm';
import { EmailPasswordFormData } from '../_components/CommonSchemas';
import signIn from './actions';
import { useUserStore } from '@/store/userStore';
import { startTransition } from 'react';
import { socialLogin } from './kakao/actions';

const Page = () => {
  const router = useRouter();

  const handleSignIn = async (data: EmailPasswordFormData) => {
    try {
      const user = await signIn(data.email, data.password);
      useUserStore.getState().setUser(user); // ✅ Zustand 상태 업데이트

      const checkbox = document.getElementById('checkbox');
      if (checkbox instanceof HTMLInputElement && checkbox.checked) {
        localStorage.setItem('savedEmail', data.email);
      } else {
        localStorage.removeItem('savedEmail');
      }

      router.push('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignUpPage = () => {
    router.push('/sign-up');
  };

  const handleSocialSignIn = (provider: 'kakao' | 'google') => {
    startTransition(() => socialLogin(provider));
  };

  return (
    <>
      <div className="flex gap-4 justify-center items-center py-10">
        <div className="w-[450px] h-96 bg-slate-400 flex flex-col gap-1 p-4">
          <SignInForm onSubmit={handleSignIn} />

          <div className="flex justify-center items-center mt-2">
            <div className="flex gap-2">
              <input type="checkbox" id="checkbox" />
              <label htmlFor="checkbox" className="text-sm">
                이메일 저장
              </label>
            </div>
            <p className="ml-48 text-sm">이메일/비밀번호 찾기</p>
          </div>

          {/* Test 소설 로그인 아이콘 */}
          <div className="flex justify-center gap-6 mt-4">
            <button onClick={() => handleSocialSignIn('kakao')}>
              <KakaoLogin />
            </button>
            <button onClick={() => handleSocialSignIn('google')}>
              <GoogleLogin />
            </button>
            <button onClick={() => alert('QR 로그인 기능 준비 중!')}>
              <QrLogin />
            </button>
          </div>

          {/* 로그인 버튼 */}
          <div className="flex flex-col justify-center items-center mt-9 gap-2">
            <button className="bg-blue-500 text-white h-10 w-48">로그인</button>
            <button className="text-sm ml-[200px] border-b border-black" onClick={handleSignUpPage}>
              이메일과 비밀번호가 없으신가요?
            </button>
          </div>
        </div>

        {/* 오른쪽 사진 박스 */}
        <div className="w-80 h-96 bg-white"></div>
      </div>
    </>
  );
};

export default Page;
