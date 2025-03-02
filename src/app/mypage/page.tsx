import React from 'react';

const MyPage = () => {
  return (
    <div className="bg-white w-full h-[1000px] flex flex-col items-center gap-6 p-6">
      {/* 프로필 & 유저 정보 */}
      <div className="bg-slate-700 w-full max-w-4xl h-[200px] p-6 rounded-lg flex items-center gap-6">
        {/* 프로필 이미지 */}
        <div className="bg-gray-500 w-[150px] h-[150px] rounded-sm flex items-center justify-center">
          프로필 이미지
        </div>

        {/* 유저 정보 (닉네임/이름, 포인트) */}
        <div className="flex flex-col gap-2">
          <div className="bg-slate-500 px-4 py-2 rounded-md text-white">
            닉네임 / <span className="text-sm">이름</span>
          </div>
          <div className="bg-slate-500 px-4 py-2 rounded-md text-white">포인트: </div>
        </div>
      </div>

      {/* 예약한 표 */}
      <div className="bg-slate-300 w-full h-full max-w-4xl p-6 rounded-lg">
        <h2 className="text-lg font-bold mb-4">예약한 표</h2>
        <div className="bg-white p-4 rounded shadow">
          <div className="w-[100px] h-[100px] bg-green-500">예약 이미지</div>
          <div>예약 극장 이름</div>
          <div>시작 시간</div>
          <div>극장 설명</div>
          <div>가격</div>
          <button>취소</button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
