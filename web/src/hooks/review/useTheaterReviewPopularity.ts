'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchTheaterReviewPopularity } from 'src/lib/api/review/fetchTheaterReviewPopularity';
import type { TheaterReviewRanking } from 'src/types/review/review-type';

export const useTheaterReviewPopularity = () => {
  return useQuery<TheaterReviewRanking[]>({
    queryKey: ['theaterReviewRanking'],
    queryFn: fetchTheaterReviewPopularity,
  });
};
