'use client';

import Image from 'next/image';

const Loading = () => {
  return (
    <div className="relative min-h-[calc(100vh-160px)] w-full">
      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
        <Image
          src="/stage101_loader.webp"
          alt="로딩 중"
          width={300}
          height={300}
          className="animate-pulse"
          priority
        />
      </div>
    </div>
  );
};

export default Loading;
