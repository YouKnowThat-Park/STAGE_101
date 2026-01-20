'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useHeaderScroll } from 'src/hooks/useHeaderScroll';
import HeaderScroll from 'src/ui/header/HeaderScroll';
import { THEATER_LIST } from './theaterConfig';

const TheaterList = () => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useHeaderScroll(scrollRef, setShowScrollHint, 755);

  const handleGoBack = () => {
    router.push('/theater');
  };

  return (
    <div className="px-10 py-14 max-[755px]:px-0">
      <div
        ref={scrollRef}
        className="
          max-[755px]:overflow-x-auto
          max-[755px]:scroll-smooth
          max-[755px]:whitespace-nowrap
          max-[755px]:cursor-grab
          max-[755px]:active:cursor-grabbing
          max-[755px]:[-webkit-overflow-scrolling:touch]
          max-[755px]:[scrollbar-width:none]
          max-[755px]:[&::-webkit-scrollbar]:hidden
        "
      >
        <div
          className="
            flex justify-center items-center gap-5
            w-full
            max-[755px]:inline-flex
            max-[755px]:w-max
            max-[755px]:min-w-[900px]
            px-10
          "
        >
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold shrink-0 min-w-max"
          >
            STAGE_101
          </button>
          <button onClick={handleGoBack} className="shrink-0 min-w-max">
            상영 예정
          </button>
          {THEATER_LIST.map((theater) => (
            <button key={theater.id} onClick={() => router.push(`/theater/${theater.id}`)}>
              {theater.name}
            </button>
          ))}
          {showScrollHint && <HeaderScroll bottomClass="bottom-[480px]" rightClass="right-[2px]" />}
        </div>
      </div>
    </div>
  );
};

export default TheaterList;
