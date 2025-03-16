'use client';
import BronzeCrownIcon from '@/ui/icon/BronzeCrownIcon';
import ReviewAddModal from './_components/ReviewAddModal';
import Image from 'next/image';
import { ReviewsType } from '@/types/review.type';
import { useAllReviews } from '@/hooks/useAllRevuews';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';

const ReviewPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { id } = useUserStore(); // userStore에서 로그인한 사용자 ID를 가져옵니다
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [reviews, setReviews] = useState<ReviewsType[]>([]);
  const [userReviewCount, setUserReviewCount] = useState<number>(0);
  const params = useParams();
  const theaterId = Array.isArray(params.theaterId)
    ? params.theaterId[0]
    : (params.theaterId ?? undefined); // null을 undefined로 처리

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews/count-review?userId=${id}`);
    const data = await res.json();

    // 콘솔 찍어보기
    console.log('API Response:', data); // 서버 응답 확인
    if (res.ok) {
      setReviews(data.reviews); // 리뷰 데이터를 상태에 저장
    } else {
      console.error('Failed to fetch reviews:', data.error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // ✅ 전체 리뷰 데이터 가져오기 (정렬 옵션 반영)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAllReviews({
    sort: 'created_at',
    order: sortOption === 'newest' ? 'desc' : 'asc', // 최신순 or 오래된순 적용
    theaterId: theaterId || '',
  });

  const handleSortChange = (option: 'newest' | 'oldest') => {
    if (sortOption === option) return; // 같은 옵션이면 변경 X
    setSortOption(option);
    queryClient.invalidateQueries({ queryKey: ['reviews'] }); // ✅ 정렬 변경 시 데이터 강제 업데이트
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
        {data?.pages
          .flatMap((page) => page.reviews)
          .map((review: ReviewsType, index: number) => {
            const reviewImgUrl = review.image_url || '/next.svg';
            const isRestricted = !id && index >= 5;

            return (
              <div
                key={review.id}
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
                        height={100}
                        className="w-[100px] h-[100px] object-cover border border-black rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs">
                    <p>✅ {new Date(review.created_at).toISOString().split('T')[0]}</p>
                    <p>✅ {review.users?.nickname}</p>
                    <span className="flex items-center gap-1 mt-[-3px]">
                      <BronzeCrownIcon
                        color={
                          review.userReviewCount && review.userReviewCount >= 10
                            ? '#facc15'
                            : 'currentColor'
                        }
                      />
                      {review.userReviewCount ?? 0}회 사용자 리뷰
                    </span>
                    <span className="mt-[-3px]">
                      <BronzeCrownIcon
                        color={review.past_views >= 10 ? '#facc15' : 'currentColor'}
                      />
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
          onClick={() => fetchNextPage()} // 더 보기 버튼
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
