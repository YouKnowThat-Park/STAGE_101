'use client';

import { useState } from 'react';
import Link from 'next/link';
import HomeQna from './home/HomeQna';
import HomeReviews from './home/HomeReviews';
import ReviewPage from './reviews/page';

export default function Home() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="min-h-screen  flex flex-col items-center py-10 mb-[50px]">
      {/* 전체 중앙 정렬 */}
      <div className="w-full max-w-[1100px] h-[400px] bg-white shadow-md rounded-lg p-6">
        <p>Welcome to Home!</p>
      </div>
      <div className="flex justify-center gap-10 mt-20 w-full max-w-[1100px]">
        {/* 리뷰 전체보기 */}

        <div className="h-[500px] w-[400px]  shadow-md rounded-lg flex flex-col items-center">
          <div className="w-full flex">
            {/* ✅ "리뷰 전체 보기" 클릭 시 모달 열기 */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="text-sm border-b border-black inline-block w-full h-full"
            >
              <div className="pointer-events-none">
                <HomeReviews />
              </div>
            </button>
          </div>
        </div>

        {/* QnA 섹션 */}
        <div className="h-[100px] w-[400px] bg-white shadow-md rounded-lg flex-1 flex flex-col justify-center items-center">
          <Link href={'/notion'}>
            <h2 className="w-full text-center mt-3">기능적 문제 히스토리</h2>
          </Link>
        </div>
      </div>

      {/* ✅ 리뷰 모달 */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white w-[600px] max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg">
            <ReviewPage closeModal={() => setIsReviewModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
