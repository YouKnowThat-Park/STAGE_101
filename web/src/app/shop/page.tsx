'use client';

import useShopHook from '../../hooks/useShop';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getValidImageUrl } from './_components/getValidImageUrl';
import useShop from '../../hooks/useShop';

const ShopPage = () => {
  const router = useRouter();
  const { items, loading, error } = useShop();

  const HandleDetailPage = (id: string) => {
    router.push(`/shop/${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-[#C9A66B] mb-10">상점</h1>

      {error && <p className="text-red-500 text-center mt-10">❌</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-md animate-pulse"
              >
                <div className="bg-gray-700 w-full h-[200px] rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-1/2 bg-gray-600 rounded" />
                  <div className="h-5 w-3/4 bg-gray-600 rounded" />
                </div>
              </div>
            ))
          : items?.map((item) => (
              <div
                key={item.id}
                onClick={() => HandleDetailPage(item.id)}
                className="bg-[#1C1C1C] border border-gray-700 rounded-xl shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <Image
                  src={getValidImageUrl(item.image_url)}
                  alt={item.name}
                  width={400}
                  height={400}
                  className="rounded-t-xl object-cover w-full h-[200px]"
                />
                <div className="p-4">
                  <p className="text-[#C9A66B] font-semibold">{item.point} Point</p>
                  <h2 className="text-lg font-bold mt-1">{item.name}</h2>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ShopPage;
