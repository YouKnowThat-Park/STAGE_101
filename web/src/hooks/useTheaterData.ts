import { useQuery } from '@tanstack/react-query';
import { fetchTheaterData } from 'src/lib/api/theater/theater';

export const useTheaterData = (theaterId: string) => {
  return useQuery({
    queryKey: ['theater', theaterId], // ✅ theaterId를 key로 사용 (극장별 캐싱)
    queryFn: () => fetchTheaterData(theaterId), // ✅ 특정 극장만 불러오기
    enabled: !!theaterId, // ✅ theaterId가 있을 때만 실행
  });
};
