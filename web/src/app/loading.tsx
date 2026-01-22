'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';

const Loading = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <Image
        src="/stage101_loader.webp"
        alt="로딩 중"
        width={300}
        height={300}
        className="animate-pulse"
        priority
      />
    </div>
  );
};

export default Loading;
