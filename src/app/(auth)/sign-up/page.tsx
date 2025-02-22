'use client';

import { useState } from 'react';
import AuthInputField from '../_components/AuthInputField';
import { useRouter } from 'next/navigation';
import { GobackIcon } from '@/ui/icon/GoBackIcon';
import signUp from './actions';

const inputFields = [
  { label: '이메일', type: 'email', name: 'email' },
  { label: '이름', type: 'text', name: 'name' },
  { label: '닉네임', type: 'text', name: 'nickname' },
  { label: '비밀번호', type: 'password', name: 'password' },
  { label: '비밀번호 확인', type: 'password', name: 'confirmPassword' },
  { label: '휴대폰번호', type: 'text', name: 'phone' },
  { label: '생년월일', type: 'text', name: 'birthdate' },
] as const;

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
    <>
      <div className="flex  w-[600px] h-[600px] justify-center bg-white">
        <button onClick={goBack}>
          <GobackIcon size={40} color="#000" />
        </button>

        <form>
          {inputFields.map((field) => (
            <AuthInputField
              key={field.name}
              label={field.label}
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleInputFiledChange}
            />
          ))}
          <button onClick={submitForm}>회원가입</button>
        </form>
      </div>
      <div className="bg-white w-[600px] h-[100px] mt-3">
        <p>이용약관</p>
        <p>개인정보 보관</p>
      </div>
    </>
  );
};

export default SignUpPage;
