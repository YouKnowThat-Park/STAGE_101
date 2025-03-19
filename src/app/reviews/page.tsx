'use client';

import { useState } from 'react';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import BronzeCrownIcon from '@/ui/icon/BronzeCrownIcon';
import Image from 'next/image';
import { ReviewsType } from '@/types/review.type';
import { useUserStore } from '@/store/userStore';
import fetchAllReviews, { FetchAllReviewsResponse } from '@/lib/fetchAllReviews';
import ReviewAddModal from './_components/ReviewAddModal';

const ReviewPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { id } = useUserStore(); // userStore에서 로그인한 사용자 ID를 가져옵니다
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest'); // 'newest' 또는 'oldest'

  // useInfiniteQuery로 무한 스크롤
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    FetchAllReviewsResponse,
    Error
  >({
    queryKey: ['reviews', { sort: sortOption, userId: id }],
    queryFn: async ({ pageParam = 1 }) => {
      if (!id) return { reviews: [], totalCount: 0, nextPage: undefined };

      const response = await fetchAllReviews({
        pageParam: pageParam as number,
        sort: sortOption, // 'newest' 또는 'oldest' 그대로 전달
        order: sortOption === 'newest' ? 'desc' : 'asc', // 정렬에 맞춰 'desc' 또는 'asc' 설정
        userId: id, // 사용자 ID 전달
      });

      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage.totalCount;
      const currentCount = allPages.flatMap((page) => page.reviews).length;
      return currentCount < totalCount ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1, // 첫 페이지는 1부터 시작
  });

  const reviews = data?.pages.flatMap((page) => page.reviews) || []; // 리뷰 목록

  console.log(reviews);

  const handleSortChange = (option: 'newest' | 'oldest') => {
    if (sortOption === option) return; // 같은 옵션이면 변경하지 않음
    setSortOption(option); // 옵션 변경
  };

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage) return; // 더 이상 데이터가 없거나 로딩 중이면 실행 안 함
    fetchNextPage();
  };

  return (
    <div className="w-[500px] mx-auto text-black flex flex-col justify-center items-center">
      <div className="mb-4 p-5 bg-white flex justify-between gap-5">
        <button onClick={() => handleSortChange('newest')}>최신 순</button>
        <button onClick={() => handleSortChange('oldest')}>오래된 순</button>

        <button
          onClick={() => setIsOpenModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          리뷰 작성
        </button>
      </div>

      {/* 리뷰 데이터 렌더링 */}
      <div className="reviews w-full space-y-4">
        {reviews.map((review: ReviewsType, index: number) => {
          const reviewImgUrl = review.image_url || '/next.svg';
          const isRestricted = !id && index >= 5;

          return (
            <div
              key={`${review.id}-${index}`}
              className="relative bg-white border border-black rounded-lg shadow-md p-4 flex flex-col gap-3"
            >
              <div className={isRestricted ? 'blur-sm' : ''}>
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

                <div className="flex gap-4 text-xs">
                  <p>✅ {new Date(review.created_at).toISOString().split('T')[0]}</p>
                  <p>✅ {review.display_name || '이름 없음'}</p>

                  <span className="mt-[-3px]">
                    <BronzeCrownIcon color={review.past_views >= 10 ? '#facc15' : 'currentColor'} />
                    {review.past_views ?? 0}회 감상
                  </span>
                </div>
              </div>

              {isRestricted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50">
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
          onClick={handleLoadMore} // 더 보기 버튼
          disabled={isFetchingNextPage}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        >
          {isFetchingNextPage ? '로딩 중...' : '더 보기'}
        </button>
      )}

      {isOpenModal && (
        <ReviewAddModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          watchedTheaters={[]}
          onSubmit={() => {
            setIsOpenModal(false);
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
          }}
        />
      )}
    </div>
  );
};

export default ReviewPage;
