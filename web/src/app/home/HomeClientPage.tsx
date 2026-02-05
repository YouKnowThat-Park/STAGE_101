'use client';

import { useEffect, useMemo, useState } from 'react';
import FloorGuideSection from './sections/FloorGuideSection';
import NoticeSection from './sections/NoticeSection';
import ContentMenu from './sections/ContentMenu';
import ProgressBarSection from './sections/ProgressBarSection';
import Stage101RooftopSection from './sections/Stage101RooftopSection';
import NowShowingSection from './sections/NowShowingSection';

import ReviewListModal from './modal/ReviewListModal';
import GoodsGraphModal from './modal/GoodsGraphModal';
import ReviewRankingModal from './modal/ReviewRankingModal';
import TheaterPopularityModal from './modal/TheaterPopularityModal';
import { BannerImage } from 'src/types/common/common-type';
import { HomeClientPageProps } from 'src/types/theater/theater-type';

const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

const HomeClientPage = ({ initialData }: HomeClientPageProps) => {
  /* ===== 모달 상태 ===== */
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewRankingOpen, setIsReviewRankingOpen] = useState(false);
  const [isGoodsGraphOpen, setIsGoodsGraphOpen] = useState(false);
  const [isPopularityOpen, setIsPopularityOpen] = useState(false);

  /* ===== 이미지 변환 ===== */
  const images: BannerImage[] = useMemo(() => {
    return initialData.items.map((t) => ({
      id: String(t.id),
      src: t.main_img,
      alt: t.name,
      pos: 'center 30%',
      theaterKey: t.type,
    }));
  }, [initialData]);

  /* ===== 캐러셀 상태 ===== */
  const [order, setOrder] = useState<BannerImage[]>(images);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    setOrder(images);
    setAnimKey((k) => k + 1);
  }, [images]);

  useEffect(() => {
    if (order.length === 0) return;
    const head = order[0];
    const idx = images.findIndex((x) => x.id === head.id);
    setActiveIndex(idx < 0 ? 0 : idx);
  }, [order, images]);

  /* ===== 컨트롤 ===== */
  const goNext = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
    setAnimKey((k) => k + 1);
  };

  const goPrev = () => {
    setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setAnimKey((k) => k + 1);
  };

  const jumpTo = (idx: number) => {
    const rotated = [...images.slice(idx), ...images.slice(0, idx)];
    setOrder(rotated);
    setAnimKey((k) => k + 1);
  };

  return (
    <>
      {/* 캐러셀 섹션 */}
      <section className="relative bg-black text-white">
        <div className={`${INNER} py-10`}>
          <div className="relative rounded-lg p-2 mt-10 shadow-md">
            <NowShowingSection order={order} animKey={animKey} isPending={false} />
            <ProgressBarSection images={images} activeIndex={activeIndex} jumpTo={jumpTo} />
            <ContentMenu
              setIsReviewOpen={setIsReviewOpen}
              setIsReviewRankingOpen={setIsReviewRankingOpen}
              setIsGoodsGraphOpen={setIsGoodsGraphOpen}
              setIsPopularityOpen={setIsPopularityOpen}
              goPrev={goPrev}
              goNext={goNext}
            />
          </div>
        </div>
      </section>

      {/* 나머지 섹션 */}
      <section className="bg-white">
        <div className={`${INNER} pb-16`}>
          <Stage101RooftopSection />
        </div>
      </section>

      <section className="bg-[#2A2461]">
        <div className={`${INNER} py-16`}>
          <NoticeSection />
        </div>
      </section>

      <section className="bg-[#FBFBFB]">
        <div className={`${INNER} py-16`}>
          <FloorGuideSection />
        </div>
      </section>

      {/* 모달 */}
      {isReviewOpen && <ReviewListModal onClose={() => setIsReviewOpen(false)} />}
      {isReviewRankingOpen && <ReviewRankingModal onClose={() => setIsReviewRankingOpen(false)} />}
      {isGoodsGraphOpen && <GoodsGraphModal onClose={() => setIsGoodsGraphOpen(false)} />}
      {isPopularityOpen && <TheaterPopularityModal onClose={() => setIsPopularityOpen(false)} />}
    </>
  );
};

export default HomeClientPage;
