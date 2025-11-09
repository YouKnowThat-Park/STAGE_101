'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const HomeCountdownText = () => {
  const router = useRouter();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (count === 0) {
      router.push('/');
    }
  }, [count, router]);

  return <p className="text-gray-500">{count}초 후 메인 페이지로 자동 이동합니다.</p>;
};

export default HomeCountdownText;
