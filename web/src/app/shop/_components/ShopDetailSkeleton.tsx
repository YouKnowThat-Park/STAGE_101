import React from 'react';
import { ShopDetailSkeletonProps } from 'src/types/shop/shop-type';

const ShopDetailSkeleton = ({ loading }: ShopDetailSkeletonProps) => {
  if (!loading) return null;
  return (
    <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start animate-pulse">
      {/* 이미지 스켈레톤 */}
      <div className="flex justify-center">
        <div
          className="
            w-[360px] h-[360px]
            rounded-xl
            bg-white/5
            ring-1 ring-white/10
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            relative
            overflow-hidden
          "
        >
          {/* shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.6s_infinite]" />
        </div>
      </div>

      {/* 정보 스켈레톤 */}
      <div className="flex flex-col gap-4">
        {/* 상품명 */}
        <div className="h-7 w-3/4 rounded bg-white/10" />

        {/* 가격 */}
        <div className="h-6 w-1/3 rounded bg-[#C9A66B]/30" />

        {/* 설명 */}
        <div className="space-y-2 mt-2">
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-white/10" />
          <div className="h-4 w-2/3 rounded bg-white/10" />
        </div>

        {/* 수량 버튼 영역 */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-9 h-9 rounded-full bg-white/10" />
          <div className="w-14 h-9 rounded bg-white/10" />
          <div className="w-9 h-9 rounded-full bg-white/10" />
        </div>

        {/* CTA 버튼 */}
        <div className="mt-6">
          <div
            className="
              h-12 w-40
              rounded-xl
              bg-[#C9A66B]/40
              shadow-[0_10px_30px_rgba(201,166,107,0.25)]
            "
          />
        </div>
      </div>
    </div>
  );
};

export default ShopDetailSkeleton;
