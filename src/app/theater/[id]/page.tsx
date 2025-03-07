'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTheaterData } from '@/hooks/useTheaterData';
// import CinemaA from '@/app/theater/_components/CinemaA';
// import CinemaB from '@/app/theater/_components/CinemaB';
import MusicalA from '@/app/theater/_components/MusicalA';
import MusicalB from '@/app/theater/_components/MusicalB';

const TheaterPage = () => {
  const params = useParams();

  const theaterId = params?.id as string;

  const { data, isLoading, error } = useTheaterData(theaterId);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;
  if (!data) return <div>극장 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      {/* {data.type === 'cinemaA' && <CinemaA {...data} />}
      {data.type === 'cinemaB' && <CinemaB {...data} />} */}
      {data.type === 'musicalA' && <MusicalA {...data} />}
      {data.type === 'musicalB' && <MusicalB {...data} theaterId={theaterId} />}
    </div>
  );
};

export default TheaterPage;
