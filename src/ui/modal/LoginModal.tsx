import { useRouter } from 'next/navigation';
import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const router = useRouter();

  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링하지 않음

  return (
    <>
      {/* ✅ 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* ✅ 모달 중앙 정렬 */}
      <div className="fixed inset-0 flex justify-center items-center z-[10000]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] h-[200px] text-center relative">
          <h2 className="text-lg font-bold mb-4">로그인 해주세요!</h2>
          <p>해당 기능은 로그인이 필요합니다.</p>
          <p>로그인 페이지로 이동해주세요.</p>
          <div className="flex">
            <button
              onClick={() => router.push('/sign-in')}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              로그인 하기
            </button>
            <button onClick={onClose} className="bg-[#E63E56] text-white px-4 py-2 rounded w-full">
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
