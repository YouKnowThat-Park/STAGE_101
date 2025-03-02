'use client';

import useShopHook from '@/hooks/useShopHook';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { getValidImageUrl } from '../_components/getValidImageUrl';
import Image from 'next/image';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import LoginModal from '@/ui/modal/LoginModal';
import useAddToCart from '@/hooks/useAddToCart';

const Page = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();
  const shopId = Array.isArray(id) ? id[0] : id;
  const { item, error, loading } = useShopHook(shopId);
  const imageUrl = item?.image_url ? getValidImageUrl(item.image_url) : '/default-image.jpg';
  const userId = useUserStore((state) => state.user?.id);
  const addToCart = useAddToCart();

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Number(e.target.value) || 1);
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!item) {
      alert('⚠️ 상품 정보를 불러올 수 없습니다.');
      return;
    }

    console.log('addcart', { userId, shopId, quantity, item });
    addToCart.mutate({
      userId,
      shopId,
      item: {
        name: item.name ?? '고객센터 문의',
        point: item.point ?? 0,
        image_url: getValidImageUrl(item.image_url),
        quantity,
      },
    });
  };

  return (
    <div className="bg-white w-full h-[700px]">
      <Image
        src={imageUrl}
        alt={item?.name ?? '상품 이미지'}
        height={200}
        width={200}
        unoptimized
      />

      <div className="flex items-center space-x-2 my-4">
        <button onClick={decreaseQuantity} className="px-3 py-1 bg-gray-200 rounded">
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="w-12 text-center border border-gray-300 rounded"
          min={1}
        />
        <button onClick={increaseQuantity} className="px-3 py-1 bg-gray-200 rounded">
          +
        </button>
      </div>

      <div className="flex w-[200px] justify-between">
        <button>구매하기</button>
        <button onClick={handleAddToCart}>장바구니에 담기</button>
      </div>

      <div>{item?.name}</div>
      <div>{item?.point}</div>
      <div className="bg-slate-300 w-full h-[100px]">{item?.description}</div>

      {/* 안내 사항 */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h2>안내사항</h2>
        <p className="text-xs">
          이 페이지는 실제 거래가 이루어지지 않는 가상의 쇼핑몰입니다. 프론트엔드 개발자를 꿈꾸는
          학생이 학습 목적으로 제작하였으며, 자세한 내용은
          <Link
            href="https://youkn0wthat.tistory.com/"
            target="_blank"
            className="font-bold border-b border-b-black cursor-pointer"
          >
            블로그에서
          </Link>
          확인하실 수 있습니다.
        </p>
        <p className="text-xs">📩 문의 사항 : youkn0wthat@naver.com</p>
        <p className="text-xs">🔗 GitHub :</p>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Page;
