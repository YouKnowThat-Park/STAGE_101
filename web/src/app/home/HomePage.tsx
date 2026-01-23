'use client';
import { useEffect, useMemo, useState } from 'react';
import FloorGuideSection from './sections/FloorGuideSection';
import NoticeSection from './sections/NoticeSection';
import ContentMenu from './sections/ContentMenu';
import ProgressBarSection from './sections/ProgressBarSection';
import Stage101RooftopSection from './sections/Stage101RooftopSection';
import NowShowingSection from './sections/NowShowingSection';
import { useTheaterList } from 'src/hooks/theater/useTheaterList';
import { BannerImage } from 'src/types/common/common-type';
import ReviewListModal from './modal/ReviewListModal';
import GoodsGraphModal from './modal/GoodsGraphModal';
import ReviewRankingModal from './modal/ReviewRankingModal';

const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

const HomePage = () => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewRankingOpen, setIsReviewRankingOpen] = useState(false);
  const [isGoodsGraph, setIsGoodsGraph] = useState(false);

  // 🔑 캐러셀 컨트롤 (공유)
  const { data, isPending } = useTheaterList({
    status: false,
    limit: 10,
    offset: 0,
  });

  const images: BannerImage[] = useMemo(() => {
    const items = data?.items ?? [];
    return items.map((t) => ({
      id: String(t.id),
      src: t.main_img,
      alt: t.name,
      pos: 'center 30%',
      theaterKey: t.type,
    }));
  }, [data]);

  /* ===== 캐러셀 상태 ===== */
  const [order, setOrder] = useState<BannerImage[]>([]);
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
    <main className="w-full min-h-screen">
      {/* 🔥 상영작 섹션 – 여기서 전부 조립 */}
      <section className="relative bg-black text-white">
        <div className={`${INNER} relative py-10`}>
          {/* 🔥 NOW SHOWING UI BLOCK */}
          <div className="relative isolate w-full rounded-lg p-2 mt-20 shadow-md">
            {/* 배경 (원래 NowShowingSection에 있던 거) */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,166,107,0.18),rgba(0,0,0,0)_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
              <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* 타이틀 */}
            <div className="relative z-10 flex items-center px-1 mb-2">
              <h2 className="ml-[100px] text-[#C9A66B] font-semibold">상영작</h2>
            </div>

            {/* 1. 카드 */}
            <NowShowingSection order={order} animKey={animKey} isPending={isPending} />

            {/* 2. 진행바 */}
            <ProgressBarSection images={images} activeIndex={activeIndex} jumpTo={jumpTo} />

            {/* 3. 콘텐츠 메뉴 */}
            <ContentMenu
              setIsReviewOpen={setIsReviewOpen}
              setIsReviewRankingOpen={setIsReviewRankingOpen}
              setIsGoodsGraph={setIsGoodsGraph}
              goPrev={goPrev}
              goNext={goNext}
            />
          </div>
          {/* 🔥 END NOW SHOWING UI BLOCK */}
        </div>
      </section>

      {/* 나머지 섹션들 */}
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

      {/* 🔔 모달은 페이지 레벨 */}
      {isReviewOpen && <ReviewListModal onClose={() => setIsReviewOpen(false)} />}
      {isReviewRankingOpen && <ReviewRankingModal onClose={() => setIsReviewRankingOpen(false)} />}
      {isGoodsGraph && <GoodsGraphModal onClose={() => setIsGoodsGraph(false)} />}
    </main>
  );
};

export default HomePage;
