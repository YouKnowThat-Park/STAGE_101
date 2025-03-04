import { useQnaData } from '@/hooks/useQnaData';
import NoQnAIcon from '@/ui/icon/NoQnAIcon';
import React from 'react';

const MypageQna = () => {
  const { data: qna } = useQnaData();

  const formatDateToKST = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
  return (
    <section className="bg-white flex flex-col">
      <ul>
        {qna?.length > 0 ? (
          qna.map((qna: any) => (
            <li key={qna.id}>
              <h2 className="font-medium text-xl">{qna.title}</h2>
              <p>{formatDateToKST(qna.created_at)}</p>
              <p className="text-base">{qna.message}</p>
            </li>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center">
            <NoQnAIcon />
            <p>문의한 내역이 없습니다.</p>
          </div>
        )}
      </ul>
    </section>
  );
};

export default MypageQna;
