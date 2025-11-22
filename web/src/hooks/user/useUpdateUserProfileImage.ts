import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateUserProfileData,
  updateUserProfileImage,
} from 'src/lib/api/user/updateUserProfileImage';
import { MypageUserResponse, UpdateUserProfilePayload } from 'src/types/user/user-type';

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

export const useUpdateUserProfileData = () => {
  const queryClient = useQueryClient();

  return useMutation<MypageUserResponse, Error, UpdateUserProfilePayload>({
    mutationFn: (payload) => updateUserProfileData(payload),
    onSuccess: (data) => {
      // me 쿼리 최신화
      queryClient.setQueryData(['userData', 'me'], data);
    },
  });
};
