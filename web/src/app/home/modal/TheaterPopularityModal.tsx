import React from 'react';
import TopReservation from './_components/TopReservation';
import { useLockBodyScroll } from 'src/hooks/useLockBodyScroll';
import TopReviewChart from './_components/TopReviewCart';

const TheaterPopularityModal = ({ onClose }: { onClose: () => void }) => {
  useLockBodyScroll();
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#111] p-6 rounded-xl h-[450px] text-white relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          ✕
        </button>
        <div className="flex">
          <div>
            <h2 className="text-center mb-4 text-[#C9A66B] font-bold">BAST 작품</h2>
            <TopReservation />
          </div>
          <div className="border border-l-2" />
          <div>
            <h2 className="text-center mb-4 text-[#C9A66B] font-bold">BAST 작품</h2>
            <TopReviewChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterPopularityModal;
