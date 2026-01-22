import { useUserStore } from '../../../store/userStore';
import { ReviewModalProps } from '../../../types/modal/modal-type';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTicketHistory } from 'src/hooks/reservation/useTicketHistory';
import { useCreateReview } from 'src/hooks/review/useCreateReview';
import { ReviewImageType } from 'src/types/review/review-type';
import { ReservationType } from 'src/types/reservation/reservation-type';
import { getValidImageUrl } from 'src/app/shop/_components/getValidImageUrl';

const ReviewAddModal = ({ isOpen, onClose, onSubmit }: ReviewModalProps) => {
  const { id: userId, nickname, profile_img } = useUserStore();

  const [comment, setComment] = useState('');
  const [imageType, setImageType] = useState<ReviewImageType | null>(null);
  const [displayName, setDisplayName] = useState<'nickname'>('nickname');
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);

  // 미리보기 데이터 (실시간 업데이트)
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

  const { data: watchedTheaters = [] } = useTicketHistory(userId);
  const createReviewMutation = useCreateReview();

  //  입력 값이 변경될 때마다 미리보기 업데이트
  useEffect(() => {
    if (!selectedTheater) return;

    const ticketForTheater = watchedTheaters.filter((t) => t.theater_id === selectedTheater);

    if (ticketForTheater.length === 0) {
      setPreviewReview((prev) => ({
        ...prev,
        theater: '극장 선택 안됨',
        pastViews: 0,
      }));
      return;
    }

    const ticket = ticketForTheater[0];

    const pastViews = ticketForTheater.length;

    const validPoster = ticket.main_img ? getValidImageUrl(ticket.main_img) : '/default.png';
    const validProfile = profile_img ? getValidImageUrl(profile_img) : '/default.png';

    setPreviewReview({
      theater: ticket.theater_name || '극장 선택 안됨',
      comment,
      image: imageType === 'poster' ? validPoster : '',
      profileImg: imageType === 'profile' ? profile_img || '/default.png' : '/default.png',
      date: new Date().toISOString().split('T')[0],
      // TODO: name 필드를 userStore에 추가해두면 여기서 진짜 이름 쓸 수 있음
      displayName: nickname,
      pastViews,
    });
  }, [
    selectedTheater,
    imageType,
    displayName,
    comment,
    userId,
    watchedTheaters,
    nickname,
    profile_img,
  ]);

  const handleSubmit = async () => {
    if (!selectedTheater) {
      alert('극장을 선택해주세요.');
      return;
    }

    if (!comment.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (!imageType) {
      alert('이미지 타입을 선택해주세요.');
      return;
    }

    createReviewMutation.mutate(
      {
        comment,
        type: imageType,
        theaterId: selectedTheater,
      },
      {
        onSuccess: () => {
          onSubmit();
          onClose();
        },
        onError: (error) => {
          console.error('❌ [ERROR] 리뷰 저장 실패:', error);
          alert('리뷰 작성 중 오류가 발생했습니다.');
        },
      },
    );
  };

  return !isOpen ? null : (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
        relative
        w-[600px]
        h-[90vh]
        flex flex-col
        rounded-2xl
        bg-[#121212]
        text-white
        shadow-[0_30px_90px_rgba(0,0,0,0.9)]
        ring-1 ring-white/10
      "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          className="absolute top-4 right-4 text-white/60 hover:text-white transition"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-xs tracking-[0.3em] text-white/40">STAGE101 • REVIEW</p>
          <h2 className="mt-1 text-xl font-semibold text-[#C9A66B]">관람 리뷰 작성</h2>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* 극장 선택 */}
          <div>
            <label className="block text-xs text-white/60 mb-1">공연 선택</label>
            <select
              value={selectedTheater || ''}
              onChange={(e) => setSelectedTheater(e.target.value)}
              className="
              w-full rounded-md
              bg-black/40
              border border-white/10
              px-3 py-2
              text-white
              focus:outline-none
              focus:border-[#C9A66B]
            "
            >
              <option value="">리뷰를 작성할 극장을 선택하세요</option>
              {watchedTheaters.length > 0 ? (
                watchedTheaters.map((ticket: ReservationType) => (
                  <option key={ticket.id} value={ticket.theater_id}>
                    {ticket.theater_name ?? '이름 없음'}
                  </option>
                ))
              ) : (
                <option disabled>관람한 극장이 없습니다.</option>
              )}
            </select>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-xs text-white/60 mb-1">리뷰 내용</label>
            <textarea
              placeholder="공연의 순간을 기록해 주세요 (최대 100자)"
              className="
              w-full h-32 resize-none
              rounded-md
              bg-black/40
              border border-white/10
              px-3 py-2
              text-white
              placeholder:text-white/30
              focus:outline-none
              focus:border-[#C9A66B]
            "
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={100}
            />
            <p className="mt-1 text-right text-xs text-white/40">{comment.length}/100</p>
          </div>

          {/* 닉네임 */}
          <div className="flex items-center gap-2 text-sm text-white/70">
            <input type="radio" checked readOnly className="accent-[#C9A66B]" />
            닉네임 표시
          </div>

          {/* 이미지 선택 */}
          <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={imageType === 'poster'}
                onChange={() => setImageType(imageType === 'poster' ? null : 'poster')}
                className="accent-[#C9A66B]"
              />
              포스터 이미지
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={imageType === 'profile'}
                onChange={() => setImageType(imageType === 'profile' ? null : 'profile')}
                className="accent-[#C9A66B]"
              />
              프로필 이미지
            </label>
          </div>

          {/* 미리보기 */}
          <div>
            <p className="text-xs text-white/40 mb-2">PREVIEW</p>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold border-b border-white/10 pb-1">
                    {previewReview.theater}
                  </h4>
                  <p className="mt-3 text-sm text-white/70">
                    {previewReview.comment || '리뷰 내용이 여기에 표시됩니다.'}
                  </p>
                </div>
                <div className="w-[100px]  rounded-lg overflow-hidden ring-1 ring-white/10">
                  <Image
                    src={previewReview.image || previewReview.profileImg || '/default.png'}
                    alt="preview"
                    width={100}
                    height={150}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="mt-3 flex gap-4 text-xs text-white/50">
                <span>{previewReview.date || '날짜'}</span>
                <span>{previewReview.displayName || '닉네임'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSubmit}
            className="
            rounded-xl
            bg-[#C9A66B]
            px-6 py-2
            text-black
            font-semibold
            shadow-[0_10px_30px_rgba(201,166,107,0.35)]
            hover:brightness-110
            transition
          "
          >
            리뷰 등록
          </button>
        </div>

        {/* 로그인 가드 */}
        {!userId && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold text-white mb-2">로그인이 필요합니다</h3>
            <p className="text-sm text-white/60">리뷰를 작성하려면 로그인 해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewAddModal;
