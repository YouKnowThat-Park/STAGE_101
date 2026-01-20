import Link from 'next/link';

import HomeReviewsClient from './home/HomeReviewsClient';
import { NowShowingSection } from './home/NowShowingSection';
import Image from 'next/image';
import FloorGuideSection from './home/FloorGuideSection';
import Stage101RooftopSection from './home/Stage101RooftopSection';
import NoticeSection from './home/NoticeSection';

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
      <section className="w-full bg-black mb-2">
        <div className={INNER}>
          <NoticeSection />
        </div>
      </section>
    </div>
  );
}
