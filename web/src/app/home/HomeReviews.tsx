'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReviewRanking } from 'src/hooks/review/useReviewsRanking';
import { useEffect } from 'react';
export interface HomeReviewsProps {
  className?: string;
}

const crownIcons = ['👑', '🥈', '🥉'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

const HomeReviews = ({ className = '' }: HomeReviewsProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);
  const { data: ranking, isLoading } = useReviewRanking();

  return (
    <div
      className={`
        relative
        max-w-md
        rounded-2xl
        bg-black/60
        backdrop-blur
        ring-1 ring-white/10
        shadow-[0_20px_70px_rgba(0,0,0,0.7)]
        px-6 py-8
        text-white
        ${className}
      `}
    >
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
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="space-y-3"
        >
          {ranking?.map((user, index) => {
            const isTop = index === 0;

            return (
              <motion.li
                key={user.theater_id}
                custom={index}
                variants={fadeUp}
                className={`
                  group
                  flex items-center gap-4
                  rounded-xl
                  px-4 py-3
                  transition
                  ${
                    index === 0
                      ? 'bg-[#C9A66B]/15 ring-1 ring-[#C9A66B]/40'
                      : index === 1
                        ? 'bg-white/10 ring-1 ring-white/20'
                        : index === 2
                          ? 'bg-white/5 ring-1 ring-white/15'
                          : 'bg-white/[0.03] ring-1 ring-white/10'
                  }
                `}
              >
                {/* 랭킹 */}
                <div className="w-10 text-center text-2xl">
                  {crownIcons[index] || <span className="text-sm text-white/50">#{index + 1}</span>}
                </div>

                {/* 프로필 */}
                <div
                  className={`
                    relative
                    h-12 w-12
                    rounded-full
                    overflow-hidden
                    ring-1
                    ${isTop ? 'ring-[#C9A66B]' : 'ring-white/20'}
                  `}
                >
                  <Image
                    src={user.profile_img || '/default-avatar.png'}
                    alt={user.nickname}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>

                {/* 유저 정보 */}
                <div className="flex flex-col">
                  <span className="text-base font-semibold tracking-wide">{user.nickname}</span>
                  <span className="text-xs text-white/50">리뷰 {user.count}개</span>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
};

export default HomeReviews;
