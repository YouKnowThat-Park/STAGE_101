import ShopSkeleton from './_components/ShopSkeleton';

export default function Loading() {
  const INNER = 'max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

  return (
    <div className={`${INNER} py-10`}>
      <div className="max-w-6xl mx-auto mb-12 animate-pulse">
        <div className="h-3 w-40 bg-white/20 rounded" />

        <div className="mt-4">
          <div className="h-8 sm:h-10 w-[320px] sm:w-[420px] bg-white/20 rounded" />
        </div>

        <div className="mt-4 h-4 w-[280px] sm:w-[360px] bg-white/15 rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <ShopSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
