import React, { useMemo, useState } from 'react';

type Item = {
  id: string;
  name: string;
  type: string; // musicalA, cinemaB...
};

function typeLabel(type: string) {
  if (type.startsWith('musical')) return '뮤지컬';
  if (type.startsWith('cinema')) return '영화';
  if (type.startsWith('concert')) return '콘서트';
  return '기타';
}

export function TheaterFilters({
  items,
  onChange,
}: {
  items: Item[];
  onChange: (v: { category: string; selectedId: string }) => void;
}) {
  const [category, setCategory] = useState<'전체' | '뮤지컬' | '영화' | '콘서트'>('전체');
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('all');

  const categoryItems = useMemo(() => {
    if (category === '전체') return items;
    return items.filter((it) => typeLabel(it.type) === category);
  }, [items, category]);

  const selectedName = useMemo(() => {
    if (selectedId === 'all') return '전체 작품';
    return items.find((x) => x.id === selectedId)?.name ?? '선택';
  }, [items, selectedId]);

  const apply = (nextCategory: typeof category, nextSelectedId: string) => {
    setCategory(nextCategory);
    setSelectedId(nextSelectedId);
    onChange({ category: nextCategory, selectedId: nextSelectedId });
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {/* 카테고리 토글 */}
      <div className="flex flex-wrap items-center gap-2">
        {(['전체', '뮤지컬', '영화', '콘서트'] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => apply(c, 'all')}
            className={[
              'rounded-full border px-4 py-2 text-sm transition',
              category === c
                ? 'border-[#C9A66B]/40 bg-[#C9A66B]/15 text-[#C9A66B]'
                : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 제목 드롭다운 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
          aria-expanded={open}
        >
          <span className="text-white/60">작품</span>
          <span className="font-medium text-white">{selectedName}</span>
          <span className="ml-1 text-white/60">▾</span>
        </button>

        {open && (
          <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-black/90 backdrop-blur shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={() => {
                apply(category, 'all');
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5"
            >
              전체 작품
            </button>

            <div className="max-h-[260px] overflow-auto">
              {categoryItems.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    apply(category, it.id);
                    setOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate">{it.name}</span>
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60">
                      {typeLabel(it.type)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
