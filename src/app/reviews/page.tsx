'use client';
import BronzeCrownIcon from '@/ui/icon/BronzeCrownIcon';
import ReviewAddModal from './_components/ReviewAddModal';
import Image from 'next/image';
import { ReviewsType } from '@/types/review.type';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';

const ReviewPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { id } = useUserStore(); // userStore에서 로그인한 사용자 ID를 가져옵니다
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [reviews, setReviews] = useState<ReviewsType[]>([]);
  const [userReviewCount, setUserReviewCount] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);

  // API에서 리뷰 데이터를 받아오는 함수
  const fetchReviews = async (page: number) => {
    if (!id) {
      console.error('User ID is missing');
      return;
    }

    setIsFetchingNextPage(true);

    try {
      const res = await fetch(
        `/api/reviews/count-review?userId=${id}&page=${page}&sort=${sortOption}`,
      );
      const data = await res.json();

      if (res.ok) {
        // 데이터를 정렬하는 로직 추가
        const sortedReviews =
          sortOption === 'newest'
            ? data.reviews.sort(
                (a: ReviewsType, b: ReviewsType) =>
                  new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
              )
            : data.reviews.sort(
                (a: ReviewsType, b: ReviewsType) =>
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
              );

        setReviews((prevReviews) => [...prevReviews, ...sortedReviews]);
        setUserReviewCount(data.reviewCount); // 사용자 리뷰 수를 상태에 저장
        setHasNextPage(data.reviews.length > 0); // 만약 데이터가 더 있으면 `hasNextPage`를 true로 설정
      } else {
        console.error('Failed to fetch reviews:', data.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered. ID:', id);

    // `id` 값이 있을 때만 `fetchReviews` 함수 호출
    if (id) {
      fetchReviews(1); // 초기 페이지 1부터 시작
    } else {
      console.log('로그인된 사용자가 없습니다.');
    }
  }, [id, sortOption]); // `sortOption`이 변경될 때마다 데이터를 새로 가져오기

  const handleSortChange = (option: 'newest' | 'oldest') => {
    if (sortOption === option) return; // 같은 옵션이면 변경 X
    setSortOption(option);
    setReviews([]); // 새로운 정렬 기준에 맞게 리뷰 목록 초기화
    fetchReviews(1); // 첫 페이지부터 다시 데이터를 가져옴
  };

  const handleLoadMore = () => {
    if (isFetchingNextPage || !hasNextPage) return;
    const nextPage = Math.ceil(reviews.length / 10) + 1; // 페이지네이션: 10개 리뷰씩 로드
    fetchReviews(nextPage);
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
