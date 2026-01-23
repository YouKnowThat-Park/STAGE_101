'use client';

import { motion } from 'framer-motion';
import ReviewListModal from '../modal/ReviewListModal';

const ReviewRankingModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-1 right-2 z-10 w-8 h-8 rounded-full bg-black text-white hover:bg-[#C9A66B] transition"
        >
          ✕
        </button>

        {/* 랭킹 내용 */}
        <ReviewListModal />
      </motion.div>
    </div>
  );
};

export default ReviewRankingModal;
