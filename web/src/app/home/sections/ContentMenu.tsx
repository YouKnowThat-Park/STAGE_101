import React from 'react';
import { LuRectangleVertical } from 'react-icons/lu';
import { PiRankingDuotone } from 'react-icons/pi';
import { VscGraph, VscPreview } from 'react-icons/vsc';

interface ContentModalMenuProps {
  setIsReviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReviewRankingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGoodsGraphOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopularityOpen: React.Dispatch<React.SetStateAction<boolean>>;
  goPrev: () => void;
  goNext: () => void;
}

const ContentMenu = ({
  setIsReviewOpen,
  setIsReviewRankingOpen,
  setIsGoodsGraphOpen,
  setIsPopularityOpen,
  goPrev,
  goNext,
}: ContentModalMenuProps) => {
  return (
    <div className="flex justify-center items-center gap-10 mt-2 shadow-2xl ">
      <div>
        <button
          onClick={() => setIsReviewOpen(true)}
          className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50"
        >
          <span>
            <VscPreview className="text-white" size={30} />
          </span>
          <span>리뷰 보기</span>
        </button>
      </div>
      <div>
        <button
          onClick={() => setIsReviewRankingOpen(true)}
          className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50"
        >
          <span>
            <PiRankingDuotone className="text-white" size={30} />
          </span>
          <span>리뷰 랭킹</span>
        </button>
      </div>
      <div>
        <button
          onClick={() => setIsGoodsGraphOpen(true)}
          className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50"
        >
          <span>
            <VscGraph className="text-white" size={30} />
          </span>
          <span>굿즈 랭킹</span>
        </button>
      </div>
      <div>
        <button
          onClick={() => setIsPopularityOpen(true)}
          className=" text-white border p-4 rounded-lg mt-6 flex flex-col justify-center items-center shadow-2xl shadow-white/50"
        >
          <span>
            <VscGraph className="text-white" size={30} />
          </span>
          <span>예매 / 리뷰</span>
        </button>
      </div>

      <div
        className=" absolute right-5 bottom-2
       inline-flex items-center  rounded-sm
       bg-[#0b0b0b] border border-white/10
       shadow-[inset_0_2px_8px_rgba(0,0,0,0.85),_0_1px_0_rgba(255,255,255,0.04)]
     "
      >
        <button
          type="button"
          onClick={goPrev}
          aria-label="이전 이미지"
          className="
         group h-9 w-9 rounded-sm
         flex items-center justify-center
         bg-[#111] text-white
         
         shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),_0_1px_0_rgba(255,255,255,0.05)]
         hover:text-[#C9A66B] hover:bg-[#141414]
         active:text-[#C9A66B] active:bg-[#0f0f0f] active:translate-y-[1px]
         active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.95)]
         transition-all
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A66B]/50
       "
        >
          <LuRectangleVertical className="h-7 w-5 opacity-90 group-hover:opacity-100 transition" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="다음 이미지"
          className="
         group h-9 w-9 rounded-sm
         flex items-center justify-center
         bg-[#111] text-white
         
         shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),_0_1px_0_rgba(255,255,255,0.05)]
         hover:text-[#C9A66B] hover:bg-[#141414]
         active:text-[#C9A66B] active:bg-[#0f0f0f] active:translate-y-[1px]
         active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.95)]
         transition-all
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A66B]/50
       "
        >
          <LuRectangleVertical className="h-7 w-5 rotate-180 opacity-90 group-hover:opacity-100 transition" />
        </button>
      </div>
    </div>
  );
};

export default ContentMenu;
