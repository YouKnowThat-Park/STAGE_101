'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const HomeImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = ['/main0.jpg', '/main1.jpg', '/main2.jpg', '/main.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full max-w-[1100px] h-[300px] sm:h-[400px] bg-white shadow-md rounded-lg p-1 overflow-hidden">
      <Image
        src={images[currentSlide]}
        alt={`slide-${currentSlide}`}
        height={300}
        width={800}
        className="w-full h-full object-cover rounded-md transition-all duration-700"
      />
    </div>
  );
};

export default HomeImageSlider;
