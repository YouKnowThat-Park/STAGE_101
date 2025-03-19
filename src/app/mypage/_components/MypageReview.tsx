'use client';

import { useReviews } from '@/hooks/useReviews';
import { ReviewsType } from '@/types/review.type';
import Image from 'next/image';
import NoReviewIcon from '@/ui/icon/NoReviewIcon';
import { useUserStore } from '@/store/userStore';

const MypageReview = () => {
  const { data: reviews } = useReviews();
  const { profile_img } = useUserStore();

  console.log('🔍 리뷰 데이터 확인:', reviews);
  if (reviews) {
    reviews.forEach((review: any, index: number) => {
      console.log(`📝 리뷰 ${index + 1}:`, review);
      console.log('👉 저장된 display_name:', review.display_name); // ✅ 저장된 display_name 확인
    });
  }

  const formatDateToKST = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <section className="flex flex-col items-center bg-white h-[500px] gap-5">
      <div className="w-full max-w-lg p-5 rounded-lg shadow-md border bg-[#151515] border-black h-[480px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <h2 className="text-2xl font-bold text-white mb-4">내 리뷰</h2>

        {reviews?.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review: ReviewsType) => {
              const theaterName = review.theaters?.name || '공연 제목';
              const reviewImgUrl = review.image_url || '/default-image.jpg';
              const displayName = review.display_name || '익명'; // ✅ 저장된 display_name 사용
              const userProfileImg = profile_img || '/default-profile.png';

              return (
                <li
                  key={review.id}
                  className="p-4 border border-black rounded-lg bg-white shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* 리뷰 정보 */}
                    <div className="flex-1">
                      <h4 className="text-lg font-black border-b border-black pb-1">
                        {theaterName}
                      </h4>
                      <p className="text-xs mt-3 text-gray-600 break-words">{review.comment}</p>
                    </div>

                    {/* 리뷰 이미지 */}
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

                  {/* 날짜 및 사용자 정보 */}
                  <div className="flex gap-4 text-xs text-gray-700 mt-2">
                    <p>✅ {formatDateToKST(review.created_at)}</p>
                    <p>✅ {displayName}</p> {/* ✅ display_name 사용 */}
                    <span className="text-xs">{review.past_views ?? 0}회 감상</span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center text-white">
            <NoReviewIcon />
            <p className="mt-2">작성한 리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MypageReview;
