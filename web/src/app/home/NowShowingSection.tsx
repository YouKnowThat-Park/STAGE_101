'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from 'src/ui/icon/ArrowLeftIcon';
import { ArrowRightIcon } from 'src/ui/icon/ArrowRightIcon ';
import { ChartIcon } from 'src/ui/icon/ChartIcon';

type BannerImage = {
  id: number;
  src: string;
  alt: string;
  pos?: string;
};

const IMAGES: BannerImage[] = [
  { id: 1, src: '/mock/slide-1.jpg', alt: '배너 이미지 1', pos: 'center 30%' },
  { id: 2, src: '/mock/slide-2.jpg', alt: '배너 이미지 2' },
  { id: 3, src: '/mock/slide-3.jpg', alt: '배너 이미지 3' },
  { id: 4, src: '/mock/slide-4.jpg', alt: '배너 이미지 4' },
];

export const NowShowingSection = () => {
  const [order, setOrder] = useState<BannerImage[]>(IMAGES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const head = order[0];
    const idx = IMAGES.findIndex((x) => x.id === head.id);
    setActiveIndex(idx < 0 ? 0 : idx);
  }, [order]);

  // 왼쪽 회전
  const goNext = () => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
    setAnimKey((k) => k + 1);
  };

  // 오른쪽 회전
  const goPrev = () => {
    setOrder((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setAnimKey((k) => k + 1);
  };

  const jumpTo = (idx: number) => {
    const rotated = [...IMAGES.slice(idx), ...IMAGES.slice(0, idx)];
    setOrder(rotated);
    setAnimKey((k) => k + 1);
  };

  return (
    <section className="w-full max-w-[1100px] border bg-[#111111] shadow-md rounded-lg p-2 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-2">
          <h2 className="text-[#C9A66B] font-medium hover:scale-105">상영작</h2>
          <ChartIcon className="h-6 w-6 font-semibold text-[#C9A66B] border rounded-md p-1 fill-current hover:scale-105" />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="이전 이미지"
            className="h-9 w-9 rounded-full bg-[#111111] shadow-sm"
          >
            <ArrowLeftIcon className="h-8 w-8 " />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="다음 이미지"
            className="h-9 w-9 rounded-full bg-[#111111] shadow-sm"
          >
            <ArrowRightIcon className="h-8 w-8" />
          </button>
        </div>
      </div>

      <div className="mt-2 relative overflow-hidden">
        <div className="flex w-max gap-3 items-end">
          {order.map((img, idx) => {
            const isFront = idx === 0;

            return (
              <div
                key={`${img.id}-${idx}-${animKey}`}
                className={[
                  'relative flex-shrink-0 rounded-md overflow-hidden border fade transition-all duration-200',
                  isFront
                    ? 'w-[288px] sm:w-[324px] h-[192px] sm:h-[216px] shadow-lg z-10'
                    : 'w-[240px] sm:w-[270px] h-[160px] sm:h-[180px]',
                ].join(' ')}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={
                    isFront ? '(max-width: 640px) 288px, 324px' : '(max-width: 640px) 240px, 270px'
                  }
                  className="object-cover"
                  style={{ objectPosition: img.pos ?? 'center' }}
                  priority={idx < 2}
                />

                {/* 이미지 위에 표시되는 텍스트(원하면 삭제) */}
                <div className="absolute left-2 bottom-2 px-2 py-1 rounded bg-black/50 text-white text-sm">
                  {img.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* 아래 진행 바(맨 앞 기준) */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => jumpTo(idx)}
              aria-label={`${idx + 1}번 이미지로 이동`}
              className={`h-[4px] w-[34px] rounded-full transition-all ${
                idx === activeIndex ? 'bg-[#C9A66B]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0.55;
            }
            to {
              opacity: 1;
            }
          }
          .fade {
            animation: fadeIn 200ms ease;
          }
        `}</style>
      </div>
    </section>
  );
};
