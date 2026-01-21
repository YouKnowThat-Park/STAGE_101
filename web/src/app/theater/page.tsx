'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { TheaterFilters } from './_components/TheaterFilters';
import { useTheaterList } from 'src/hooks/theater/useTheaterList';
import { useRouter } from 'next/navigation';

function typeLabel(type: string) {
  if (type.startsWith('musical')) return '뮤지컬';
  if (type.startsWith('cinema')) return '영화';
  if (type.startsWith('concert')) return '콘서트';
  return '기타';
}

const TheaterPage = () => {
  const router = useRouter();
  const { data, isError } = useTheaterList({ status: false, limit: 50, offset: 0 });

  const items = data?.items ?? [];
  const [filter, setFilter] = useState<{ category: string; selectedId: string }>({
    category: '전체',
    selectedId: 'all',
  });

  const filtered = useMemo(() => {
    let arr = items;

    if (filter.category !== '전체') {
      arr = arr.filter((it) => typeLabel(it.type) === filter.category);
    }
    if (filter.selectedId !== 'all') {
      arr = arr.filter((it) => it.id === filter.selectedId);
    }

    return arr;
  }, [items, filter]);

  if (isError) return <div className="min-h-screen bg-black text-white p-10">불러오기 실패</div>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,166,107,0.18),rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {/* 헤더 */}
        <div className="flex flex-col gap-3">
          <p className="text-sm tracking-[0.25em] text-white/60">
            <a href="/">STAGE101</a> • PROGRAM
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold">
            상영 작품 <span className="text-[#C9A66B]">라인업</span>
          </h1>
          <p className="max-w-2xl text-white/70">
            소극장 감성과 루프탑의 밤. 오픈 일정과 함께 미리 작품을 만나보세요.
          </p>
        </div>

        {/* ✅ 필터 */}
        <TheaterFilters
          items={items.map((x) => ({ id: x.id, name: x.name, type: x.type }))}
          onChange={setFilter}
        />

        {/* ✅ 카드 그리드: filtered를 사용 */}
        <div className="mt-10 grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
          {filtered.map((it) => (
            <div
              key={it.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_18px_70px_rgba(0,0,0,0.55)]"
            >
              <div className="relative h-[420px] w-full">
                <Image
                  src={it.main_img}
                  alt={it.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

                {/* 배지 */}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/80 backdrop-blur">
                    {typeLabel(it.type)}
                  </span>
                  <span className="rounded-full border border-[#C9A66B]/30 bg-[#C9A66B]/15 px-3 py-1 text-xs text-[#C9A66B] backdrop-blur">
                    상영 중
                  </span>
                </div>

                {/* 하단 */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs text-white/70">
                    {it.start_date}
                    {it.end_date ? ` ~ ${it.end_date}` : ''}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-wide">{it.name}</h2>

                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => router.push(`/theater/${it.id}`)}
                      className="inline-flex items-center justify-center rounded-xl border bg-white/5  border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
                    >
                      상세 보기
                    </button>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-[#C9A66B]/30 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheaterPage;
