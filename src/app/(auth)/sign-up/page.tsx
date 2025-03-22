'use client';

import { useRouter } from 'next/navigation';
import { GoBackIcon } from '@/ui/icon/GoBackIcon';
import signUp from './actions';
import SignUpForm from './_components/SignUpForm';
import { SignUpFormData } from '../_components/SignUpSchema';
import { useEffect, useState, useCallback } from 'react';
import SignUpModal from './_components/SignUpModal';

const SignUpPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goBack = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const submitForm = async (data: SignUpFormData) => {
    try {
      const signUpResult = await signUp(data);

      if (signUpResult.success) {
        await fetch('/api/logout', { method: 'GET' });
        setIsModalOpen(true);
      } else {
        alert(`❌ 회원가입 실패: ${signUpResult.message}`);
      }
    } catch (error) {
      alert('🚨 서버 오류 발생. 다시 시도해주세요.');
    }
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    router.push('/sign-in?success=true');
  }, [router]);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(handleCloseModal, 3000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, handleCloseModal]);

  return (
    <div className="py-20 bg-black text-white flex items-center justify-center  px-4">
      {!isModalOpen && (
        <div className="bg-[#1C1C1C]/80 border border-gray-700 rounded-xl px-10 py-10 shadow-md backdrop-blur w-[420px] flex flex-col gap-6">
          {/* 🔄 상단 라인: 버튼 + 타이틀 */}
          <div className="relative h-10 mb-4">
            {/* 왼쪽 뒤로가기 버튼 */}
            <button
              onClick={goBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition"
            >
              <GoBackIcon size={24} color="#fff" />
            </button>

            {/* 가운데 타이틀 */}
            <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-[#C9A66B] tracking-wide">
              STAGE_101
            </h2>
          </div>

          {/* 폼 */}
          <SignUpForm onSubmit={submitForm} />

          {/* 하단 약관 */}
          <div className="text-xs text-gray-400 text-center mt-4">
            <p>이용약관 · 개인정보처리방침</p>
            <p>© 2024 STAGE_101. All Rights Reserved.</p>
          </div>
        </div>
      )}

      {/* 완료 모달 */}
      <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

SignUpPage.displayName = 'SignUpPage';
export default SignUpPage;
