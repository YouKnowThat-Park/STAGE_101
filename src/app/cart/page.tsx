'use client';

import useFetchCartData from '@/hooks/useFetchCartData';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { deleteCartData } from '../api/cart/cart';
import { useQueryClient } from '@tanstack/react-query';

const CartPage = () => {
  const userId = useUserStore((state) => state.user?.id) ?? null;
  const { data: cartItems, isLoading, error } = useFetchCartData(userId);
  const queryClient = useQueryClient();
  const router = useRouter();

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error.message}</p>;

  const handleDetailPage = (shopId: string) => {
    if (!shopId) return; // ✅ shopId가 없으면 실행 안 함
    router.push(`/shop/${shopId}`);
  };

  const handleDeleteItem = async (shopId: string) => {
    if (!userId || !shopId) return;
    try {
      await deleteCartData(userId, shopId); // ✅ 먼저 API 실행
      await queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    } catch (error) {
      console.error('error', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };
  return (
    <div>
      <h1>장바구니</h1>
      <ul>
        {(cartItems || []).length > 0 ? ( // ✅ 기본값 `[]` 설정
          (cartItems || []).map((item) => (
            <li key={item.id}>
              <Image
                src={item.image_url}
                alt={item.name}
                width={200}
                height={200}
                onClick={() => handleDetailPage(item.shop_id)}
              />

              <p>🛒 상품명: {item.name}</p>
              <p>📦 수량: {item.quantity}</p>
              <button onClick={() => handleDeleteItem(item.shop_id)}>취소하기</button>
            </li>
          ))
        ) : (
          <p>장바구니가 비어 있습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default CartPage;
