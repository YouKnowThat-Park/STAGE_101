'use client';

import { useRouter } from 'next/navigation';
import { GobackIcon } from '@/ui/icon/GoBackIcon';
import signUp from './actions';
import SignUpForm from './_components/SignUpForm';
import { SignUpFormData } from '../_components/SignUpSchema';

const SignUpPage = () => {
  const router = useRouter();

  const goBack = () => {
    router.push('/sign-in');
  };

  const submitForm = async (data: SignUpFormData) => {
    try {
      const signUpResult = await signUp(data);

      if (signUpResult.success) {
        await fetch('/api/logout', { method: 'GET' });

        router.push('/sign-in');
      } else {
        alert(`❌ 회원가입 실패: ${signUpResult.message}`);
      }
    } catch (error) {
      alert('🚨 서버 오류 발생. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className="flex  w-[600px] h-[600px] justify-center bg-white">
        <button onClick={goBack}>
          <GobackIcon size={40} color="#000" />
        </button>

        <SignUpForm onSubmit={submitForm} />
      </div>
      <div className="bg-white w-[600px] h-[100px] mt-3">
        <p>이용약관</p>
        <p>개인정보 보관</p>
      </div>
    </>
  );
};

export default SignUpPage;
