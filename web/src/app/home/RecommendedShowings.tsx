'use client';

import { useEffect, useRef, useState } from 'react';

export const RecommendedShowings = () => {
  // active: 현재 뒤집혀서 "리뷰(뒷면)" 보여주는 카드 인덱스 (null이면 둘 다 앞면)
  const [active, setActive] = useState<null | 0 | 1>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const INITIAL_MS = 1200; // 처음엔 이미지 좀 보여주고 시작
    const SHOW_MS = 4500; // 리뷰 보여주는 시간
    const GAP_MS = 900; // 카드 교대 전 쉬는 시간(겹침/연속 방지)

    const clearAll = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };

    let cancelled = false;

    const loop = (next: 0 | 1) => {
      if (cancelled) return;

      // 1) next 카드 뒤집기(리뷰 보여줌)
      setActive(next);

      // 2) 일정 시간 뒤 다시 앞면으로
      const t1 = window.setTimeout(() => {
        if (cancelled) return;
        setActive(null);

        // 3) 잠깐 쉬었다가 다음 카드로
        const t2 = window.setTimeout(() => {
          if (cancelled) return;
          loop(next === 0 ? 1 : 0);
        }, GAP_MS);

        timers.current.push(t2);
      }, SHOW_MS);

      timers.current.push(t1);
    };

    const t0 = window.setTimeout(() => loop(0), INITIAL_MS);
    timers.current.push(t0);

    return () => {
      cancelled = true;
      clearAll();
    };
  }, []);

  const cardInner = (idx: 0 | 1) =>
    [
      'relative h-full w-full rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/10',
      '[transform-style:preserve-3d]',
      'transition-transform duration-700 ease-in-out',
      active === idx ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]',
      'motion-reduce:transition-none',
      'motion-reduce:[transform:rotateY(0deg)]',
    ].join(' ');

  const faceBase = 'absolute inset-0 [backface-visibility:hidden]';

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 mt-20 py-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* 카드 1 */}
        <article className="[perspective:1200px] aspect-[16/10] w-full">
          <div className={cardInner(0)}>
            {/* front */}
            <div className={faceBase}>
              <img src="/sample1.jpg" alt="추천 상영작 1" className="h-full w-full object-cover" />
              <div className="absolute left-3 top-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 backdrop-blur">
                추천 상영작
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            {/* back */}
            <div
              className={[
                faceBase,
                '[transform:rotateY(180deg)]',
                'bg-gradient-to-br from-zinc-900 to-black text-white p-4',
                'flex flex-col gap-2',
              ].join(' ')}
            >
              <h3 className="text-sm font-semibold">리뷰</h3>
              <p className="text-sm leading-relaxed text-white/90 line-clamp-5">
                “연출이 미쳤고…(예시)”
              </p>
              <div className="mt-auto text-xs text-white/60">— 관객 리뷰</div>
            </div>
          </div>
        </article>

        {/* 카드 2 */}
        <article className="[perspective:1200px] aspect-[16/10] w-full">
          <div className={cardInner(1)}>
            {/* front */}
            <div className={faceBase}>
              <img src="/sample2.jpg" alt="추천 상영작 2" className="h-full w-full object-cover" />
              <div className="absolute left-3 top-3 rounded-full bg-black/60 text-white text-xs px-3 py-1 backdrop-blur">
                추천 상영작
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            {/* back */}
            <div
              className={[
                faceBase,
                '[transform:rotateY(180deg)]',
                'bg-gradient-to-br from-zinc-900 to-black text-white p-4',
                'flex flex-col gap-2',
              ].join(' ')}
            >
              <h3 className="text-sm font-semibold">리뷰</h3>
              <p className="text-sm leading-relaxed text-white/90 line-clamp-5">
                “배우 호흡이…(예시)”
              </p>
              <div className="mt-auto text-xs text-white/60">— 관객 리뷰</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
