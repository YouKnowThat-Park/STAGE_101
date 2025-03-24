'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HomeReviews from './home/HomeReviews';
import ReviewPage from './reviews/page';

export default function Home() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = ['/main.jpg', '/main0.jpg', '/lesmiserables.jpg', '/main2.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 mb-[50px] px-4">
      {/* ✅ 슬라이드 이미지 반응형 */}
      <div className="w-full max-w-[1100px] h-[300px] sm:h-[400px] bg-white shadow-md rounded-lg p-1 overflow-hidden">
        <img
          src={images[currentSlide]}
          alt={`slide-${currentSlide}`}
          className="w-full h-full object-cover rounded-md transition-all duration-700"
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-10 mt-20 w-full max-w-[1100px]">
        {/* 리뷰 전체보기 */}
        <div className="h-[500px] w-full lg:w-[400px] shadow-md rounded-lg flex flex-col items-center">
          <div className="w-full flex">
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

        {/* QnA */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="h-[100px] w-full bg-white shadow-md rounded-lg flex flex-col justify-center items-center">
            <Link href="/notion">
              <h2 className="w-full text-center mt-3">기능적 문제 히스토리</h2>
            </Link>
          </div>
          <div className="h-[100px] w-full bg-white shadow-md rounded-lg flex flex-col justify-center items-center">
            <Link href="/notion">
              <h2 className="w-full text-center mt-3">트러블 슈팅</h2>
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ 리뷰 모달 */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg">
            <ReviewPage closeModal={() => setIsReviewModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
