import ShopSkeleton from './_components/ShopSkeleton';

export const Loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <ShopSkeleton key={i} />
      ))}
    </div>
  );
};
