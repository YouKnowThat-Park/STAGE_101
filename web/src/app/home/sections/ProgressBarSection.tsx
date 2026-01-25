import React from 'react';
interface ProgressBarProps {
  images: unknown[];
  activeIndex: number;
  jumpTo: (index: number) => void;
}

const BAR_COUNT = 5;

const ProgressBarSection = ({ images, jumpTo, activeIndex }: ProgressBarProps) => {
  const total = images.length;

  const activeBarIndex =
    total <= BAR_COUNT ? activeIndex : Math.floor((activeIndex / (total - 1)) * (BAR_COUNT - 1));

  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: BAR_COUNT }).map((_, idx) => {
        const targetIndex =
          total <= BAR_COUNT ? idx : Math.floor((idx / (BAR_COUNT - 1)) * (total - 1));

        return (
          <button
            key={idx}
            onClick={() => jumpTo(targetIndex)}
            className={`h-[4px] w-[34px] rounded-full transition-all ${
              idx === activeBarIndex ? 'bg-[#C9A66B]' : 'bg-gray-300'
            }`}
          />
        );
      })}
    </div>
  );
};

export default ProgressBarSection;
