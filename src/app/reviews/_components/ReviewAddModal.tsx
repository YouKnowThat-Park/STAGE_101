import { ModalProps } from '@/types/modal/modal-type';
import React from 'react';

const ReviewAddModal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    // todo :
    // 1. 배경화면에 만들어둔 티켓 이미지를 넣어서 티켓에 리뷰를 적을 수 있게 만듬.
    // 2. 제목은 입력 받는게 아니라 theater name 을 넣음 (내가 구매한 티켓 한에서 고를 수 있으면 좋으듯) 또는 작성자가 원하는 제목을 입력할 수 있게

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // 오버레이 클릭 시 onClose 호출
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-[600px] h-[450px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">리뷰 작성</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">제목</label>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">내용</label>
            <textarea
              placeholder="리뷰 내용을 입력하세요"
              className="border border-gray-300 rounded-md p-2 h-48 resize-none"
            />
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 ml-[445px]">
          작성 하기
        </button>
        <div className="flex justify-end mt-6"></div>
      </div>
    </div>
  );
};

export default ReviewAddModal;
