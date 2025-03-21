'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface TheaterRanking {
  theater_id: string;
  count: number;
  nickname: string; // ✅ nickname 유지
  profile_img: string | null;
}

const HomeReviews = () => {
  const [ranking, setRanking] = useState<TheaterRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch('/api/reviews/count-review');
        if (!response.ok) throw new Error('리뷰 랭킹을 불러오는데 실패했습니다.');

        const data = await response.json();
        console.log('📢 [DEBUG] 서버 응답:', data);
        setRanking(data.ranking || []);
      } catch (error) {
        console.error('🚨 리뷰 랭킹 조회 실패:', error);
        setRanking([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="h-[400px] w-full bg-white shadow-md rounded-lg flex flex-col items-center p-3">
      <p className="font-black mt-2">리뷰 작성 TOP 랭킹</p>

      {isLoading ? (
        <p className="mt-4 text-gray-500">⏳ 로딩 중...</p>
      ) : ranking.length === 0 ? (
        <p className="mt-4 text-gray-500">❌ 데이터 없음</p>
      ) : (
        <ul className="mt-4 w-full text-center">
          {ranking.map((theater, index) => (
            <li key={theater.theater_id} className="py-2 border-b flex items-center gap-2">
              <span className="font-bold">#{index + 1}</span>
              {/* ✅ Next.js Image 태그 적용 & 기본 이미지 처리 */}
              <Image
                src={theater.profile_img ? theater.profile_img : '/next.svg'}
                alt={theater.nickname || '익명'}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-semibold">{theater.nickname || '익명'}</span>- {theater.count}개
              리뷰
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeReviews;
