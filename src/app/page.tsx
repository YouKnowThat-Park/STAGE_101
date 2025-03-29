'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HomeReviews from './home/HomeReviews';
import ReviewPage from './reviews/ReviewPage';
import Image from 'next/image';

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
        <Image
          src={images[currentSlide]}
          alt={`slide-${currentSlide}`}
          height={300}
          width={800}
          className="w-full h-full object-cover rounded-md transition-all duration-700"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-10 mt-20 w-full max-w-[1100px]">
        {/* 리뷰 랭킹 */}
        <div className="min-w-[350px] flex-1 max-w-[400px] shadow-md rounded-lg flex flex-col items-center">
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

        {/* 히스토리 + 트러블슈팅 */}
        <div className="flex flex-col gap-4 flex-1 min-w-[350px]">
          {[
            { href: '/notion/feature-decisions', label: '기능 선택 이유' },
            { href: '/notion/feature-history', label: '기능적 문제 히스토리' },
            { href: '/notion/trouble-shooting', label: '트러블 슈팅' },
            { href: '/notion/retrospective', label: '회고' },
          ].map(({ href, label }) => (
            <Link key={label} href={href}>
              <div className="h-[86px] w-full bg-[#2A2A2A]/80 border border-[#444] rounded-md hover:bg-[#3A3A3A]/90 transition duration-200 flex items-center justify-center px-4">
                <p className="text-sm text-[#ddd] tracking-wide">{label}</p>
              </div>
            </Link>
          ))}
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
