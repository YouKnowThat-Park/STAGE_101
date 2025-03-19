'use client';

import useFetchCartData from '@/hooks/useFetchCartData';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { deleteCartData } from '../api/cart/cart';
import { useQueryClient } from '@tanstack/react-query';
import DeleteIcon from '@/ui/icon/DeleteIcon';
import MinusIcon from '@/ui/icon/MinusIcon';
import PlusIcon from '@/ui/icon/PlusIcon';
import useUpdateCartQuantity from '@/hooks/useUpdateCartQuantity';

const CartPage = () => {
  const userId = useUserStore((state) => state?.id) ?? null;
  const { data: cartItems, isLoading, error } = useFetchCartData(userId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateQuantityMutation = useUpdateCartQuantity();

  if (isLoading)
    return <p className="text-center text-gray-500 text-xl font-semibold">⏳ 로딩 중...</p>;
  if (error)
    return <p className="text-center text-red-500 text-lg">🚨 오류 발생: {error.message}</p>;

  const handleQuantityChange = (shopId: string, newQuantity: number) => {
    if (!userId) return;
    if (newQuantity < 1) return; // 최소 수량 1 유지

    updateQuantityMutation.mutate({ userId, shopId, quantity: newQuantity });
  };

  const handleDetailPage = (shopId: string) => {
    if (!shopId) return;
    router.push(`/shop/${shopId}`);
  };

  const handleDeleteItem = async (shopId: string) => {
    if (!userId || !shopId) return;
    try {
      await deleteCartData(userId, shopId);

      // ✅ 2초 뒤에 장바구니 데이터 새로고침
      setTimeout(async () => {
        await queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      }, 2000); // 2초 뒤 실행
    } catch (error) {
      console.error('error', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCheckout = async () => {
    if (!userId || !cartItems || cartItems.length === 0) return;

    const totalPrice = cartItems.reduce((total, item) => total + item.point * item.quantity, 0);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

    try {
      const response = await fetch('/api/cart/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, totalPrice, quantity: totalQuantity }),
      });

      const result = await response.json();

      if (result.success && result.order?.id) {
        // ✅ 1️⃣ 먼저 결제 완료 페이지로 이동
        router.push(`/cart/${result.order.id}`);

        // ✅ 2️⃣ 페이지 이동 후 장바구니 데이터를 새로고침 (깜빡임 방지)
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['cart', userId] });
        }, 500); // 0.5초 뒤 실행 (UX 최적화)
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('❌ 결제 오류:', error);
      alert('결제 중 오류가 발생했습니다.');
    }
  };

  const totalPoint = cartItems?.reduce((total, item) => total + item.point * item.quantity, 0) || 0;

  return (
    <div className="flex w-full bg-white py-10 justify-center gap-10">
      {/* 🛒 장바구니 상품 목록 */}
      <div className="w-[600px]">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">장바구니</h1>

        <div className="flex gap-4">
          <label>
            전체 선택
            <input type="checkbox" className="ml-2" />
          </label>
          <button className="border rounded-md border-black px-4 py-1">선택 삭제</button>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <ul className="w-full flex flex-col gap-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="relative flex border border-gray-300 rounded-lg p-6 bg-white shadow-lg w-full h-full"
              >
                {/* 🗑️ 삭제 버튼 (오른쪽 상단) */}
                <button
                  onClick={() => handleDeleteItem(item.shop_id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <DeleteIcon />
                </button>

                {/* 체크박스 */}
                <input type="checkbox" className="mr-4 w-7 rounded" />

                {/* 🖼️ 상품 이미지 */}
                <div className="flex-shrink-0">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="rounded-lg cursor-pointer hover:opacity-80 transition"
                    onClick={() => handleDetailPage(item.shop_id)}
                  />
                </div>

                {/* 📜 상품 정보 */}
                <div className="flex flex-col justify-between ml-4 w-full">
                  <p className="text-lg font-bold text-center text-gray-800">{item.name}</p>
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.shop_id, item.quantity - 1)}
                      className="p-2 rounded-full border border-gray-400 hover:bg-gray-200"
                    >
                      <MinusIcon />
                    </button>
                    <span className="border py-2 px-4 text-gray-700 text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.shop_id, item.quantity + 1)}
                      className="p-2 rounded-full border border-gray-400 hover:bg-gray-200"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-gray-700 text-center">
                    {(item.point * item.quantity).toLocaleString()} 포인트
                  </p>
                  {/* 💳 결제 버튼 */}
                  <button
                    onClick={handleCheckout}
                    className="w-[200px] mt-3 mx-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    결제하기
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400 text-xl mt-10">🛒 장바구니가 비어 있습니다.</p>
        )}
      </div>

      {/* 💰 총 결제 내역 */}
      <div className="bg-white border border-black w-[250px] h-[250px] mt-[105px] rounded-md flex flex-col justify-between items-center p-6">
        <div className="border-b-2 w-full text-center pb-3">
          <h2 className="text-2xl font-bold">주문 예상 가격</h2>
          <p className="text-xl font-semibold text-gray-800">
            {totalPoint.toLocaleString()} 포인트
          </p>
        </div>
        <div className="text-base">
          <p className="text-red-500">할인: 0%</p>
          <p className=" font-bold text-gray-800 text-center">
            총 포인트: {totalPoint.toLocaleString()} 포인트
          </p>
          <button
            onClick={handleCheckout}
            className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mb-4"
          >
            전체 결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
