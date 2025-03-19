import { ModalProps } from '@/types/modal/modal-type';
import DeleteIcon from '@/ui/icon/DeleteIcon';
import React, { useState } from 'react';

const SettingModal = ({ isOpen, onClose }: ModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!confirmDelete) return;

    setLoading(true);

    const response = await fetch('/api/auth/delete-user', { method: 'DELETE' });

    if (response.ok) {
      alert('회원 탈퇴가 완료되었습니다.');
      window.location.href = '/'; // ✅ 메인 페이지로 리디렉션
    } else {
      const data = await response.json();
      alert(`탈퇴 실패: ${data.error}`);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="w-[400px] max-w-lg bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // 클릭시 모달이 닫히지 않도록 방지
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">회원 탈퇴</h2>

        <p className="text-gray-600 mb-6">
          회원 탈퇴를 진행하면 계정과 관련된 모든 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>

        <button
          className="w-full mb-4 py-2 px-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? '탈퇴 중...' : '회원 탈퇴'}
        </button>

        <button
          className="w-full py-2 px-4 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none"
          onClick={onClose}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default SettingModal;
