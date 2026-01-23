'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useReviewRanking } from 'src/hooks/review/useReviewsRanking';

const crownIcons = ['👑', '🥈', '🥉'];

const ReviewRankingModal = ({ onClose }: { onClose: () => void }) => {
  const { data: ranking, isLoading } = useReviewRanking();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="
          relative
          max-w-md w-full
          rounded-2xl
          bg-black/60
          backdrop-blur
          ring-1 ring-white/10
          shadow-[0_20px_70px_rgba(0,0,0,0.7)]
          px-6 py-8
          text-white
        "
      >
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-[#C9A66B] transition"
        >
          ✕
        </button>

        {/* 헤더 */}
        <div className="mb-6 text-center">
          <p className="text-xs tracking-[0.35em] text-white/40">STAGE101 • REVIEW</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#C9A66B]">TOP REVIEWERS</h2>
        </div>

        {isLoading ? (
          <p className="text-center text-white/50 italic">랭킹 불러오는 중…</p>
        ) : ranking?.length === 0 ? (
          <p className="text-center text-white/40 italic">아직 리뷰가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {ranking?.map((user, index) => (
              <li
                key={user.theater_id}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                  index === 0
                    ? 'bg-[#C9A66B]/15 ring-1 ring-[#C9A66B]/40'
                    : 'bg-white/5 ring-1 ring-white/10'
                }`}
              >
                <div className="w-10 text-center text-2xl">
                  {crownIcons[index] || <span className="text-sm">#{index + 1}</span>}
                </div>

                <div className="relative h-12 w-12 rounded-full overflow-hidden ring-1 ring-white/20">
                  <Image
                    src={user.profile_img || '/default-avatar.png'}
                    alt={user.nickname}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold">{user.nickname}</p>
                  <p className="text-xs text-white/50">리뷰 {user.count}개</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewRankingModal;
