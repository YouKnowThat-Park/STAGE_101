import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfileImage } from 'src/lib/api/user/updateUserProfileImage';
import { MypageUserResponse } from 'src/types/user/user-type';

export const useUpdateUserProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfileImage,
    onSuccess: (newUrl) => {
      queryClient.setQueryData<MypageUserResponse | undefined>(['userData', 'me'], (prev) =>
        prev ? { ...prev, profile_img: newUrl } : prev,
      );
    },
  });
};
