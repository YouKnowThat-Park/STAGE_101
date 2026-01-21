'use client';
import React from 'react';
import { BsArrowBarUp } from 'react-icons/bs';
import { GoHome } from 'react-icons/go';

const FloatingActionButton = () => {
  return (
    <div>
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth', // 부드럽게
          })
        }
        className="fixed bottom-4 right-12 z-[9999] w-20 h-20 
                 flex items-center justify-center
                 bg-white/5 border rounded-full"
      >
        <BsArrowBarUp className="text-white" size={30} />
      </button>
      <a href="/">
        <div
          className="fixed bottom-4 right-36 z-[9999] w-20 h-20 
                      flex items-center justify-center
                      bg-white/5 border rounded-full"
        >
          <GoHome className="text-white text-2xl" size={30} />
        </div>
      </a>
    </div>
  );
};

export default FloatingActionButton;
