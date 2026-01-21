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

  return (
    <p className="mt-6 text-center text-xs text-white/50 tracking-wide">
      <span className="text-[#C9A66B] font-medium">{count}초</span> 후 메인 페이지로 자동 이동합니다
    </p>
  );
};

export default HomeCountdownText;
