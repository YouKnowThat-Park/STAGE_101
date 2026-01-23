import React from 'react';

const TheaterPopularityModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-[#111] p-6 rounded-xl w-[1040px] text-white relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          ✕
        </button>
        <h2 className="text-center mb-4 text-[#C9A66B] font-bold">많이 판매 된 굿즈</h2>
      </div>
    </div>
  );
};

export default TheaterPopularityModal;
