export interface NowShowingSkeletonProps {
  isFront: boolean;
}

const NowShowingSkeleton = ({ isFront }: NowShowingSkeletonProps) => {
  return (
    <div
      className={[
        'relative flex-shrink-0 rounded-md animate-pulse bg-black',
        isFront ? 'w-[220px] sm:w-[260px] h-[400px]' : 'w-[180px] sm:w-[210px] h-[340px]',
      ].join(' ')}
    >
      <div className="relative w-full h-[85%] rounded-t-md bg-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
      </div>

      <div className="mt-2 h-[10%] rounded-md bg-white/10" />
    </div>
  );
};

export default NowShowingSkeleton;
