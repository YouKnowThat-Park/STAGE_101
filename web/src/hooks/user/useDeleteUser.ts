import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from 'src/lib/api/user/deleteUser';
import { useUserStore } from 'src/store/userStore';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-user'],
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.clear();

      useUserStore.getState().reset?.();

      localStorage.clear();
      sessionStorage.clear();
    },
  });
};
