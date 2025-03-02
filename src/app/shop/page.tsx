'use client'; // 클라이언트 컴포넌트로 설정

import useShopHook from '@/hooks/useShopHook';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getValidImageUrl } from './_components/getValidImageUrl';

const ShopPage = () => {
  const router = useRouter();

  const { items, loading, error } = useShopHook();

  if (loading) return <p className="text-gray-500">⏳ 로딩 중...</p>;
  if (error) return <p className="text-red-500">❌ {error}</p>;

  const HandleDetailPage = (id: string) => {
    router.push(`/shop/${id}`);
  };

  return (
    <div className=" p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">상점</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items?.map((item) => (
          <div
            key={item.id}
            onClick={() => HandleDetailPage(item.id)}
            className="border p-4 rounded-lg shadow cursor-pointer"
          >
            <Image
              src={getValidImageUrl(item.image_url)}
              alt={item.name}
              width={200}
              height={200}
              className="w-full h-40 object-cover"
            />
            <p>{item.point}.Point</p>
            <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
