'use client';

import { useRouter } from 'next/navigation';

import React from 'react';

const CartSuccessRedirect = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="
        mt-6 w-full rounded-xl
        bg-[#C9A66B] text-black font-semibold
        py-3
        shadow-[0_10px_30px_rgba(201,166,107,0.25)]
        hover:brightness-110
        active:scale-[0.99]
        transition
      "
    >
      홈으로 돌아가기
    </button>
  );
};

export default CartSuccessRedirect;
