'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useShop from '../../hooks/shop/useShop';
import ShopSkeleton from './_components/ShopSkeleton';
import { getValidImageUrl } from './_components/getValidImageUrl';
import { ShopResponse } from 'src/types/shop/shop-type';

const ShopPage = () => {
  const router = useRouter();
  const { items, loading, error } = useShop();

  const handleDetailPage = (id: string) => {
    router.push(`/shop/${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      {/* 헤더 */}
      <div className="max-w-6xl mx-auto mb-12">
        <p className="text-sm tracking-[0.25em] text-white/60">STAGE101 • GOODS</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold">
          공연의 여운을 <span className="text-[#C9A66B]">집으로</span>
        </h1>
        <p className="mt-3 text-white/70">STAGE101에서 만난 무대의 순간을 굿즈로 이어가세요.</p>
      </div>

      {error && <p className="text-red-500 text-center mt-10">불러오기 실패</p>}

      {/* 굿즈 리스트 */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 border-b border-white/10 pb-3">전체 굿즈</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ShopSkeleton key={i} />)
            : items?.map((item: ShopResponse) => (
                <div
                  key={item.id}
                  onClick={() => handleDetailPage(item.id)}
                  className="cursor-pointer border border-white/10 rounded-lg overflow-hidden
                             hover:border-[#C9A66B]/40 transition"
                >
                  <Image
                    src={getValidImageUrl(item.image_url)}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-[220px]"
                  />

                  <div className="p-4 bg-black">
                    <p className="text-sm text-[#C9A66B]">{item.point.toLocaleString()} Point</p>
                    <h3 className="mt-1 text-base font-semibold">{item.name}</h3>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
