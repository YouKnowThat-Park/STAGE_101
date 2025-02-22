'use client';

import { useState } from 'react';
import AuthInputField from '../_components/AuthInputField';
import { useRouter } from 'next/navigation';
import { GobackIcon } from '@/ui/icon/GoBackIcon';
import signUp from './actions';

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
      console.log('✅ 회원가입 결과:', signUpResult);

      if (signUpResult.success) {
        console.log('🎉 회원가입 성공! 로그인으로 이동');
        await fetch('/api/logout', { method: 'GET' });

        router.push('/sign-in');
      } else {
        console.error('❌ 회원가입 실패:', signUpResult.message);
        alert(`❌ 회원가입 실패: ${signUpResult.message}`);
      }
    } catch (error) {
      console.error('🚨 서버 오류 발생:', error);
      alert('🚨 서버 오류 발생. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex  w-[600px] h-[600px] bg-white">
      <button onClick={goBack}>
        <GobackIcon size={40} color="#000" />
      </button>

      <form>
        <AuthInputField
          label="이메일"
          type="email"
          name="email"
          value={form.email}
          onChange={handleInputFiledChange}
        />
        <AuthInputField
          label="이름"
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputFiledChange}
        />
        <AuthInputField
          label="닉네임"
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleInputFiledChange}
        />
        <AuthInputField
          label="비밀번호"
          type="password"
          name="password"
          value={form.password}
          onChange={handleInputFiledChange}
        />
        <AuthInputField
          label="비밀번호 확인"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleInputFiledChange}
        />
        <AuthInputField
          label="휴대폰번호"
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleInputFiledChange}
        />
        <AuthInputField
          label="생년월일"
          type="text"
          name="birthdate"
          value={form.birthdate}
          onChange={handleInputFiledChange}
        />
        <button onClick={submitForm}>회원가입</button>
      </form>
    </div>
  );
};

export default SignUpPage;
