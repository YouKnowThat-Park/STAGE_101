import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfileImage } from 'src/lib/api/user/updateUserProfileImage';

export interface MeResponse {
  id: string;
  name: string;
  nickname: string;
  profile_img: string | null;
  phone: string | null;
  point: number | null;
}

export const useUpdateUserProfileImage = async () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfileImage,
    onSuccess: (newUrl) => {
      queryClient.setQueryData<MeResponse | undefined>(['me'], (prev) =>
        prev ? { ...prev, profile_img: newUrl } : prev,
      );
    },
  });
};
