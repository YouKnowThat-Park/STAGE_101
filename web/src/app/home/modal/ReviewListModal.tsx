'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useUserStore } from '../../../store/userStore';
import { useInfiniteReviews } from 'src/hooks/review/useInfiniteReviews';
import { ReviewsType } from 'src/types/review/review-type';
import Link from 'next/link';
import ReviewAddModal from './ReviewAddModal';
import { useRouter } from 'next/navigation';

const ReviewListModal = ({ onClose }: { onClose?: () => void }) => {
  const [isOpenReviewModal, setIsOpenReviewModal] = useState(true);
  const [isOpenWriteModal, setIsOpenWriteModal] = useState(false);
  const { id: userId } = useUserStore();
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [isNarrow, setIsNarrow] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 1200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteReviews(sortOption);

  useEffect(() => {
    if (isOpenReviewModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isOpenReviewModal]);

  const reviews = data?.pages.flatMap((page) => page.reviews ?? []) ?? [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* ✅ 리뷰 전체 모달 */}
      {isOpenReviewModal && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isOpenWriteModal && !isNarrow ? '-15%' : 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`
    relative
    ${isNarrow ? 'w-full h-full' : 'w-[520px] h-[88vh]'}
    rounded-2xl
    bg-black/85
    backdrop-blur-xl
    border border-white/10
    shadow-[0_30px_90px_rgba(0,0,0,0.9)]
    flex flex-col
  `}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <p className="text-xs tracking-[0.25em] text-white/50">STAGE101 • REVIEW</p>
              <h2 className="mt-1 text-lg font-semibold text-[#C9A66B]">관람 후기</h2>
            </div>
            <button
              onClick={() => {
                setIsOpenReviewModal(false);
                onClose && onClose();
              }}
              className="text-white/50 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* 정렬 / 액션 */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex gap-4 text-sm">
              <button
                onClick={() => setSortOption('newest')}
                className={
                  sortOption === 'newest'
                    ? 'text-[#C9A66B] font-semibold'
                    : 'text-white/60 hover:text-white'
                }
              >
                최신 순
              </button>
              <button
                onClick={() => setSortOption('oldest')}
                className={
                  sortOption === 'oldest'
                    ? 'text-[#C9A66B] font-semibold'
                    : 'text-white/60 hover:text-white'
                }
              >
                오래된 순
              </button>
            </div>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth < 750) {
                  router.push('/sign-in');
                  return;
                }

                setIsOpenWriteModal(true);
              }}
              className="
                rounded-xl
                bg-[#C9A66B]
                px-4 py-2
                text-sm font-semibold text-black
                hover:brightness-110
                transition
              "
            >
              리뷰 작성
            </button>
          </div>

          {/* 리뷰 리스트 */}
          <div className="px-6 pb-6 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {isLoading && (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="rounded-xl border border-white/10 bg-white/10 p-4 animate-pulse"
                  >
                    <div className="h-4 w-1/2 rounded bg-white/20 mb-3" />
                    <div className="h-3 w-full rounded bg-white/20 mb-2" />
                    <div className="h-3 w-2/3 rounded bg-white/20" />
                  </div>
                ))}
              </div>
            )}

            {reviews.filter(Boolean).map((review: ReviewsType, index: number) => {
              const reviewImgUrl = review?.image_url || '/next.svg';
              const isBlurred = !userId && index >= 5;

              return (
                <div
                  key={`${review.id}-${index}`}
                  className="relative bg-white border text-black border-black rounded-lg shadow-md p-4"
                >
                  <div className={isBlurred ? 'blur-sm' : ''}>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-black border-b border-black pb-1">
                          {review?.theater?.name || '공연 제목'}
                        </h4>
                        <p className="mt-3 text-sm text-gray-600 break-words">{review.comment}</p>
                      </div>
                      <Image
                        src={reviewImgUrl}
                        alt="리뷰 이미지"
                        width={100}
                        height={150}
                        className="w-[100px] h-[150px] rounded-lg border border-black object-cover"
                      />
                    </div>

                    <div className="mt-2 flex gap-4 text-xs">
                      <p>
                        ✅{' '}
                        {review.created_at
                          ? new Date(review.created_at).toISOString().split('T')[0]
                          : '날짜 없음'}
                      </p>
                      <p>✅ {review.display_name || '이름 없음'}</p>
                    </div>
                  </div>

                  {isBlurred && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
                      <p className="mb-2 text-sm font-semibold text-gray-700">
                        로그인 후 전체 내용을 확인할 수 있습니다
                      </p>
                      <Link
                        href="/sign-in"
                        className="rounded bg-black px-4 py-2 text-sm text-white"
                      >
                        로그인
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="
                mx-auto mt-4 block
                rounded-xl
                border border-white/20
                bg-white/5
                px-5 py-2
                text-sm text-white/80
                hover:bg-white/10
              "
              >
                {isFetchingNextPage ? '로딩 중...' : '더 보기'}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ✅ 리뷰 작성 모달 */}
      {isOpenWriteModal && (
        <motion.div
          initial={isNarrow ? { y: '100%' } : { x: '100%' }}
          animate={isNarrow ? { y: 0 } : { x: '15%' }}
          exit={isNarrow ? { y: '100%' } : { x: '100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`
          relative
          ${isNarrow ? 'w-full h-full' : 'w-[520px] h-[88vh]'}
          rounded-2xl
          bg-black/90
          backdrop-blur-xl
          border border-white/10
          shadow-[0_30px_90px_rgba(0,0,0,0.9)]
        `}
        >
          <button
            onClick={() => setIsOpenWriteModal(false)}
            className="absolute top-4 right-5 text-white/50 hover:text-white"
          >
            ✕
          </button>

          <ReviewAddModal
            isOpen={isOpenWriteModal}
            onClose={() => setIsOpenWriteModal(false)}
            watchedTheaters={[]}
            onSubmit={() => {
              setIsOpenWriteModal(false);
              queryClient.invalidateQueries({ queryKey: ['reviews'] });
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ReviewListModal;
