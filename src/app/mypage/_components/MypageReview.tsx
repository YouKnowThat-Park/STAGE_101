import { useReviews } from '@/hooks/useReviews';
import { ReviewsType } from '@/types/review.type';
import LikeIcon from '@/ui/icon/LikeIcon';
import NoReviewIcon from '@/ui/icon/NoReviewIcon';
import React from 'react';

const MypageReview = () => {
  const { data: reviews } = useReviews();

  const formatDateToKST = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <section className="flex flex-col items-center bg-white h-[500px] gap-5">
      {reviews?.length > 0 ? (
        <div className="w-full max-w-lg p-5 rounded-lg shadow-md border bg-[#151515] border-black h-[480px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <h2 className="text-2xl font-bold text-white mb-4">My Reviews</h2>
          <ul className="space-y-4">
            {reviews.map((review: ReviewsType) => (
              <li key={review.id} className="border p-4 rounded-lg bg-white shadow">
                <div className="flex justify-between">
                  <p>{review.theaters?.name}</p>
                  <p className="text-sm text-gray-600">{formatDateToKST(review.created_at)}</p>
                </div>
                <p className="text-base font-semibold">{review.comment}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <LikeIcon />
                  <span>{review.like_count}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <NoReviewIcon />
          <p>작성한 리뷰가 존재하지 않습니다.</p>
        </div>
      )}
    </section>
  );
};

export default MypageReview;
