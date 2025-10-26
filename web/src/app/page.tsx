import Link from 'next/link';

import HomeImageSlider from './home/HomeImageSlider';
import HomeReviewsClient from './home/HomeReviewsClient';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 mb-[50px] px-4">
      {/* ✅ 슬라이드 이미지 반응형 */}
      <HomeImageSlider />

      <div className="flex flex-wrap justify-center gap-10 mt-20 w-full max-w-[1100px]">
        {/* 리뷰 랭킹 */}

        <HomeReviewsClient />

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
    </div>
  );
}
