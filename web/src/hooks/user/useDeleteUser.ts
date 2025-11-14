import { useMutation } from '@tanstack/react-query';
import { deleteUser } from 'src/lib/api/user/deleteUser';

export const useDeleteUser = () => {
  return useMutation({
    mutationKey: ['delete-user'],
    mutationFn: deleteUser,
  });
};
