'use client';

import { ReviewsType } from '../../../types/review.type';
import Image from 'next/image';
import NoReviewIcon from '../../../ui/icon/NoReviewIcon';
import { useUserStore } from '../../../store/userStore';
import { useMyReviews } from 'src/hooks/review/useMyReviews';

const MypageReview = () => {
  const { data: reviews } = useMyReviews();
  const { profile_img } = useUserStore();

  const formatDateToKST = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <section className="flex flex-col items-center bg-white h-[500px] gap-5">
      <div className="w-full max-w-lg bg-white h-[480px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {!reviews ? (
          // ✅ Skeleton UI
          <ul className="space-y-4 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={`skeleton-${i}`}
                className="p-4 border border-gray-300 rounded-lg bg-white shadow-md animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/3 bg-gray-300 rounded" />
                    <div className="h-3 w-full bg-gray-300 rounded" />
                    <div className="h-3 w-2/3 bg-gray-300 rounded" />
                  </div>
                  <div className="w-[100px] h-[100px] bg-gray-300 rounded-lg flex-shrink-0" />
                </div>
                <div className="flex gap-4 text-xs text-gray-700 mt-3">
                  <div className="h-3 w-20 bg-gray-300 rounded" />
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                </div>
              </li>
            ))}
          </ul>
        ) : reviews.length > 0 ? (
          // ✅ 리뷰 목록
          <ul className="space-y-4 p-5">
            {reviews.map((review: ReviewsType) => {
              const theaterName = review.theaters?.name || '공연 제목';
              const reviewImgUrl = review.image_url || '/default.jpg';
              const displayName = review.display_name || '익명';
              const userProfileImg = profile_img || '/default.png';

              return (
                <li
                  key={review.id}
                  className="p-4 border border-black rounded-lg bg-white shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-black border-b border-black pb-1">
                        {theaterName}
                      </h4>
                      <p className="text-xs mt-3 text-gray-600 break-words">{review.comment}</p>
                    </div>

                    {review.image_url && (
                      <div className="flex-shrink-0">
                        <Image
                          src={reviewImgUrl}
                          alt="리뷰 이미지"
                          width={100}
                          height={100}
                          className="w-[100px] h-[100px] object-cover border border-black rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 text-xs text-gray-700 mt-2">
                    <p>✅ {formatDateToKST(review.created_at)}</p>
                    <p>✅ {displayName}</p>
                    <span className="text-xs">{review.past_views ?? 0}회 감상</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          // ✅ 리뷰 없음
          <div className="flex flex-col items-center text-gray-600 mt-8 ">
            <NoReviewIcon />
            <p>No reviews written.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MypageReview;
