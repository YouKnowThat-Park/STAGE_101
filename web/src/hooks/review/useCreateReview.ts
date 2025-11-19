import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReviews } from 'src/lib/api/review/review';
import { CreatedReview, CreateReviewParams } from 'src/types/review/review-type';

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatedReview, Error, CreateReviewParams>({
    mutationKey: ['create-review'],
    mutationFn: createReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] }),
        queryClient.invalidateQueries({ queryKey: ['user-my-reviews'] });
    },
  });
};
