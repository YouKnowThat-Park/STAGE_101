'use client';

import GoogleLogin from '@/ui/icon/GoogleLogin';
import KakaoLogin from '@/ui/icon/KakaoLogin';
import QrLogin from '@/ui/icon/QrLogin';
import { useRouter } from 'next/navigation';
import SignInForm from './_components/SignInForm';
import { EmailPasswordFormData } from '../_components/CommonSchemas';
import signIn from './actions';
import { useUserStore } from '@/store/userStore';

const page = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const handleSignIn = async (data: EmailPasswordFormData) => {
    try {
      const user = await signIn(data.email, data.password);
      setUser(user);

      router.push('/');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignUpPage = () => {
    router.push('/sign-up');
  };

  return (
    <>
      <div className="flex gap-4 justify-center items-center h-screen">
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
          <div className="flex justify-center items-center gap-10 mt-9">
            <KakaoLogin />
            <GoogleLogin />
            <QrLogin />
          </div>

          {/* 로그인 버튼 */}
          <div className="flex justify-center items-center mt-9">
            <button className="bg-gray-500 h-10 w-48">로그인</button>
            <button onClick={handleSignUpPage}>회원가입</button>
          </div>
        </div>

        {/* 오른쪽 사진 박스 */}
        <div className="w-80 h-96 bg-white"></div>
      </div>
    </>
  );
};

export default page;
