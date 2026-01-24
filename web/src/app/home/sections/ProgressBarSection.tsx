import React from 'react';
interface ProgressBarProps {
  images: unknown[];
  activeIndex: number;
  jumpTo: (index: number) => void;
}
const ProgressBarSection = ({ images, jumpTo, activeIndex }: ProgressBarProps) => {
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {images.map((_, idx) => (
        <button
          key={idx}
          onClick={() => jumpTo(idx)}
          className={`h-[4px] w-[34px] rounded-full transition-all ${
            idx === activeIndex ? 'bg-[#C9A66B]' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressBarSection;
