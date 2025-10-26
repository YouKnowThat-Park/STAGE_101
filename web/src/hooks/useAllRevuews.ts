import { useInfiniteQuery } from '@tanstack/react-query';
import fetchAllReviews, { FetchAllReviewsResponse } from '../lib/fetchAllReviews';
import { useUserStore } from '../store/userStore'; // ✅ userId 가져오기

interface FetchAllReviewsProps {
  pageParam: number;
  sort: string;
  order: string;
  theaterId: string;
  userId?: string; // ✅ 선택적(optional) 필드
}

interface UseReviewsProps {
  sort?: string;
  order?: string;
  theaterId?: string;
}

export function useAllReviews({
  sort = 'created_at',
  order = 'desc',
  theaterId = '',
}: UseReviewsProps) {
  const userId = useUserStore((state) => state.id); // ✅ userId 가져오기

  return useInfiniteQuery<FetchAllReviewsResponse, Error>({
    queryKey: ['reviews', { sort, order, theaterId, userId }], // ✅ userId 추가
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchAllReviews({
        pageParam: pageParam as number,
        sort,
        order,
        theaterId,
        userId, // ✅ userId 추가
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage.totalCount;
      const currentCount = allPages.flatMap((page) => page.reviews).length;
      const nextPage = currentCount < totalCount ? lastPage.nextPage : undefined;

      return nextPage;
    },
  });
}
