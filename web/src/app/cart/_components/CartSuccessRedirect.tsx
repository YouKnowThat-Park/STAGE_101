'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import React from 'react';

const CartSuccessRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <button
      onClick={() => router.push('/')}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
    >
      홈으로 즉시 이동
    </button>
  );
};

export default CartSuccessRedirect;
