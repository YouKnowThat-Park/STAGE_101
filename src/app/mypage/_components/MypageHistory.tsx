import NoHistoryIcon from '@/ui/icon/NoHistoryIcon';
import React from 'react';

const MypageHistory = () => {
  return (
    <section className="bg-white flex flex-col justify-center items-center gap-5">
      <NoHistoryIcon />
      <p>거래 내역이 없습니다.</p>
    </section>
  );
};

export default MypageHistory;
