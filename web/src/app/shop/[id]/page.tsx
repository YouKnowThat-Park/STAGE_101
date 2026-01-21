'use client';

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { getValidImageUrl } from '../_components/getValidImageUrl';
import Image from 'next/image';
import Link from 'next/link';
import { useUserStore } from '../../../store/userStore';
import LoginModal from '../../../ui/modal/LoginModal';
import useShop from '../../../hooks/shop/useShop';
import useAddToCart from 'src/hooks/cart/useAddCartData';
import ShopDetailSkeleton from '../_components/ShopDetailSkeleton';

const Page = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();
  const shopId = Array.isArray(id) ? id[0] : id;
  const { item, error, loading } = useShop(shopId);
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
      user_id: userId,
      shop_id: shopId,
      name: item.name ?? '고객센터 문의',
      point: item.point ?? 0,
      quantity,
      image_url: getValidImageUrl(item.image_url),
    });
  };

  if (error || (!item && !loading)) {
    return <div className="text-center text-red-500 mt-10">상품 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <ShopDetailSkeleton loading={loading} />

      {!loading && item && (
        <>
          {/* 헤더 */}
          <div className="max-w-4xl mx-auto mb-10">
            <p className="text-sm tracking-[0.25em] text-white/60">STAGE101 • GOODS</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold">
              무대의 순간을 <span className="text-[#C9A66B]">굿즈로</span>
            </h1>
            <p className="mt-3 text-white/70">
              STAGE101에서 만난 공연의 감동을 일상에서도 느껴보세요.
            </p>
          </div>

          {/* 메인 카드 */}
          <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* 이미지 */}
            <div className="flex justify-center">
              <Image
                src={imageUrl}
                alt={item.name}
                width={360}
                height={360}
                className="rounded-xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                unoptimized
              />
            </div>

            {/* 정보 */}
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">{item.name}</h2>
              <p className="text-lg text-[#C9A66B] font-semibold">
                {item.point.toLocaleString()} Point
              </p>

              <div className="text-sm text-white/70 leading-relaxed">
                {item.description || '상품 설명이 없습니다.'}
              </div>

              {/* 수량 */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={decreaseQuantity}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleInputChange}
                  min={1}
                  className="w-14 text-center py-2 rounded bg-black border border-white/20 text-white outline-none focus:ring-2 focus:ring-[#C9A66B]"
                />
                <button
                  onClick={increaseQuantity}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  +
                </button>
              </div>

              {/* 버튼 */}
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 rounded-xl bg-[#C9A66B] text-black font-semibold
                         shadow-[0_10px_30px_rgba(201,166,107,0.25)]
                         hover:brightness-110 transition"
                >
                  장바구니에 담기
                </button>
              </div>
            </div>
          </div>

          {/* 안내 */}
          <div className="mt-16 mx-auto max-w-4xl border border-white/10 rounded-xl p-6 text-sm text-white/70 space-y-2">
            <h3 className="text-base font-semibold text-white">안내</h3>
            <p>
              이 페이지는 실제 거래가 이루어지지 않는 포트폴리오용 서비스입니다. <br /> 프론트엔드
              개발 학습을 위해 제작되었습니다. 자세한 내용은
              <Link
                href="https://youkn0wthat.tistory.com/"
                target="_blank"
                className="underline text-[#C9A66B] hover:text-yellow-200"
              >
                블로그
              </Link>
              에서 확인하실 수 있습니다.
            </p>
            <p>문의 : youkn0wthat@naver.com</p>
            <p>GitHub : github.com/YouKnowThat-Park/STAGE_101</p>
          </div>
        </>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Page;
