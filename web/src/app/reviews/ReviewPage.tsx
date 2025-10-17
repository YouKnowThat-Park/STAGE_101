'use client';

import { useEffect, useState } from 'react';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import BronzeCrownIcon from '../../ui/icon/BronzeCrownIcon';
import Image from 'next/image';
import { ReviewsType } from '../../types/review.type';
import { useUserStore } from '../../store/userStore';
import fetchAllReviews, { FetchAllReviewsResponse } from '../../lib/fetchAllReviews';
import ReviewAddModal from './_components/ReviewAddModal';

const ReviewPage = ({ closeModal }: { closeModal?: () => void }) => {
  const [isOpenReviewModal, setIsOpenReviewModal] = useState(true);
  const [isOpenWriteModal, setIsOpenWriteModal] = useState(false);
  const { id: userId } = useUserStore();
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [isNarrow, setIsNarrow] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 1200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    FetchAllReviewsResponse,
    Error
  >({
    queryKey: ['reviews', { sort: sortOption }],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchAllReviews({
        pageParam: pageParam as number,
        sort: sortOption,
        order: sortOption === 'newest' ? 'desc' : 'asc',
        userId: userId || undefined,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage.totalCount;
      const currentCount = allPages.flatMap((page) => page.reviews).length;
      return currentCount < totalCount ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });

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

  const reviews = data?.pages.flatMap((page) => page.reviews) || [];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      {/* ✅ 리뷰 전체 모달 */}
      {isOpenReviewModal && (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isOpenWriteModal && !isNarrow ? '-15%' : 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`bg-white ${
            isNarrow ? 'w-full h-full' : 'w-[500px] h-[90vh]'
          } overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden shadow-lg p-6 relative rounded-lg`}
        >
          <button
            onClick={() => {
              setIsOpenReviewModal(false);
              closeModal && closeModal();
            }}
            className="absolute top-2 right-4 text-gray-600 hover:text-black"
          >
            ✕
          </button>

          <div className="text-black flex flex-col justify-center items-center relative">
            <div className="mb-4 p-5 flex justify-between gap-5 w-full">
              <button onClick={() => setSortOption('newest')}>최신 순</button>
              <button onClick={() => setSortOption('oldest')}>오래된 순</button>
              <button
                onClick={() => setIsOpenWriteModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                리뷰 작성
              </button>
            </div>

            <div className="reviews w-full space-y-4">
              {isLoading && (
                <div className="space-y-4 w-full">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex gap-4 animate-pulse"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-300 rounded w-full" />
                        <div className="h-4 bg-gray-300 rounded w-2/3" />
                      </div>
                      <div className="w-[100px] h-[150px] bg-gray-300 rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
              {reviews.map((review: ReviewsType, index: number) => {
                const reviewImgUrl = review.image_url || '/next.svg';
                const isBlurred = !userId && index >= 5;

                return (
                  <div
                    key={`${review.id}-${index}`}
                    className="relative bg-white border border-black rounded-lg shadow-md p-4 flex flex-col gap-3"
                  >
                    <div className={isBlurred ? 'blur-sm' : ''}>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-black border-b border-black pb-1">
                            {review.theaters?.name || '공연 제목'}
                          </h4>
                          <p className="text-sm mt-3 text-gray-600 break-words">{review.comment}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Image
                            src={reviewImgUrl}
                            alt="리뷰 이미지"
                            width={100}
                            height={150}
                            className="w-[100px] h-[150px] object-cover border border-black rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 text-xs mt-2">
                        <p>✅ {new Date(review.created_at).toISOString().split('T')[0]}</p>
                        <p>✅ {review.display_name || '이름 없음'}</p>
                      </div>
                    </div>

                    {isBlurred && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80">
                        <span className="mb-2 text-lg font-semibold text-gray-700">
                          로그인을 하시면 전체 내용을 확인하실 수 있습니다.
                        </span>
                        <button className="px-4 py-2 border rounded bg-blue-500 text-white">
                          로그인
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
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
          className={`bg-white ${
            isNarrow ? 'w-full h-full absolute inset-0 z-50' : 'w-[500px] h-[90vh]'
          } overflow-hidden overflow-y-auto shadow-lg p-6 rounded-lg`}
        >
          <button
            onClick={() => setIsOpenWriteModal(false)}
            className="absolute top-2 right-4 text-gray-600 hover:text-black z-50"
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

export default ReviewPage;
