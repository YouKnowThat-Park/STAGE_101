<<<<<<< HEAD
'use client';

import { useRouter } from 'next/navigation';
import { GoBackIcon } from '@/ui/icon/GoBackIcon';
import signUp from './actions';
import SignUpForm from './_components/SignUpForm';
import { SignUpFormData } from '../_components/SignUpSchema';
import { useEffect, useState } from 'react';
import SignUpModal from './_components/SignUpModal';

const SignUpPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goBack = () => {
    router.push('/sign-in');
  };

  const submitForm = async (data: SignUpFormData) => {
    try {
      const signUpResult = await signUp(data);

      if (signUpResult.success) {
        await fetch('/api/logout', { method: 'GET' });

        // router.push('/sign-in');
        setIsModalOpen(true);
      } else {
        alert(`❌ 회원가입 실패: ${signUpResult.message}`);
      }
    } catch (error) {
      alert('🚨 서버 오류 발생. 다시 시도해주세요.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/sign-in??success=true');
  };

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        handleCloseModal();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  return (
    <>
      {!isModalOpen && (
        <div>
          <div className="flex  w-[600px] h-[600px] justify-center bg-white">
            <button onClick={goBack}>
              <GoBackIcon size={40} color="#000" />
            </button>

            <SignUpForm onSubmit={submitForm} />
          </div>
          <div className="bg-white w-[600px] h-[100px] mt-3">
            <p>이용약관</p>
            <p>개인정보 보관</p>
          </div>
        </div>
      )}
      <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SignUpPage;
=======
import React from "react";

const page = () => {
  return <div></div>;
};

export default page;
>>>>>>> main
