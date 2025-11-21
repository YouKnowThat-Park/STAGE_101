'use client';

import GoogleLogin from '../../../ui/icon/GoogleLogin';
import KakaoLogin from '../../../ui/icon/KakaoLogin';
import { useRouter } from 'next/navigation';
import SignInForm from './_components/SignInForm';
import { EmailPasswordFormData } from '../_components/CommonSchemas';
import signIn from './actions';
import { useUserStore } from 'src/store/userStore';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

const Page = () => {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const handleSignIn = async (data: EmailPasswordFormData) => {
    try {
      const result = await signIn(data.email, data.password);

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
    window.location.href = `${apiBase}/users/social/${provider}/signin`;
  };

  return (
    <div className=" py-20 bg-black text-white flex items-center justify-center">
      <div className="bg-[#1C1C1C]/80 border border-gray-700 rounded-xl px-10  py-10 shadow-md backdrop-blur w-[420px] flex flex-col gap-6">
        {/* 타이틀 */}
        <h2 className="text-2xl font-bold text-center text-white tracking-wide">
          <span className="text-[#C9A66B]">STAGE_101</span>
        </h2>

        {/* 로그인 폼 */}
        <SignInForm onSubmit={handleSignIn} />

        {/* 이메일 저장 & 비밀번호 찾기 */}
        <div className="flex justify-between text-sm text-gray-400">
          <label className="flex items-center gap-2">
            <input type="checkbox" id="checkbox" className="accent-[#C9A66B]" />
            이메일 저장
          </label>
          {/* <button className="underline hover:text-white">비밀번호 찾기</button> */}
        </div>

        {/* 소셜 로그인 */}
        <div className="flex justify-center gap-6 mt-2">
          <button onClick={() => handleSocialSignIn('kakao')}>
            <KakaoLogin />
          </button>
          <button onClick={() => handleSocialSignIn('google')}>
            <GoogleLogin />
          </button>
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="bg-[#C9A66B] text-black font-semibold w-full py-2 rounded-lg hover:bg-[#e7c894] transition"
          onClick={() => handleSignIn}
        >
          로그인
        </button>

        {/* 회원가입 */}
        <p className="text-center text-sm text-gray-400">
          계정이 없으신가요?{' '}
          <button onClick={handleSignUpPage} className="underline hover:text-white">
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};

export default Page;
