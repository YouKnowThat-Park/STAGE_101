import React from 'react';

const HistorySkeleton = () => {
  return (
    <div className="w-full max-w-lg h-[480px] p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-row border p-4 rounded-lg bg-white shadow-lg gap-4 mb-2 animate-pulse"
        >
          {/* 왼쪽 텍스트 영역 */}
          <div className="flex flex-col flex-grow gap-2">
            <div className="h-5 w-1/3 bg-gray-300 rounded" />
            <div className="h-3 w-2/3 bg-gray-300 rounded" />
            <div className="space-y-1 text-xs">
              <div className="h-2 w-full bg-gray-300 rounded" />
              <div className="h-2 w-5/6 bg-gray-300 rounded" />
              <div className="h-2 w-4/6 bg-gray-300 rounded" />
            </div>
            <div className="flex gap-2 text-sm mt-3">
              <div className="h-3 w-20 bg-gray-300 rounded" />
              <div className="h-3 w-20 bg-gray-300 rounded" />
              <div className="h-3 w-24 bg-gray-300 rounded" />
            </div>
          </div>

          {/* 오른쪽 이미지 */}
          <div className="w-28 h-28 bg-gray-300 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default HistorySkeleton;
