'use client';

import useFetchCartData from '../../hooks/cart/useFetchCartData';
import { useUserStore } from '../../store/userStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import DeleteIcon from '../../ui/icon/DeleteIcon';
import MinusIcon from '../../ui/icon/MinusIcon';
import PlusIcon from '../../ui/icon/PlusIcon';
import useUpdateCartQuantity from '../../hooks/cart/useUpdateCartQuantity';
import { useDeleteCartItem } from 'src/hooks/cart/useDeleteCartItem';
import CartSkeleton from './_components/CartSkeleton';

const CartPage = () => {
  const userId = useUserStore((state) => state?.id) ?? null;
  const { data: cartItems, isLoading, error } = useFetchCartData(userId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateQuantityMutation = useUpdateCartQuantity();
  const deleteMutation = useDeleteCartItem(userId);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const cartItemsList = cartItems ?? [];

  if (isLoading) {
    return <CartSkeleton />;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-10">🚨 오류 발생: {error.message}</p>;
  }

  const handleQuantityChange = (shopId: string, newQuantity: number) => {
    if (!userId || newQuantity < 1) return;
    updateQuantityMutation.mutate({ user_id: userId, shop_id: shopId, quantity: newQuantity });
  };

  const handleDeleteItem = async (shopId: string) => {
    if (!userId || !shopId) return;

    try {
      deleteMutation.mutate({ shop_id: shopId }); // 🟢 옳은 사용 방식
    } catch (error) {
      console.error('error', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCheckout = async () => {
    if (!userId || !selectedItems.length) {
      alert('결제할 상품을 선택하세요.');
      return;
    }

    const selectedCartItems = cartItemsList.filter((item) => selectedItems.includes(item.id));
    if (!selectedCartItems.length) return;

    const totalPrice = selectedCartItems.reduce(
      (total, item) => total + item.point * item.quantity,
      0,
    );
    const totalQuantity = selectedCartItems.reduce((total, item) => total + item.quantity, 0);

    try {
      const response = await fetch('/api/cart/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, totalPrice, quantity: totalQuantity }),
      });

      const result = await response.json();
      if (result.success && result.order?.id) {
        router.push(`/cart/${result.order.id}`);
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['cart', userId] });
        }, 500);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('❌ 결제 오류:', error);
      alert('결제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.length === cartItemsList.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItemsList.map((item) => item.id));
    }
  };

  const handleDeleteSelectedItems = () => {
    if (!userId || !selectedItems.length) {
      alert('삭제할 항목을 선택하세요.');
      return;
    }

    selectedItems.forEach((shopId) => {
      deleteMutation.mutate({ shop_id: shopId });
    });

    setSelectedItems([]);
  };

  const totalPoint =
    cartItemsList
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.point * item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-black text-white py-10 px-6 flex flex-col md:flex-row items-center sm:items-start justify-center gap-12">
      {/* 장바구니 목록 */}
      <div className="w-full max-w-[700px]">
        <h1 className="text-3xl font-bold text-[#C9A66B] mb-8 text-center">🛒 장바구니</h1>

        <div className="flex gap-4 items-center mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="accent-[#C9A66B] w-5 h-5"
              checked={selectedItems.length === cartItemsList.length && cartItemsList.length > 0}
              onChange={handleToggleSelectAll}
            />
            <span className="text-sm text-gray-300">전체 선택</span>
          </label>
          <button
            className="text-sm border border-gray-500 px-3 py-1 rounded hover:bg-gray-700"
            onClick={handleDeleteSelectedItems}
          >
            선택 삭제
          </button>
        </div>

        {cartItemsList.length > 0 ? (
          <ul className="flex flex-col gap-6">
            {cartItemsList.map((item) => (
              <li
                key={item.id}
                className="relative flex bg-[#1C1C1C] lg:flex-row flex-col rounded-xl p-4 shadow-md "
              >
                <button
                  onClick={() => handleDeleteItem(item.shop_id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <DeleteIcon />
                </button>

                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleToggleSelect(item.id)}
                  className="accent-[#C9A66B] mr-4 mt-3 w-5 h-5"
                />

                <div className="flex-shrink-0 lg:flex lg:justify-start lg:items-start flex justify-center items-center">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="lg:ml-4 flex flex-col justify-between w-full items-center text-center lg:items-start lg:text-left">
                  <p className="text-lg font-semibold text-white">{item.name}</p>
                  <div className="flex justify-center lg:justify-start items-center gap-2 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.shop_id, item.quantity - 1)}
                      className="p-2 rounded-full border border-gray-600 hover:bg-gray-800"
                    >
                      <MinusIcon />
                    </button>
                    <span className="px-4 text-white font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.shop_id, item.quantity + 1)}
                      className="p-2 rounded-full border border-gray-600 hover:bg-gray-800"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-10">장바구니가 비어 있습니다.</p>
        )}
      </div>

      {/* 결제 정보 */}
      <div className="w-full md:w-[280px] bg-[#1C1C1C]/80 backdrop-blur-md border md:mt-[121px] border-gray-600 rounded-xl flex flex-col items-center p-6 shadow-lg">
        <div className="w-full border-b border-gray-500 text-center pb-3">
          <h2 className="text-lg font-bold text-white mb-2">주문 예상 가격</h2>
          <p className="text-2xl font-semibold text-[#C9A66B]">
            {totalPoint.toLocaleString()} 포인트
          </p>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-4 bg-[#C9A66B] text-black font-bold py-2 px-6 rounded-lg hover:bg-[#e3bc73] transition w-full"
        >
          구매하기
        </button>
      </div>
    </div>
  );
};

export default CartPage;
