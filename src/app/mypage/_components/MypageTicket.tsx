import React from 'react';

const MypageTicket = () => {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">예약한 표</h2>
      <div className="w-[100px] h-[100px] bg-green-500">예약 이미지</div>
      <div>예약 극장 이름</div>
      <div>시작 시간</div>
      <div>극장 설명</div>
      <div>가격</div>
      <button>취소</button>
    </section>
  );
};

export default MypageTicket;
