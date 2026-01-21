'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { LuRectangleVertical } from 'react-icons/lu';
import { PiRankingDuotone } from 'react-icons/pi';
import { VscPreview, VscGraph } from 'react-icons/vsc';
import { useTheaterList } from 'src/hooks/theater/useTheaterList';
import { BannerImage } from 'src/types/common/common-type';

export const NowShowingSection = () => {
  const { data } = useTheaterList({ status: false, limit: 10, offset: 0 });

  const images: BannerImage[] = useMemo(() => {
    const items = data?.items ?? [];
    return items.map((t) => ({
      id: String(t.id),
      src: t.main_img,
      alt: t.name,
      pos: 'center 30%',
    }));
  }, [data]);

  const [order, setOrder] = useState<BannerImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      setOrder(images);
      setAnimKey((k) => k + 1);
    }
  }, [images]);

  // 진행바 activeIndex 계산(현재 맨 앞 카드가 원본 images에서 몇 번째인지)
  useEffect(() => {
    if (order.length === 0) return;
    const head = order[0];
    const idx = images.findIndex((x) => x.id === head.id);
    setActiveIndex(idx < 0 ? 0 : idx);
  }, [order, images]);

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
    const rotated = [...images.slice(idx), ...images.slice(0, idx)];
    setOrder(rotated);
    setAnimKey((k) => k + 1);
  };

  return (
    <section className="w-full    shadow-md rounded-lg p-2 overflow-hidden mt-20">
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-2 ml-[100px]">
          <h2 className="text-[#C9A66B] font-semibold hover:scale-105 shadow-2xl">상영작</h2>
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
                  'relative flex-shrink-0 rounded-md fade transition-all duration-200',
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
                    className="object-cover "
                    style={{ objectPosition: img.pos ?? 'center' }}
                    priority={idx < 2}
                  />

                  <div className="absolute left-2 bottom-2 px-2 py-1 rounded bg-black/50 text-white text-sm">
                    {img.id}
                  </div>
                  <div className="text-white font-semibold px-2 py-1 absolute right-5 bottom-2 bg-black/50 rounded">
                    안녕하세요.
                  </div>
                </div>

                {/* 버튼 영역 */}
                <div className="w-full h-[10%] mt-2 flex items-center justify-center  border rounded-md">
                  <button className="w-full h-full rounded bg-[#C9A66B] text-black font-medium hover:bg-[#d8b77a] transition">
                    예매
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 아래 진행 바(맨 앞 기준) */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {images.map((_, idx) => (
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
              <span>굿즈 랭킹</span>
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

          <div
            className=" absolute right-5 bottom-2
    inline-flex items-center  rounded-sm
    bg-[#0b0b0b] border border-white/10
    shadow-[inset_0_2px_8px_rgba(0,0,0,0.85),_0_1px_0_rgba(255,255,255,0.04)]
  "
          >
            <button
              type="button"
              onClick={goPrev}
              aria-label="이전 이미지"
              className="
      group h-9 w-9 rounded-sm
      flex items-center justify-center
      bg-[#111] text-white
      
      shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),_0_1px_0_rgba(255,255,255,0.05)]
      hover:text-[#C9A66B] hover:bg-[#141414]
      active:text-[#C9A66B] active:bg-[#0f0f0f] active:translate-y-[1px]
      active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.95)]
      transition-all
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A66B]/50
    "
            >
              <LuRectangleVertical className="h-7 w-5 opacity-90 group-hover:opacity-100 transition" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="다음 이미지"
              className="
      group h-9 w-9 rounded-sm
      flex items-center justify-center
      bg-[#111] text-white
      
      shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),_0_1px_0_rgba(255,255,255,0.05)]
      hover:text-[#C9A66B] hover:bg-[#141414]
      active:text-[#C9A66B] active:bg-[#0f0f0f] active:translate-y-[1px]
      active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.95)]
      transition-all
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A66B]/50
    "
            >
              <LuRectangleVertical className="h-7 w-5 rotate-180 opacity-90 group-hover:opacity-100 transition" />
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
