'use client';

import { useRouter } from 'next/navigation';
import GoogleLogin from '../../../ui/icon/GoogleLogin';
import KakaoLogin from '../../../ui/icon/KakaoLogin';
import { EmailPasswordFormData } from '../_components/CommonSchemas';
import { signInAction } from './actions';
import SignInForm from './_components/SignInForm';
import { useUserStore } from 'src/store/userStore';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

const Page = () => {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const handleSignIn = async (data: EmailPasswordFormData) => {
    try {
      const result = await signInAction(data.email, data.password);

      if (!result.success) {
        alert(result.message);
        return;
      }

      if (result.user) {
        setUser(result.user ?? null);
      }

      const checkbox = document.getElementById('checkbox');
      if (checkbox instanceof HTMLInputElement && checkbox.checked) {
        localStorage.setItem('savedEmail', data.email);
      } else {
        localStorage.removeItem('savedEmail');
      }

      router.push('/');
      router.refresh();
    } catch (error: any) {
      alert(error.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleSignUpPage = () => {
    router.push('/sign-up');
  };

  const handleSocialSignIn = (provider: 'kakao' | 'google') => {
    window.location.href = `${API_BASE}/users/social/${provider}/signin`;
  };

  const handleClickLoginButton = () => {
    const form = document.getElementById('signin-form') as HTMLFormElement | null;
    form?.requestSubmit();
  };

  return (
    <div className="flex items-center justify-center bg-black py-20 text-white">
      <div className="flex w-[420px] flex-col gap-6 rounded-xl border border-gray-700 bg-[#1C1C1C]/80 px-10 py-10 shadow-md backdrop-blur">
        <h2 className="text-center text-2xl font-bold tracking-wide text-white">
          <span className="text-[#C9A66B]">STAGE_101</span>
        </h2>

        <SignInForm onSubmit={handleSignIn} />

        <div className="flex justify-between text-sm text-gray-400">
          <label className="flex items-center gap-2">
            <input type="checkbox" id="checkbox" className="accent-[#C9A66B]" />
            이메일 저장
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-[#C9A66B] py-2 font-semibold text-black transition hover:bg-[#e7c894]"
          onClick={handleClickLoginButton}
        >
          로그인
        </button>

        <p className="text-center text-sm text-gray-400">
          계정이 없으신가요?{' '}
          <button onClick={handleSignUpPage} className="underline hover:text-white">
            회원가입
          </button>
        </p>

        <div className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-white/15" />
          <p className="shrink-0 px-1 text-xs text-white/45">간편 로그인</p>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleSocialSignIn('kakao')}
            className="transition hover:scale-105"
            aria-label="카카오 로그인"
          >
            <KakaoLogin />
          </button>
          <button
            onClick={() => handleSocialSignIn('google')}
            className="transition hover:scale-105"
            aria-label="구글 로그인"
          >
            <GoogleLogin />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
