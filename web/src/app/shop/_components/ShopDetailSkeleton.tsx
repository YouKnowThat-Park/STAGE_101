import React from 'react';

export interface ShopDetailSkeletonProps {
  loading: boolean;
}

const ShopDetailSkeleton = ({ loading }: ShopDetailSkeletonProps) => {
  if (!loading) return null;
  return (
    <div>
      <div
        className="bg-[#1C1C1C] p-8 rounded-xl shadow-lg w-full max-w-2xl animate-pulse"
        hidden={!loading}
      >
        <div className="w-full flex justify-center mb-6">
          <div className="w-[300px] h-[300px] bg-gray-700 rounded-lg" />
        </div>
        <div className="h-6 w-1/2 bg-gray-600 mx-auto rounded mb-3" />
        <div className="h-5 w-1/3 bg-gray-600 mx-auto rounded mb-6" />
        <div className="bg-gray-700 p-4 rounded mb-6 space-y-2">
          <div className="h-3 bg-gray-600 rounded w-full" />
          <div className="h-3 bg-gray-600 rounded w-5/6" />
          <div className="h-3 bg-gray-600 rounded w-4/6" />
        </div>
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-600 rounded-full" />
          <div className="w-14 h-10 bg-gray-700 rounded" />
          <div className="w-10 h-10 bg-gray-600 rounded-full" />
        </div>
        <div className="w-40 h-10 bg-gray-500 mx-auto rounded" />
      </div>
    </div>
  );
};

export default ShopDetailSkeleton;
