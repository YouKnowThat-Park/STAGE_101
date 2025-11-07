import React from 'react';

const ShopSkeleton = () => {
  return (
    <div>
      <div className="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-md animate-pulse">
        <div className="bg-gray-700 w-full h-[200px] rounded-t-xl" />
        <div className="p-4 space-y-2">
          <div className="h-4 w-1/2 bg-gray-600 rounded" />
          <div className="h-5 w-3/4 bg-gray-600 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ShopSkeleton;
