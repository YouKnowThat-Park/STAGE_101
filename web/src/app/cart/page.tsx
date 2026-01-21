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
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from 'src/types/cart/cart-type';
import { useCreateCartHistory } from 'src/hooks/cart_history/useCreateCartHistory';
import Link from 'next/link';

const CartPage = () => {
  const userId = useUserStore((state) => state?.id) ?? null;
  const { data: cartItems, isLoading, error } = useFetchCartData(userId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateQuantityMutation = useUpdateCartQuantity();
  const deleteMutation = useDeleteCartItem(userId);
  const { mutate: createCartHistory } = useCreateCartHistory();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const cartItemsList: CartItem[] = cartItems ?? [];

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

    const paymentKey = uuidv4(); // ✅ 같은 결제 묶음 키(여러 히스토리가 공유)
    const representative = selectedCartItems[0];

    createCartHistory(
      {
        payment_key: paymentKey,
        total_price: totalPrice,
        quantity: totalQuantity,
        status: 'pending',
        name: representative.name,
        image_url: representative.image_url,
        cart_item_ids: selectedCartItems.map((i) => i.id),
      },
      {
        // ✅ 서버가 CartHistory[] 배열을 반환함
        onSuccess: (histories) => {
          if (!histories || histories.length === 0) {
            alert('생성된 결제 내역이 없습니다.');
            return;
          }
          const firstId = histories[0].id; // 단건 히스토리 id
          router.push(`/cart/${firstId}`); // /cart/[id] 로 이동 (success 폴더 필요 없음)
          queryClient.invalidateQueries({ queryKey: ['cart', userId] });
        },
        onError: (err: any) => {
          alert('결제 실패: ' + (err?.message ?? '알 수 없는 오류'));
          console.error('❌ 결제 실패:', err);
        },
      },
    );
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
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-12 items-start">
        {/* 좌측: 목록 */}
        <div className="flex-1">
          {/* 헤더 */}
          <div className="mb-8">
            <p className="text-sm tracking-[0.25em] text-white/60">STAGE101 • CART</p>
            <h1 className="mt-2 text-3xl font-semibold">
              선택한 <span className="text-[#C9A66B]">프로그램 & 굿즈</span>
            </h1>
            <p className="mt-2 text-white/70 text-sm">무대에서 만난 순간을 다시 담아보세요.</p>
          </div>

          {/* 상단 옵션 */}
          <div className="flex items-center gap-4 mb-6">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                className="accent-[#C9A66B] w-4 h-4"
                checked={selectedItems.length === cartItemsList.length && cartItemsList.length > 0}
                onChange={handleToggleSelectAll}
              />
              전체 선택
            </label>
            <button
              onClick={handleDeleteSelectedItems}
              className="text-sm border border-white/20 px-3 py-1 rounded hover:bg-white/10 transition"
            >
              선택 삭제
            </button>
          </div>

          {/* 리스트 */}
          {cartItemsList.length > 0 ? (
            <ul className="flex flex-col gap-6">
              {cartItemsList.map((item) => (
                <li
                  key={item.id}
                  className="relative flex flex-col sm:flex-row gap-4 bg-white/[0.04] 
                         border border-white/10 rounded-2xl p-4 
                         shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
                >
                  {/* 삭제 */}
                  <button
                    onClick={() => handleDeleteItem(item.shop_id)}
                    className="absolute top-3 right-3 text-white/50 hover:text-white"
                  >
                    <DeleteIcon />
                  </button>

                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleToggleSelect(item.id)}
                    className="accent-[#C9A66B] w-4 h-4 mt-2"
                  />

                  {/* 이미지 */}
                  <div className="flex-shrink-0 flex justify-center sm:justify-start">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={110}
                      height={110}
                      className="rounded-xl object-cover"
                    />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 flex flex-col justify-between items-center sm:items-start text-center sm:text-left">
                    <Link href={`/shop/${item.shop_id}`}>
                      <p className="text-lg font-semibold">{item.name}</p>
                    </Link>
                    <p className="text-[#C9A66B] font-semibold">
                      {(item.point * item.quantity).toLocaleString()} Point
                    </p>{' '}
                    {/* 수량 */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleQuantityChange(item.shop_id, item.quantity - 1)}
                        className="p-2 rounded-full border border-white/20 hover:bg-white/10"
                      >
                        <MinusIcon />
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.shop_id, item.quantity + 1)}
                        className="p-2 rounded-full border border-white/20 hover:bg-white/10"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-white/40 mt-12">아직 선택한 항목이 없습니다.</p>
          )}
        </div>

        {/* 우측: 결제 요약 */}
        <div className="w-full lg:w-[300px] sticky top-24">
          <div
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-6
                   shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
          >
            <div className="text-center border-b border-white/10 pb-4">
              <p className="text-sm tracking-widest text-white/60">CHECKOUT</p>
              <h2 className="mt-2 text-lg font-semibold">관람 준비</h2>
              <p className="mt-3 text-2xl font-semibold text-[#C9A66B]">
                {totalPoint.toLocaleString()} Point
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full rounded-xl bg-[#C9A66B] text-black font-semibold py-3
                     shadow-[0_10px_30px_rgba(201,166,107,0.25)]
                     hover:brightness-110 transition"
            >
              결제 진행하기
            </button>

            <p className="mt-4 text-xs text-white/50 text-center">선택한 항목만 결제됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
