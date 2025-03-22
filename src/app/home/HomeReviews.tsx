'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TheaterRanking {
  theater_id: string;
  count: number;
  nickname: string;
  profile_img: string | null;
}

const crownIcons = ['👑', '🥈', '🥉'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const HomeReviews = () => {
  const [ranking, setRanking] = useState<TheaterRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch('/api/reviews/count-review');
        const data = await res.json();
        setRanking(data.ranking || []);
      } catch (error) {
        console.error('리뷰 랭킹 로딩 실패', error);
        setRanking([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="bg-[#1C1C1C] max-w-md  rounded-xl shadow-xl px-6 py-8 text-white">
      <h2 className="text-2xl font-bold text-center text-[#C9A66B] mb-6">리뷰 TOP 랭킹</h2>

      {isLoading ? (
        <p className="text-center text-gray-400 italic">⏳ 랭킹 로딩 중...</p>
      ) : ranking.length === 0 ? (
        <p className="text-center text-gray-500 italic">리뷰가 아직 없습니다.</p>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-4"
        >
          {ranking.map((user, index) => (
            <motion.li
              key={user.theater_id}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                index === 0
                  ? 'bg-[#3d2e14]/90 border border-yellow-500 shadow-md'
                  : index === 1
                    ? 'bg-[#2e3a44]/90 border border-gray-400'
                    : index === 2
                      ? 'bg-[#3f2e2e]/90 border border-orange-400'
                      : 'bg-[#2b2b2b]/90 border border-gray-600'
              }`}
              custom={index}
              variants={fadeUp}
            >
              {/* 랭킹 아이콘 */}

              <div className="text-3xl w-10 text-center">
                {crownIcons[index] || `#${index + 1}`}
              </div>

              {/* 프로필 */}
              <div className="relative w-12 h-12">
                <Image
                  src={user.profile_img || '/default-avatar.png'}
                  alt={user.nickname}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border border-gray-300"
                />
              </div>

              {/* 정보 */}
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{user.nickname}</span>
                <span className="text-sm text-gray-400 italic">{user.count}개 리뷰</span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default HomeReviews;
