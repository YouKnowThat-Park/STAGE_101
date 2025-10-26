import fetchQnaData from '../utils/api/fetchQnaData';
import { useQuery } from '@tanstack/react-query';

export const useQnaData = () => {
  return useQuery({
    queryKey: ['qna'],
    queryFn: fetchQnaData,
    staleTime: 1000 * 60 * 5,
  });
};
