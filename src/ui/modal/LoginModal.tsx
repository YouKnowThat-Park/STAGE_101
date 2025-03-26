'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* ✅ 배경 오버레이 (같은 z-index 내부에 위치) */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* ✅ 모달 박스 */}
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-[340px] min-h-[240px] text-center z-[101]">
        <h2 className="text-lg font-bold mb-2">로그인 해주세요!</h2>
        <p className="text-sm text-gray-700 mb-1">해당 기능은 로그인이 필요합니다.</p>
        <p className="text-sm text-gray-700 mb-4">로그인 페이지로 이동해주세요.</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            로그인 하기
          </button>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white py-2 rounded">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
