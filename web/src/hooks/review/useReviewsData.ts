import { useInfiniteQuery } from '@tanstack/react-query';
import fetchAllReviews from 'src/lib/api/review/review';

export const useInfiniteReviews = (sort: 'newest' | 'oldest' = 'newest', userId?: string) => {
  return useInfiniteQuery({
    queryKey: ['reviews', { sort, userId }],
    queryFn: ({ pageParam = 1 }) =>
      fetchAllReviews({
        pageParam,
        sort,
        order: sort === 'newest' ? 'desc' : 'asc',
        userId,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = lastPage.totalCount;
      const currentCount = allPages.flatMap((page) => page.reviews).length;
      return currentCount < totalCount ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
  });
};
