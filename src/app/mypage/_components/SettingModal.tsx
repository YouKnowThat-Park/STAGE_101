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
      <div className="w-[500px] h-[500px] bg-white">
        <button onClick={onClose}>
          <DeleteIcon />
        </button>

        <button>비밀번호 변경</button>
        <button onClick={handleDeleteAccount}>회원 탈퇴</button>
      </div>
    </div>
  );
};

export default SettingModal;
