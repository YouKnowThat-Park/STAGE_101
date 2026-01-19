'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from 'src/ui/icon/ArrowLeftIcon';
import { ArrowRightIcon } from 'src/ui/icon/ArrowRightIcon ';
import { ChartIcon } from 'src/ui/icon/ChartIcon';
import { PiRankingDuotone } from 'react-icons/pi';
import { VscPreview, VscGraph } from 'react-icons/vsc';

type BannerImage = {
  id: number;
  src: string;
  alt: string;
  pos?: string;
};

const IMAGES: BannerImage[] = [
  { id: 1, src: '/STAGE101_rooftop.webp', alt: '배너 이미지 1', pos: 'center 30%' },
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
    <section className="w-full    shadow-md rounded-lg p-2 overflow-hidden mt-20">
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-2 ml-[100px]">
          <h2 className="text-[#C9A66B] font-semibold hover:scale-105 shadow-2xl">상영작</h2>
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
        <div className="flex w-max gap-6 items-end mx-auto">
          {order.map((img, idx) => {
            const isFront = idx === 0;

            return (
              <div
                key={`${img.id}-${idx}-${animKey}`}
                className={[
                  'relative flex-shrink-0 rounded-md border fade transition-all duration-200 bg-[#111]',
                  isFront
                    ? 'w-[220px] sm:w-[260px] h-[400px] shadow-lg z-10'
                    : 'w-[180px] sm:w-[210px] h-[340px]',
                ].join(' ')}
              >
                {/* 이미지 영역 */}
                <div className="relative w-full h-[85%] overflow-hidden rounded-t-md">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={
                      isFront
                        ? '(max-width: 640px) 288px, 324px'
                        : '(max-width: 640px) 240px, 270px'
                    }
                    className="object-cover"
                    style={{ objectPosition: img.pos ?? 'center' }}
                    priority={idx < 2}
                  />

                  <div className="absolute left-2 bottom-2 px-2 py-1 rounded bg-black/50 text-white text-sm">
                    {img.id}
                  </div>
                </div>

                {/* 버튼 영역 */}
                <div className="w-full h-[15%] flex items-center justify-center bg-[#0E0E0E] rounded-b-md">
                  <button className="w-[80%] h-[36px] rounded bg-[#C9A66B] text-black font-medium hover:bg-[#d8b77a] transition">
                    예매
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 아래 진행 바(맨 앞 기준) */}
        <div className="mt-5 flex items-center justify-center gap-2">
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

        <div className="flex justify-center items-center gap-10 mt-2 shadow-2xl ">
          <div>
            <button className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50">
              <span>
                <VscPreview className="text-white" size={30} />
              </span>
              <span>리뷰 보기</span>
            </button>
          </div>
          <div>
            <button className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50">
              <span>
                <PiRankingDuotone className="text-white" size={30} />
              </span>
              <span>리뷰 랭킹</span>
            </button>
          </div>
          <div>
            <button className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50">
              <span>
                <VscGraph className="text-white" size={30} />
              </span>
              <span>굿즈 판매</span>
            </button>
          </div>
          <div>
            <button className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50">
              <span>
                <VscGraph className="text-white" size={30} />
              </span>
              <span>예매 / 리뷰</span>
            </button>
          </div>
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
