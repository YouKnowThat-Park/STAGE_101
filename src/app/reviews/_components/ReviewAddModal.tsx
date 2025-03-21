import { useUserStore } from '@/store/userStore';
import { ReviewModalProps } from '@/types/modal/modal-type';
import React, { useEffect, useState } from 'react';

const ReviewAddModal = ({ isOpen, onClose, onSubmit }: ReviewModalProps) => {
  const userId = useUserStore((state) => state.id);

  // ✅ 상태값 선언 (기본값 설정)
  const [comment, setComment] = useState('');
  const [imageType, setImageType] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<'name' | 'nickname'>('nickname');
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [watchedTheaters, setWatchedTheaters] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchAvailableTheaters = async () => {
      console.log('📢 [DEBUG] API 요청 시작'); // ✅ API 호출 시작 로그

      try {
        const response = await fetch(`/api/reviews/watched-theaters?userId=${userId}`);
        console.log('📢 [DEBUG] API 응답 상태:', response.status); // ✅ 응답 상태 확인

        const data = await response.json();
        console.log('📢 [DEBUG] API 응답 데이터:', data); // ✅ 응답 데이터 확인

        if (!response.ok) throw new Error(data.error || '데이터를 불러오지 못했습니다.');
        setWatchedTheaters(data.theaters || []);
      } catch (error) {
        console.error('❌ [ERROR] 극장 목록 불러오기 실패:', error);
      }
    };

    fetchAvailableTheaters();
  }, [isOpen, userId]);

  const handleSubmit = async () => {
    if (!selectedTheater) {
      alert('극장을 선택해주세요.');
      return;
    }

    if (!comment.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/reviews/add-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment,
          display_name: displayName,
          useRealName: displayName === 'name',
          type: imageType,
          theater_id: selectedTheater,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '리뷰 저장 실패');

      onSubmit();
      onClose();
    } catch (error) {
      console.error('❌ [ERROR] 리뷰 저장 실패:', error);
      alert('리뷰 작성 중 오류가 발생했습니다.');
    }
  };

  return !isOpen ? null : (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-6 rounded shadow-lg w-[600px] h-[550px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-4">리뷰 작성</h2>

        {/* 극장 선택 드롭다운 */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">극장 선택</label>
          <select
            value={selectedTheater || ''}
            onChange={(e) => setSelectedTheater(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">리뷰를 작성할 극장을 선택하세요</option>
            {watchedTheaters.length > 0 ? (
              watchedTheaters.map((theater, index) => (
                <option key={`${theater.id}-${index}`} value={theater.id}>
                  {theater.name}
                </option>
              ))
            ) : (
              <option disabled>관람한 극장이 없습니다.</option>
            )}
          </select>
        </div>

        {/* 내용 입력 */}
        <div className="flex flex-col mb-4">
          <label className="mb-1 font-medium text-gray-700">내용</label>
          <textarea
            placeholder="최대 80자까지만 입력 가능합니다."
            className="border border-gray-300 rounded-md p-2 h-36 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={100}
          />
          <p className="text-right text-gray-500 text-sm mt-1">{comment.length}/100</p>
        </div>

        {/* 실명 / 닉네임 선택 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="displayName"
              checked={displayName === 'name'}
              onChange={() => setDisplayName('name')}
            />
            <span>실명</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="displayName"
              checked={displayName === 'nickname'}
              onChange={() => setDisplayName('nickname')}
            />
            <span>닉네임</span>
          </label>
        </div>

        {/* 포스터 / 프로필 사진 선택 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={imageType === 'poster'}
              onChange={() => setImageType(imageType === 'poster' ? null : 'poster')}
            />
            <span>포스터 사진</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={imageType === 'profile'}
              onChange={() => setImageType(imageType === 'profile' ? null : 'profile')}
            />
            <span>프로필 사진</span>
          </label>
        </div>

        {/* 작성 버튼 */}
        <div className="flex justify-end mt-auto">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            작성 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAddModal;
