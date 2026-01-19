import Link from 'next/link';

import HomeReviewsClient from './home/HomeReviewsClient';
import { NowShowingSection } from './home/NowShowingSection';
import Image from 'next/image';
import FloorGuideSection from './home/FloorGuideSection';
import Stage101RooftopSection from './home/Stage101RooftopSection';

const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-b from-[#000000] via-[#070607] via-[#0C0B0C] to-[#111111] min-h-screen py-10">
      {/* 섹션 1: 상영작 */}
      <section className="w-full ">
        <div className={INNER}>
          <NowShowingSection />
        </div>
      </section>

      {/* 섹션 2: 추천 */}
      <section className="w-full bg-white mt-16">
        <div className={INNER}>
          <FloorGuideSection />
          {/* <RecommendedShowings /> */}
        </div>
      </section>

      <Stage101RooftopSection />

      {/* 섹션 3: 리뷰 + 링크 */}
      <section className="w-full bg-black mt-20">
        <div className={INNER}>
          <div className="flex flex-wrap justify-center gap-10 w-full max-w-[1100px] mx-auto">
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
      </section>
    </div>
  );
}
