'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BannerImage } from 'src/types/common/common-type';
import NowShowingSkeleton from '../_components/NowShowingSkeleton';

interface NowShowingCarouselProps {
  order: BannerImage[];
  animKey: number;
  isPending: boolean;
}

const VISIBLE_COUNT = 5;

const NowShowingCarousel = ({ order, animKey, isPending }: NowShowingCarouselProps) => {
  if (order.length === 0) {
    return null;
  }

  const visibleImages = Array.from({ length: VISIBLE_COUNT }).map((_, i) => order[i % order.length]);

  return (
    <div className="relative z-10 mt-2 overflow-hidden">
      <div className="flex w-max gap-6 items-end mx-auto transition-all duration-300">
        {isPending
          ? Array.from({ length: VISIBLE_COUNT }).map((_, idx) => (
              <NowShowingSkeleton key={idx} isFront={idx === 0} />
            ))
          : visibleImages.map((img, idx) => {
              const isFront = idx === 0;

              return (
                <div
                  key={`${img.id}-${idx}-${animKey}`}
                  className={[
                    'relative flex-shrink-0 rounded-md transition-all duration-200',
                    isFront
                      ? 'w-[220px] sm:w-[260px] h-[400px] shadow-lg z-10'
                      : 'w-[180px] sm:w-[210px] h-[340px]',
                  ].join(' ')}
                >
                  <div className="relative w-full h-[85%] overflow-hidden rounded-t-md">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      priority={isFront}
                      sizes="(max-width: 640px) 180px, (max-width: 1024px) 210px, 260px"
                      className="object-cover"
                      style={{ objectPosition: img.pos ?? 'center' }}
                    />

                    <div className="absolute right-5 bottom-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
                      {img.alt}
                    </div>
                  </div>

                  <div className="mt-2 h-[10%] w-full border flex items-center justify-center">
                    <Link
                      href={`/theater/${encodeURIComponent(img.theaterKey)}`}
                      className="w-full h-full flex items-center justify-center bg-[#C9A66B] text-black"
                    >
                      예매
                    </Link>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default NowShowingCarousel;
