import { Dialog, DialogClose, DialogContent, DialogOverlay } from '@radix-ui/react-dialog';
import React from 'react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* ✅ 모달 배경을 화면 전체로 확장 & 어두운 배경 추가 */}
      <DialogOverlay className="fixed inset-0 bg-black/50" />

      {/* ✅ 모달 정렬: flex + items-center + justify-center 활용 */}
      <DialogContent className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-black">
          <h2 className="text-xl font-bold text-black">회원가입 완료</h2>
          <p className="mt-2 text-black">환영합니다! 🎉</p>

          <DialogClose asChild>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
              onClick={onClose}
            >
              로그인 하러 가기
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
