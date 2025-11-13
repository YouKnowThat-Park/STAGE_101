import { useUserStore } from '../../../store/userStore';
import { ReviewModalProps } from '../../../types/modal/modal-type';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BronzeCrownIcon from '../../../ui/icon/BronzeCrownIcon';

interface WatchedTheaterType {
  id: string;
  user_id: string;
  theater_id: string;
  viewed_at: string;
  theaters: {
    id: string;
    name: string;
    main_img: string;
  };
  users: {
    profile_img: string;
  };
}

const ReviewAddModal = ({ isOpen, onClose, onSubmit }: ReviewModalProps) => {
  const userId = useUserStore((state) => state.id);

  // ✅ 상태값 선언 (기본값 설정)
  const [comment, setComment] = useState('');
  const [imageType, setImageType] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<'name' | 'nickname'>('nickname');
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [watchedTheaters, setWatchedTheaters] = useState<WatchedTheaterType[]>([]);

  // ✅ 미리보기 데이터 (실시간 업데이트)
  const [previewReview, setPreviewReview] = useState<{
    theater: string;
    comment: string;
    image?: string;
    profileImg?: string;
    date: string;
    displayName: string;
    pastViews?: number;
  }>({
    theater: '극장 선택 안됨',
    comment: '',
    image: '',
    profileImg: '',
    date: '',
    displayName: '',
    pastViews: 0,
  });

  useEffect(() => {
    const fetchAvailableTheaters = async () => {
      if (!userId) return; // 🚫 유저 ID 없으면 요청하지 않음

      try {
        const response = await fetch(`/api/reviews/watched-theaters?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || '데이터를 불러오지 못했습니다.');
        setWatchedTheaters(data.theaters || []);
      } catch (error) {
        console.error('❌ [ERROR] 극장 목록 불러오기 실패:', error);
      }
    };

    fetchAvailableTheaters();
  }, [isOpen, userId]);

  // ✅ 입력 값이 변경될 때마다 미리보기 업데이트
  useEffect(() => {
    if (!selectedTheater) return;

    const fetchUserAndTheaterInfo = async () => {
      try {
        const res = await fetch(
          `/api/reviews/user-theater-info?userId=${userId}&theaterId=${selectedTheater}`,
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || '정보를 불러올 수 없습니다.');

        setPreviewReview({
          theater: data.theater_name || '극장 선택 안됨',
          comment,
          image: imageType === 'poster' ? data.theater_main_img : '/default.png',
          profileImg: imageType === 'profile' ? data.profile_img : '/default.png',
          date: new Date().toISOString().split('T')[0],
          displayName: displayName === 'name' ? data.name : data.nickname,
          pastViews: data.past_views || 0,
        });
      } catch (error) {
        console.error('❌ [ERROR] 사용자 및 극장 정보 불러오기 실패:', error);
      }
    };

    fetchUserAndTheaterInfo();
  }, [selectedTheater, imageType, displayName, comment, userId]);

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
        className="relative bg-white p-6 rounded shadow-lg w-[600px] h-[90vh] flex flex-col "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">리뷰 작성</h2>

        {/* 극장 선택 드롭다운 */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700">극장 선택</label>
          <select
            value={selectedTheater || ''}
            onChange={(e) => {
              setSelectedTheater(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-md p-2 text-black"
          >
            <option value="">리뷰를 작성할 극장을 선택하세요</option>
            {watchedTheaters.length > 0 ? (
              watchedTheaters.map((theater, index) => (
                <option key={theater.id} value={theater.theaters.id}>
                  {theater.theaters?.name ?? '이름 없음'}
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
            placeholder="최대 100자까지만 입력 가능합니다."
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

        {/* ✅ 미리보기 추가 */}
        <h2 className="mt-4">[미리 보기]</h2>
        <div className="relative bg-white border border-black rounded-lg shadow-md p-4 flex flex-col gap-3 mt-3">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="text-lg font-black border-b border-black pb-1">
                {previewReview.theater}
              </h4>
              <p className="text-sm mt-3 text-gray-600 break-words">{previewReview.comment}</p>
            </div>
            <div className="flex-shrink-0">
              <Image
                src={previewReview.image || previewReview.profileImg || '/default.png'}
                alt="프로필 이미지가 없습니다."
                width={100}
                height={150}
                className="w-[100px] h-[150px] object-cover border border-black rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-4 text-xs">
            <p>✅ {previewReview.date || '날짜'}</p>
            <p>✅ {previewReview.displayName || '실명/닉네임'}</p>
          </div>
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
        {!userId && (
          <div className="absolute inset-0 z-50 backdrop-blur-sm bg-white/50 flex flex-col items-center justify-center text-center text-gray-700 px-4 pointer-events-auto">
            <h3 className="text-xl font-bold mb-2">로그인이 필요합니다</h3>
            <p className="text-sm">리뷰를 작성하려면 로그인 해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAddModal;
