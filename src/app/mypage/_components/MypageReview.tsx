import { useReviews } from '@/hooks/useReviews';
import LikeIcon from '@/ui/icon/LikeIcon';
import NoReviewIcon from '@/ui/icon/NoReviewIcon';
import React from 'react';

const MypageReview = () => {
  const { data: reviews } = useReviews();

  const formatDateToKST = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
  return (
    <section className="p-4">
      <ul>
        {reviews?.length > 0 ? (
          reviews.map((review: any) => (
            <li key={review.id} className="border-b-2 border-b-black">
              <p>{formatDateToKST(review.created_at)}</p>
              <p>{review.comment}</p>
              <LikeIcon />
            </li>
          ))
        ) : (
          <div className="bg-white flex flex-col justify-center items-center gap-3 py-5">
            <NoReviewIcon />
            <p>작성한 리뷰가 존재하지 않습니다.</p>
          </div>
        )}
      </ul>
    </section>
  );
};

export default MypageReview;
