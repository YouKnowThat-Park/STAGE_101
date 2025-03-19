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

  // 🔹 뒤로 가기 (useCallback 적용)
  const goBack = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  // 🔹 회원가입 처리
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

  // 🔹 모달 닫기 처리 (useCallback 적용)
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    router.push('/sign-in?success=true'); // ✅ `??` → `?`로 수정 (잘못된 URL 수정)
  }, [router]);

  // ✅ `handleCloseModal`이 `useEffect` 의존성 배열에서 빠지도록 개선
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(handleCloseModal, 3000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, handleCloseModal]);

  return (
    <>
      {!isModalOpen && (
        <div>
          {/* 🔹 회원가입 UI */}
          <div className="flex w-[600px] h-[600px] justify-center bg-gray-300">
            <button onClick={goBack}>
              <GoBackIcon size={40} color="#000" />
            </button>
            <SignUpForm onSubmit={submitForm} />
          </div>

          {/* 🔹 하단 이용약관 */}
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

// ✅ `displayName` 추가 (빌드 경고 해결)
SignUpPage.displayName = 'SignUpPage';

export default SignUpPage;
