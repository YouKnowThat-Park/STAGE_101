import NoTicketIcon from '@/ui/icon/NoTicketIcon';
import React from 'react';

const MypageTicket = () => {
  return (
    <section className="bg-white h-[500px]">
      <div className=" flex flex-col justify-center items-center gap-5">
        <NoTicketIcon />
        <p>예약한 티켓이 존재하지 않습니다.</p>
      </div>
    </section>
  );
};

export default MypageTicket;
