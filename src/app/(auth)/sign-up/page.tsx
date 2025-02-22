'use client';

import { useState } from 'react';
import AuthInputField from '../_components/AuthInputField';
import { useRouter } from 'next/navigation';
import { GobackIcon } from '@/ui/icon/GoBackIcon';
import signUp from './actions';
import SignUpForm from './_components/SignUpForm';

const SignUpPage = () => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthdate: '',
  });

  const router = useRouter();

  const goBack = () => {
    router.push('/sign-in');
  };

  const handleInputFiledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입 요청 시작:', form);

    try {
      const signUpResult = await signUp(form);

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

        <SignUpForm form={form} onChange={handleInputFiledChange} onSubmit={submitForm} />
      </div>
      <div className="bg-white w-[600px] h-[100px] mt-3">
        <p>이용약관</p>
        <p>개인정보 보관</p>
      </div>
    </>
  );
};

export default SignUpPage;
