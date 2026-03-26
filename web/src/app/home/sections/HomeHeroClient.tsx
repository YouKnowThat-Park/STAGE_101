'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { BannerImage } from 'src/types/common/common-type';
import ContentMenu from './ContentMenu';
import ProgressBarSection from './ProgressBarSection';
import NowShowingCarousel from './NowShowingCarousel';

const ReviewListModal = dynamic(() => import('../modal/ReviewListModal'));
const GoodsGraphModal = dynamic(() => import('../modal/GoodsGraphModal'));
const ReviewRankingModal = dynamic(() => import('../modal/ReviewRankingModal'));
const TheaterPopularityModal = dynamic(() => import('../modal/TheaterPopularityModal'));

interface HomeHeroClientProps {
  images: BannerImage[];
}

const HomeHeroClient = ({ images }: HomeHeroClientProps) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewRankingOpen, setIsReviewRankingOpen] = useState(false);
  const [isGoodsGraphOpen, setIsGoodsGraphOpen] = useState(false);
  const [isPopularityOpen, setIsPopularityOpen] = useState(false);

  const [order, setOrder] = useState<BannerImage[]>(images);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    setOrder(images);
    setAnimKey((key) => key + 1);
  }, [images]);

  useEffect(() => {
    if (order.length === 0) return;
    const head = order[0];
    const idx = images.findIndex((image) => image.id === head.id);
    setActiveIndex(idx < 0 ? 0 : idx);
  }, [order, images]);

  const goNext = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
    setAnimKey((key) => key + 1);
  };

  const goPrev = () => {
    setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setAnimKey((key) => key + 1);
  };

  const jumpTo = (idx: number) => {
    const rotated = [...images.slice(idx), ...images.slice(0, idx)];
    setOrder(rotated);
    setAnimKey((key) => key + 1);
  };

  return (
    <>
      <NowShowingCarousel order={order} animKey={animKey} isPending={false} />
      <ProgressBarSection images={images} activeIndex={activeIndex} jumpTo={jumpTo} />
      <ContentMenu
        setIsReviewOpen={setIsReviewOpen}
        setIsReviewRankingOpen={setIsReviewRankingOpen}
        setIsGoodsGraphOpen={setIsGoodsGraphOpen}
        setIsPopularityOpen={setIsPopularityOpen}
        goPrev={goPrev}
        goNext={goNext}
      />

      {isReviewOpen && <ReviewListModal onClose={() => setIsReviewOpen(false)} />}
      {isReviewRankingOpen && <ReviewRankingModal onClose={() => setIsReviewRankingOpen(false)} />}
      {isGoodsGraphOpen && <GoodsGraphModal onClose={() => setIsGoodsGraphOpen(false)} />}
      {isPopularityOpen && <TheaterPopularityModal onClose={() => setIsPopularityOpen(false)} />}
    </>
  );
};

export default HomeHeroClient;
