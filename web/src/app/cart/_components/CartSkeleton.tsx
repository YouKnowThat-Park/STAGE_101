import React from 'react';

const CartSkeleton = () => {
  return (
    <div>
      <div className="min-h-screen bg-black text-white py-10 px-6 flex flex-col md:flex-row items-center sm:items-start justify-center gap-12 animate-pulse">
        <div className="w-full max-w-[700px]">
          <h1 className="text-3xl font-bold text-[#C9A66B] mb-8 text-center">🛒 장바구니</h1>
          <ul className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="relative flex bg-[#1C1C1C] lg:flex-row flex-col rounded-xl p-4 shadow-md gap-4"
              >
                <div className="w-5 h-5 bg-gray-700 rounded-sm" />
                <div className="w-[100px] h-[100px] bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-600 rounded w-2/3" />
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-600" />
                    <div className="w-10 h-10 rounded bg-gray-600" />
                    <div className="w-10 h-10 rounded-full bg-gray-600" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-[280px] bg-[#1C1C1C]/80 border border-gray-600 rounded-xl flex flex-col items-center p-6 shadow-lg">
          <div className="w-full border-b border-gray-500 text-center pb-3 space-y-2">
            <div className="h-4 bg-gray-600 w-1/2 mx-auto rounded" />
            <div className="h-6 bg-gray-600 w-2/3 mx-auto rounded" />
          </div>
          <div className="mt-4 w-full h-10 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
