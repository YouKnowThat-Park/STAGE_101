import { useEffect, useState } from 'react';
import { fetchTheaterData } from 'src/lib/api/theater/theater';

export const useTheaterId = (theaterType: string) => {
  const [theaterId, setTheaterId] = useState<string>('');
  useEffect(() => {
    const loadTheaterId = async () => {
      try {
        const data = await fetchTheaterData(theaterType); // ✅ 문자열로 UUID 조회
        setTheaterId(data.id); // ✅ UUID 세팅
      } catch (error) {
        console.error('극장 정보를 불러오는 데 실패했습니다:', error);
      }
    };

    loadTheaterId();
  }, [theaterType]);

  return { theaterId };
};
