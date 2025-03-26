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
  const userId = useUserStore((state) => state.id);
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

  if (loading) return <div className="text-center text-gray-400 mt-10">로딩 중...</div>;
  if (error || !item)
    return <div className="text-center text-red-500 mt-10">상품 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="bg-black text-white min-h-screen py-10 px-6 flex flex-col items-center">
      <div className="bg-[#1C1C1C] p-8 rounded-xl shadow-lg w-full max-w-2xl">
        {/* 이미지 */}
        <div className="w-full flex justify-center mb-6">
          <Image
            src={imageUrl}
            alt={item.name}
            width={300}
            height={300}
            className="rounded-lg object-cover"
            unoptimized
          />
        </div>

        {/* 상품 정보 */}
        <h1 className="text-3xl font-bold text-center mb-2">{item.name}</h1>
        <p className="text-xl text-[#C9A66B] font-semibold text-center mb-4">
          {item.point.toLocaleString()} 포인트
        </p>
        <div className="bg-gray-800/40 p-4 rounded mb-6 text-sm text-gray-300 leading-relaxed">
          {item.description || '상품 설명이 없습니다.'}
        </div>

        {/* 수량 선택 */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={decreaseQuantity}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xl transition"
          >
            −
          </button>

          <input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            min={1}
            className="w-14 text-center py-2 rounded bg-black border border-gray-600 text-white text-lg outline-none focus:ring-2 focus:ring-[#C9A66B]"
          />

          <button
            onClick={increaseQuantity}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white text-xl transition"
          >
            +
          </button>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAddToCart}
            className="px-6 py-2 rounded-lg bg-[#C9A66B] text-black font-semibold hover:bg-[#e7c894] transition"
          >
            장바구니 담기
          </button>
        </div>
      </div>

      {/* 안내사항 */}
      <div className="mt-10 max-w-2xl w-full bg-gray-800/70 p-6 rounded-xl text-sm text-gray-300 space-y-2">
        <h2 className="text-lg font-bold text-white">📌 안내사항</h2>
        <p>
          이 페이지는 실제 거래가 이루어지지 않는 가상의 쇼핑몰입니다. 프론트엔드 개발자를 꿈꾸는
          학생이 학습 목적으로 제작하였으며, 자세한 내용은{' '}
          <Link
            href="https://youkn0wthat.tistory.com/"
            target="_blank"
            className="underline text-[#C9A66B] hover:text-yellow-200"
          >
            블로그
          </Link>{' '}
          에서 확인하실 수 있습니다.
        </p>
        <p>📩 문의 : youkn0wthat@naver.com</p>
        <p>🔗 GitHub : (링크 추가 가능)</p>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Page;
