import { useQnaData } from '../../../hooks/useQnaData';
import NoQnAIcon from '../../../ui/icon/NoQnAIcon';
import React from 'react';

const MypageQna = () => {
  const { data: qna } = useQnaData();

  const formatDateToKST = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <section className="flex flex-col items-center bg-white h-[500px] gap-5">
      {qna?.length > 0 ? (
        <div className="w-full max-w-lg p-5 rounded-lg shadow-md border bg-[#151515] border-black h-[480px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <h2 className="text-2xl font-bold text-white mb-4">My QnA</h2>
          <ul className="space-y-4">
            {qna.map((item: any) => (
              <li key={item.id} className="border p-4 rounded-lg bg-white shadow">
                <h2 className="font-medium text-xl">{item.title}</h2>
                <p className="text-sm text-gray-600">{formatDateToKST(item.created_at)}</p>
                <p className="text-base">{item.message}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <NoQnAIcon />
          <p>문의한 내역이 없습니다.</p>
        </div>
      )}
    </section>
  );
};

export default MypageQna;
