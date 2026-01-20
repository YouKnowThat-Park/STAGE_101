'use client';

import { useParams } from 'next/navigation';
import { useTheaterData } from '../../../hooks/theater/useTheaterData';
import TheaterDetail from '../_components/TheaterDetail';

const TheaterPage = () => {
  const params = useParams();
  const theaterId = params?.id as string;

  const { data, isLoading, error } = useTheaterData(theaterId);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;
  if (!data) return <div>극장 정보를 불러올 수 없습니다.</div>;

  return <TheaterDetail data={data} theaterId={theaterId} />;
};

export default TheaterPage;
