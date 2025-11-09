'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import React from 'react';

const CartSuccessRedirect = () => {
  const router = useRouter();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const countdown = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (count === 0) {
      router.push('/');
    }
  }, [count, router]);

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
