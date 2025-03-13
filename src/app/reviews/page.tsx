'use client';
import { useParams } from 'next/navigation';
import { useAllReviews } from '@/hooks/useAllRevuews';
import { ReviewsType } from '@/types/review.type';
import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import ReviewAddModal from './_components/ReviewAddModal';

const ReviewPage = () => {
  const [isOenModal, setIsOpenModal] = useState(false);
  const { id } = useUserStore();
  const params = useParams();
  // 동적 라우트로부터 theaterId 추출 (배열이면 첫 번째 값 사용)
  const theaterId = Array.isArray(params.theaterId) ? params.theaterId[0] : params.theaterId;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAllReviews({
    sort: 'created_at',
    order: 'desc',
    theaterId: theaterId || '',
  });

  // data.pages를 평탄화해서 모든 리뷰 배열로 만듭니다.
  const reviews = data?.pages.flatMap((page) => page.pages) ?? [];

  return (
    <div className=" w-[600px] mx-auto text-black flex flex-col justify-center items-center">
      <div className="mb-4 p-5 bg-white">
        <button onClick={() => setIsOpenModal(true)}>리뷰 작성</button>
      </div>
      {/* 리뷰 데이터 렌더링 */}
      <div className="reviews ">
        {reviews.map((review: ReviewsType, index: number) => {
          // index가 5 이상이고 로그인하지 않은 경우 전체 블록에 블러 및 오버레이 적용
          const isRestricted = !id && index >= 5;
          return (
            <div key={index} className="bg-white p-4 border-b w-full h-[150px] mb-4 relative">
              <div className={isRestricted ? 'filter blur-sm' : ''}>
                <h4 className="font-bold">{review.theaters?.name}</h4>
                <p>{review.comment}</p>
              </div>
              {isRestricted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-40">
                  <span className="mb-2 text-lg font-semibold text-gray-700">
                    로그인을 하시면 전체 내용을 확인하실 수 있습니다.
                  </span>
                  <button className="px-4 py-2 border rounded bg-blue-500 text-white ">
                    로그인
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 무한 스크롤 "더 보기" 버튼 */}
      {hasNextPage && id && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="bg-blue-500 text-white p-2 mb-2 rounded"
        >
          {isFetchingNextPage ? '로딩 중...' : '더 보기'}
        </button>
      )}
      {isOenModal && <ReviewAddModal isOpen={isOenModal} onClose={() => setIsOpenModal(false)} />}
    </div>
  );
};

export default ReviewPage;
